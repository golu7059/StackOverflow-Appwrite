import { Permission } from "appwrite";
import { questionAttachmentCollection } from "../name";
import { storage } from "./config";

export async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentCollection);
    console.log("storage Connected");
  } catch (error) {
    try {
      storage.createBucket(
        questionAttachmentCollection,
        questionAttachmentCollection,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false,
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
      console.log("storage created");
      console.log("storage connected");
    } catch (error) {
      console.log("error in creating the storage", error);
    }
  }
}

export default getOrCreateStorage;