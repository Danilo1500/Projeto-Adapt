export const COMPANY_ROLES = Object.freeze(["owner", "admin", "recruiter", "viewer"]);
export const COMPANY_MEMBER_STATUSES = Object.freeze(["active", "pending", "removed"]);

const permissions = Object.freeze({
  owner: new Set(["view", "manageCompany", "manageMembers", "manageRoles", "manageJobs"]),
  admin: new Set(["view", "manageCompany", "manageMembers", "manageJobs"]),
  recruiter: new Set(["view", "manageJobs"]),
  viewer: new Set(["view"]),
});

export const getMemberUserId = (member) => {
  if (typeof member === "string" || typeof member === "number") return String(member);
  if (!member || typeof member !== "object") return "";
  const value = member.userId ?? member._id ?? member.user?._id ?? member.user;
  return value == null ? "" : String(value);
};

export const normalizeCompanyMember = (member) => {
  const userId = getMemberUserId(member);
  if (!userId) return null;
  const isLegacy = typeof member === "string" || typeof member === "number";
  const role = isLegacy ? "viewer" : COMPANY_ROLES.includes(member.role) && member.role !== "owner" ? member.role : "viewer";
  const status = isLegacy ? "active" : COMPANY_MEMBER_STATUSES.includes(member.status) ? member.status : "pending";
  const joinedAt = isLegacy ? null : member.joinedAt ?? null;
  return { userId, role, status, joinedAt };
};

export const getCompanyMembers = (company) => {
  const source = Array.isArray(company?.members) ? company.members : [];
  const byUserId = new Map();
  for (const rawMember of source) {
    const member = normalizeCompanyMember(rawMember);
    if (!member) continue;
    const previous = byUserId.get(member.userId);
    // Combine duplicate records conservatively: least privilege and least active status.
    if (!previous) byUserId.set(member.userId, member);
    else byUserId.set(member.userId, {
      userId: member.userId,
      role: roleRank(member.role) < roleRank(previous.role) ? member.role : previous.role,
      status: statusRank(member.status) > statusRank(previous.status) ? member.status : previous.status,
      joinedAt: [member.joinedAt, previous.joinedAt].filter(Boolean).sort((a, b) => new Date(a) - new Date(b))[0] ?? null,
    });
  }
  return [...byUserId.values()];
};

export const planCompanyMemberMigration = (company) => {
  const source = Array.isArray(company?.members) ? company.members : [];
  const grouped = new Map();
  const invalidEntries = [];
  source.forEach((rawMember, index) => {
    const member = normalizeCompanyMember(rawMember);
    if (!member) {
      invalidEntries.push(index);
      return;
    }
    const previous = grouped.get(member.userId);
    const changed = typeof rawMember === "string" || typeof rawMember === "number" ||
      rawMember.userId !== member.userId || rawMember.role !== member.role || rawMember.status !== member.status || rawMember.joinedAt == null;
    if (!previous) grouped.set(member.userId, { ...member, changed });
    else grouped.set(member.userId, {
      userId: member.userId,
      role: roleRank(member.role) < roleRank(previous.role) ? member.role : previous.role,
      status: statusRank(member.status) > statusRank(previous.status) ? member.status : previous.status,
      joinedAt: [member.joinedAt, previous.joinedAt].filter(Boolean).sort((a, b) => new Date(a) - new Date(b))[0] ?? null,
      changed: true,
    });
  });
  const members = [...grouped.values()].map(({ changed, ...member }) => ({
    ...member,
    joinedAt: member.joinedAt || company?.createdAt || null,
  }));
  return {
    members,
    changed: source.length !== members.length || [...grouped.values()].some(({ changed }) => changed),
    removedDuplicateCount: source.length - members.length - invalidEntries.length,
    invalidEntries,
    safeToApply: invalidEntries.length === 0,
    memberCountBefore: source.length,
    memberCountAfter: members.length,
  };
};

const roleRank = (role) => ({ viewer: 0, recruiter: 1, admin: 2, owner: 3 }[role] ?? 0);
const statusRank = (status) => ({ active: 0, pending: 1, removed: 2 }[status] ?? 2);

export const getCompanyAccess = (company, userId) => {
  if (!company || !userId) return { allowed: false, role: null, status: null, permissions: [] };
  const normalizedUserId = String(userId);
  if (String(company.ownerId) === normalizedUserId) {
    return { allowed: true, role: "owner", status: "active", permissions: [...permissions.owner] };
  }
  const member = getCompanyMembers(company).find((entry) => entry.userId === normalizedUserId);
  if (!member || member.status !== "active") return { allowed: false, role: member?.role ?? null, status: member?.status ?? null, permissions: [] };
  return { allowed: true, role: member.role, status: member.status, permissions: [...(permissions[member.role] || [])] };
};

export const hasCompanyPermission = (company, userId, permission) =>
  getCompanyAccess(company, userId).permissions.includes(permission);

export const upsertCompanyMember = (company, { userId, role = "viewer", status = "active", joinedAt = new Date() }) => {
  if (!userId || !COMPANY_ROLES.includes(role) || role === "owner" || !COMPANY_MEMBER_STATUSES.includes(status)) {
    throw new TypeError("Invalid company member data.");
  }
  const memberId = String(userId);
  const currentMembers = Array.isArray(company.members) ? company.members : [];
  const members = currentMembers.filter((member) => getMemberUserId(member) !== memberId);
  members.push({ userId: memberId, role, status, joinedAt });
  company.members = members;
  return members.find((member) => member.userId === memberId);
};

export const serializeCompanyMembers = async (company, User) => {
  const memberships = getCompanyMembers(company);
  const allIds = [...new Set([...memberships.map(({ userId }) => userId), ...(company?.ownerId ? [String(company.ownerId)] : [])])];
  const users = await User.find({ _id: { $in: allIds } }).select("_id full_name username profile_picture").lean();
  const byId = new Map(users.map((user) => [String(user._id), user]));
  const output = memberships.map((membership) => ({
    ...byId.get(membership.userId),
    _id: membership.userId,
    userId: membership.userId,
    role: String(company?.ownerId) === membership.userId ? "owner" : membership.role,
    status: membership.status,
    joinedAt: membership.joinedAt,
  })).filter((member) => byId.has(member.userId));
  if (company?.ownerId && byId.has(String(company.ownerId)) && !output.some(({ userId }) => userId === String(company.ownerId))) {
    const owner = byId.get(String(company.ownerId));
    output.unshift({ ...owner, userId: String(company.ownerId), role: "owner", status: "active", joinedAt: null });
  }
  return output;
};
