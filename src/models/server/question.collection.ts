import {IndexType, Permission} from "node-appwrite";

import {db,questionCollection} from "../name"
import { databases } from "./config";

export default async function createQuestionCollection() {
    // creare collection
    await databases.createCollection(db, questionCollection,questionCollection,[
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users")
    ]);
    console.log("Question collection is created successfully ");


    // creating attributes 
    await Promise.all([
        Promise.all([
            databases.createStringAttribute(db,questionCollection,"title",100,true),
            databases.createStringAttribute(db,questionCollection,"content",1000,true),
            databases.createStringAttribute(db,questionCollection,"autherId",50,true),
            databases.createStringAttribute(db,questionCollection,"tags",50,true, undefined,true),
            databases.createStringAttribute(db,questionCollection,"attachmentId",50,false)
        ])
    ])
    
    console.log("Question collection attribures are created successfully ");

    // creating indexes for the collection : questionCollection
    await Promise.all([
        databases.createIndex(db,questionCollection,"title",IndexType.Fulltext,["title"],['asc']),
        databases.createIndex(db,questionCollection,"content",IndexType.Fulltext,["content"],['asc']),
        databases.createIndex(db,questionCollection,"autherId",IndexType.Fulltext,["autherId"],['asc']),
        databases.createIndex(db,questionCollection,"tags",IndexType.Fulltext,["tags"],['asc']),
        databases.createIndex(db,questionCollection,"attachmentId",IndexType.Fulltext,["attachmentId"],['asc'])
    ])

}

