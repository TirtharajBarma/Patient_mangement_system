"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging, } from "../appwrite.config";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";
import { getPatient } from "./patient.actions";

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

export const getRecentAppointmentList = async() => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        // Fetch and attach patient object for each appointment
        const documentsWithPatient = await Promise.all(
            appointments.documents.map(async (appointment) => {
                // If appointment.patient is an ID, fetch the patient object
                if (appointment.patient && typeof appointment.patient === "string") {
                    const patientObj = await getPatient(appointment.patient);
                    return { ...appointment, patient: patientObj };
                }
                return appointment;
            })
        );

        // console.log(documentsWithPatient);

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (documentsWithPatient as Appointment[]).reduce((acc, appointment) => {
            if(appointment.status === 'scheduled'){
                acc.scheduledCount += 1;
            }
            else if(appointment.status === 'pending'){
                acc.pendingCount += 1;
            }
            else if(appointment.status === 'cancelled'){
                acc.cancelledCount += 1;
            }
            return acc;

        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: documentsWithPatient
        }

        return JSON.parse(JSON.stringify(data));

    } catch (error) {
        console.log(error);
    }
}

export const updateAppointment = async({appointmentId, userId, appointment, type}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )
        if(!updatedAppointment){
            throw new Error('Appointment not found');
        }
        else{
            // SMS notification
            const smsMessage = `
            Hi, it's Tirtharaj.
            ${type === 'schedule' 
                ? `your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}`
                : `We regret to inform you that your appointment has been cancelled for the following reason. Reason: ${appointment.cancellationReason}`
             }
            `

            await sendSMSNotification(userId, smsMessage);
        }

        revalidatePath('/admin');
        return JSON.parse(JSON.stringify(updatedAppointment));

    } catch (error) {
        console.log(error);
    }
}

export const sendSMSNotification = async(userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return JSON.parse(JSON.stringify(message)); 
    } catch (error) {
        console.log(error);
    }
}