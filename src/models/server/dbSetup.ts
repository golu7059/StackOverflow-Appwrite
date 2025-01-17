import { db } from "../name";

import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import createQuestionCollection from "./question.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database Connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("database is created");

      // creating the collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      console.log("all collections are created");
      console.log("Database is connected successfully ");
    } catch (error) {
      console.log("unable to connect the database : ", error);
    }
  }
}
