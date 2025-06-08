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

export const sendEmailNotification = async(userId: string, subject: string, content: string) => {
    try {
        const message = await messaging.createEmail(
            ID.unique(),
            subject,
            content,
            [],
            [userId]
        );
        return JSON.parse(JSON.stringify(message));
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
            const smsMessage = `\nHi, it's Tirtharaj [admin].\n${type === 'schedule' 
                ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}.`
                : `We regret to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
             }\n`;
            await sendSMSNotification(userId, smsMessage);

            // Email notification with HTML template
            const emailSubject = type === 'schedule'
                ? 'Your Appointment is Scheduled'
                : 'Your Appointment has been Cancelled';
                
            const emailBody = `
                <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
                  <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
                    <h2 style="color: #2e7d32; margin-bottom: 16px;">${emailSubject}</h2>
                    <p style="font-size: 16px; color: #333;">Dear Patient,</p>
                    <p style="font-size: 16px; color: #333;">
                      ${type === 'schedule'
                        ? `We are pleased to inform you that your appointment has been <b>scheduled</b> for <b>${formatDateTime(appointment.schedule!).dateTime}</b> with <b>Dr. ${appointment.primaryPhysician}</b>.`
                        : `We regret to inform you that your appointment has been <b>cancelled</b>.<br><b>Reason:</b> ${appointment.cancellationReason}`}
                    </p>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 14px; color: #888;">If you have any questions, please reply to this email.<br>Thank you,<br><b>Tirtharaj [admin]</b></p>
                  </div>
                </div>
            `;
            await sendEmailNotification(userId, emailSubject, emailBody);
        }

        revalidatePath('/admin');
        return JSON.parse(JSON.stringify(updatedAppointment));

    } catch (error) {
        console.log(error);
    }
}