import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPref } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        // grab the data 
        const bodyData = await request.json();
        const {votedById, voteStatus, typeId, type} = bodyData;
        
        // list the document
        const response = await databases.listDocuments(db, voteCollection, [
            Query.equal("type",type),
            Query.equal("typeId",typeId),
            Query.equal("votedById",votedById)
        ])
        // multiple vote is not allowed , it will be remove the previous vote
        if(response.documents.length > 0){
            await databases.deleteDocument(db,voteCollection,response.documents[0].$id)
            // decrease reputation based on the type
            const questionOrAnswer = await databases.getDocument(db, type==="question" ? questionCollection : answerCollection, typeId);

            const prefs = await users.getPrefs<UserPref>(questionOrAnswer.authorId);
            await users.updatePrefs<UserPref>(questionOrAnswer.authorId, {
                reputation : response.documents[0].voteStatus === "upvoted" ? Number(prefs.reputation) - 1 : Number(prefs.reputation) + 1
            })
        }

        // previous vote doesn't exist or it's different vote than previous
        if(response.documents[0].voteStatus !== voteStatus){
            // create the document 
            const doc = await databases.createDocument(db,voteCollection,ID.unique(),{
                type : type,
                typeId : typeId,
                voteStatus : voteStatus,
                voteById : votedById
            })

            // increase or decrease reputation based on the type
            const questionOrAnswer = await databases.getDocument(db, type==="question" ? questionCollection : answerCollection, typeId);
            const authorPrefs = await users.getPrefs<UserPref>(questionOrAnswer.authorId);
            // now check that vote already present or not
            if(response.documents[0]){
                await users.updatePrefs<UserPref>(questionOrAnswer.authorId,{
                    reputation : response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1 
                })
            }
        }

        const[upVotes, downVotes] = await Promise.all([
            databases.listDocuments(db,voteCollection,[
                Query.equal("type", type),
                Query.equal("typeId",typeId),
                Query.equal("voteStatus","upvoted"),
                Query.equal("voteById",votedById),
                Query.limit(1)
            ]),
            databases.listDocuments(db,voteCollection,[
                Query.equal("type", type),
                Query.equal("typeId",typeId),
                Query.equal("voteStatus","downvoted"),
                Query.equal("voteById",votedById),
                Query.limit(1)
            ])
        ])

        return NextResponse.json({
            status : 200,
            data : {
                document : null,
                voteResult : upVotes.total = downVotes.total
            },
            message : "Voted successfully",
            success: true
        })
    } catch (error: any) {
       return NextResponse.json({
        error : error.message || "Error in voting !",
        status : error?.status || error?.code || 500
       }) 
    }
}