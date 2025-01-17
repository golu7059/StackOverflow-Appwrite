// client/config.ts to initialize services that will communicate with Appwrite

import env from "../../app/env";

import { Client, Account, Avatars, Storage, Databases } from "appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Use endpoint from env
  .setProject(env.appwrite.projectId); // Use project ID from env

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export { account, client,storage, avatars, databases }; // Export initialized services

