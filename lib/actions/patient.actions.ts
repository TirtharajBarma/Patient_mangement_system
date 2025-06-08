"use server";

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import {InputFile} from 'node-appwrite/file'

export const createUser = async(user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(), 
            user.email, 
            user.phone, 
            undefined, 
            user.name
        )
        return newUser;
        
    } catch (error: unknown) {
        // if user exists
        if (error && typeof error === 'object' && 'code' in error && (error as { code?: number }).code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents?.users[0];
        }
        throw error;
    }
}

export const getUser = async(userId: string) => {
    try {
        const user = await users.get(userId);
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error);
    }
}

export const registerPatient = async({identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        let file;
        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }
        
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }
        )
        return JSON.parse(JSON.stringify(newPatient));

    } catch(error){
        console.log(error);
    }
}

export const getPatient = async(userId: string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userId', userId)
            ]
        )
        if (!patient.documents || patient.documents.length === 0) {
            return null;
        }
        return JSON.parse(JSON.stringify(patient.documents[0]));
    } catch (error) {
        console.log(error);
    }
}

export const getPatients = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [
                Query.equal('userId', userId)
            ]
        );
        return JSON.parse(JSON.stringify(patients.documents));
    } catch (error) {
        console.log(error);
        return [];
    }
}


