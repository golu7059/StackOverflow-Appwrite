import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

import { UserPref } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const bodyData = await request.json();
        const { questionId, answer, authorId } = bodyData;

        if (!questionId || !answer || !authorId) {
            return NextResponse.json({
                status: 400,
                message: "Please fill all the fields",
            });
        }

        // now create the document for the answer
        const document = await databases.createDocument(
            db,
            answerCollection,
            ID.unique(),
            {
                content: answer,
                authorId: authorId,
                questionId: questionId,
            }
        );

        // now we have to increase the user reputation
        const prefs = await users.getPrefs<UserPref>(authorId);
        await users.updatePrefs<UserPref>(authorId, {
            reputation: Number(prefs.reputation) + 1,
        });

        return NextResponse.json({
            status: 200,
            success: true,
            message: "Answer created successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            status: error.status || error.code || 500,
            message: error.message || "Error in creating answer",
        });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // collect the answerId from the body
        const bodyData = await request.json();
        const { answerId } = bodyData;

        // get the answer document from the database and delete it
        const answer = await databases.getDocument(db, answerCollection, answerId);
        if (!answer) {
            return NextResponse.json({
                status: 400,
                success: false,
                message: "unable to find the answer",
            });
        }

        // down the reputation of the user
        const prefs = await users.getPrefs<UserPref>(answer.authorId);
        await users.updatePrefs<UserPref>(answer.authorId, {
            reputation: Number(prefs.reputation) - 1,
        });

        // delete the answer
        const response  = await databases.deleteDocument(db, answerCollection, answerId);

        // return the response
        return NextResponse.json({
            status: 200,
            success: true,
            message: "Answer deleted successfully",
        });
    } catch (error: any) {
        return NextResponse.json({
            status: error.status || error.code || 500,
            message: error.message || "Error in deleting answer !",
        });
    }
}
