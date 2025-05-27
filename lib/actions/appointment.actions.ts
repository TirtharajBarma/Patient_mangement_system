"use server";

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, } from "../appwrite.config";

export const createAppointment = async(appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment  
        )
        return JSON.parse(JSON.stringify(newAppointment));
    } catch (error) {
        console.log(error)
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )
        return JSON.parse(JSON.stringify(appointment));
    } catch (error) {
        console.log(error);
    }
}