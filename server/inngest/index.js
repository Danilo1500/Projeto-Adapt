import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "adapt-app" });

// -------------------------
// USER CREATED
// -------------------------
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    console.log("📨 EVENT RECEBIDO DO CLERK:", event.data);

    // Tentativas seguras para capturar o email (sem acessar [0])
    const email =
      event.data?.primary_email_address?.email_address ||
      event.data?.email_addresses?.find(e => e?.email_address)?.email_address ||
      null;

    if (!email) {
      console.error("❌ Nenhum email recebido do Clerk:", event.data);
      return;
    }

    const { id, first_name, last_name, image_url } = event.data;

    let username = email.split("@")[0];

    const existing = await User.findOne({ username });
    if (existing) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url,
      username,
    };

    await User.create(userData);

    console.log("✔ Usuário sincronizado com MongoDB:", userData);
  }
);

/* -------------------------------------------------------
   USER UPDATED
-------------------------------------------------------- */
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    const data = event.data;
    const { id, first_name, last_name, image_url } = data;

    // Email seguro sem acessar [0]
    const email =
      data?.primary_email_address?.email_address ||
      data?.email_addresses?.find(e => e?.email_address)?.email_address ||
      null;

    if (!email) {
      throw new Error("❌ Clerk não enviou email no evento user.updated");
    }

    const updateUserData = {
      email,
      full_name: `${first_name || ""} ${last_name || ""}`.trim(),
      profile_picture: image_url || "",
    };

    await User.findByIdAndUpdate(id, updateUserData, { new: true });

    await step.run("log-updated", () => {
      console.log("🔄 Usuário atualizado:", id, updateUserData);
    });
  }
);

/* -------------------------------------------------------
   USER DELETED
-------------------------------------------------------- */
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);

    await step.run("log-deleted", () => {
      console.log("🗑️ Usuário deletado:", id);
    });
  }
);

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
