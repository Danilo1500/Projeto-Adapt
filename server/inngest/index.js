import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "Adapt-app" });

// -------------------------
// USER CREATED
// -------------------------
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, image_url } = event.data;

    // 🔥 Email seguro
    const email =
      event.data?.email_addresses?.[0]?.email_address ||
      event.data?.primary_email_address_id ||
      null;

    if (!email) {
      console.error("❌ Clerk não enviou email no evento:", event.data);
      return;
    }

    let username = email.split("@")[0];

    // Checar username
    const existing = await User.findOne({ username });
    if (existing) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email,
      full_name: `${first_name} ${last_name}`,
      profile_picture: image_url,
      username,
    };

    await User.create(userData);
  }
);



// -------------------------
// USER UPDATED
// -------------------------
const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.update" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const email = email_addresses?.[0]?.email_address;
        if (!email) throw new Error("No email provided from Clerk on user.update");

        const updateUserData = {
            email,
            full_name: `${first_name || ""} ${last_name || ""}`,
            profile_picture: image_url,
        };

        await User.findByIdAndUpdate(id, updateUserData);
    }
);

// -------------------------
// USER DELETED
// -------------------------
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
];
