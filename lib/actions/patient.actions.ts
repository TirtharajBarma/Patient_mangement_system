"use server";

import { ID, Query } from "node-appwrite"
import { users } from "../appwrite.config"

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
        
    } catch (error: any) {
        // if user exists
        if(error && error?.code === 409){
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