
import {db,answerCollection} from "../name"
import {IndexType, Permission} from "node-appwrite";
import {databases} from "./config";

export default async function createAnswerCollection() {
    // creare collection
    await databases.createCollection(db, answerCollection,answerCollection,[
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ]);
    console.log("Answer collection is created successfully ");


    // creating attributes
        Promise.all([
            databases.createStringAttribute(db,answerCollection,"content",1000,true),
            databases.createStringAttribute(db,answerCollection,"autherId",50,true),
            databases.createStringAttribute(db,answerCollection,"attachmentId",50,false)
        ])
    
    console.log("Answer collection attribures are created successfully ");

}