import { clerkClient } from "@clerk/express";

export const getAdminClerkOrganization = async (userId, organizationId, client = clerkClient) => {
  if (!userId || !organizationId) return null;
  const [organization, memberships] = await Promise.all([
    client.organizations.getOrganization({ organizationId }),
    client.organizations.getOrganizationMembershipList({ organizationId, userId: [userId], limit: 1 }),
  ]);
  const membership = memberships.data.find((item) => item.publicUserData?.userId === userId);
  return membership?.role === "org:admin" ? organization : null;
};
