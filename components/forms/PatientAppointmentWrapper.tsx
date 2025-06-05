"use client";
import { useState } from "react";
import AppointmentForm from "./AppointmentForm";
import { Patient } from "@/types/appwrite.types";

export default function PatientAppointmentWrapper({
  userId,
  patients,
}: {
  userId: string;
  patients: Patient[];
}) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.$id || "");

  return (
    <>
      <form>
        <label htmlFor="patient-select" className="block mb-2 font-semibold">
          Select Patient
        </label>
        <select
          id="patient-select"
          name="patientId"
          className="mb-6 p-2 border rounded w-full max-w-md"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
        >
          {patients.map((patient) => (
            <option key={patient.$id} value={patient.$id}>
              {patient.name} ({patient.gender}, {patient.birthDate?.toString().slice(0, 10)})
            </option>
          ))}
        </select>
      </form>
      <AppointmentForm
        type="create"
        userId={userId}
        patientId={selectedPatientId}
      />
    </>
  );
}
