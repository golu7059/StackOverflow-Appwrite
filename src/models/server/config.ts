// this is the server config file which will communicate with Appwrite

import env from "../../app/env";

import { Client, Avatars, Users, Databases, Storage } from "node-appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apiKey);

const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const users = new Users(client);

export { avatars, users, databases, storage };
