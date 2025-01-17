import {db,commentCollection} from "../name"
import {IndexType, Permission} from "node-appwrite";
import {databases} from "./config";

export default async function createCommentCollection() {
    // creare collection
    await databases.createCollection(db, commentCollection,commentCollection,[
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ]);
    console.log("Comment collection is created successfully "); 


    // creating attributes  
    await Promise.all([
        Promise.all([
            databases.createStringAttribute(db,commentCollection,"content",1000,true),
            databases.createEnumAttribute(db,commentCollection, "type", ["answer","question"],true),
            databases.createStringAttribute(db,commentCollection,"typeId",50,true),
            databases.createStringAttribute(db,commentCollection,"authorId",50,true)
        ])
    ])
    
    console.log("Comment collection attribures are created successfully ");
}