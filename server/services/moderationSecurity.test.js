import assert from "node:assert/strict";
import { analyzeContentLocally } from "./contentModeration.js";
import { hasActivePunishmentAt } from "./punishmentService.js";

const now = new Date("2026-10-31T12:00:00.000Z");
const active = { action: "suspended", createdAt: new Date("2026-10-31T11:00:00.000Z"), durationMinutes: 120 };
const expired = { action: "suspended", createdAt: new Date("2026-10-31T09:00:00.000Z"), durationMinutes: 120 };
assert.equal(hasActivePunishmentAt(active, now), true);
assert.equal(hasActivePunishmentAt(expired, now), false);

assert.equal(analyzeContentLocally("Projeto de desenvolvimento concluido.").status, "approved");
assert.equal(analyzeContentLocally("Acesse https://bit.ly/teste agora").categories.some((item) => item.category === "suspect_link"), true);

console.log("moderationSecurity.test: ok");
