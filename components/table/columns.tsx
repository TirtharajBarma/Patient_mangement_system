"use client"

// help from DataTable shadcn
import { ColumnDef } from "@tanstack/react-table"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
// import AppointmentModel from "../AppointmentModel"
import { Appointment } from "@/types/appwrite.types"
import StatusBadge from "../StatusBadge"
import AppointmentModel from "../AppointmentModel"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
    {
        header: 'ID',
        cell: ({row}) => <p className="text-14-medium">{row.index + 1}</p>
    },
    {
        accessorKey: 'patient',
        header: 'Patient',
        cell: ({row}) => (
          <p className="text-14-medium">
            {row.original.patient?.name || "Unknown"}
          </p>
        )
        // needs the full patient object, not just the ID.
        
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            return (
                <div className="min-w-[115px]">
                    <StatusBadge status={row.original.status} />
                </div>
            )
        }
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({row}) => {
            return (
                <p className="text-14-regular min-w-[100px]">
                    {formatDateTime(row.original.schedule).dateTime}
                </p>
            )
        }
    },
    {
        accessorKey: "primaryPhysician",
        header: () => 'Doctor',
        cell: ({ row }) => {
            const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)

            return (
                <div className="flex items-center gap-3">
                    <Image 
                        src={doctor?.image || '/assets/images/default-doctor.png'}
                        alt={doctor?.name || 'Unknown Doctor' }
                        width={32}
                        height={100}
                        className="size-8"
                    />
                    <p className="whitespace-nowrap">
                        Dr. {doctor?.name}
                    </p>
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: () => <div className="pl-4">Actions</div>,
        cell: ({row: {original: data}}) => {
        //   console.log('Action Data:', data);
        //   console.log('Patient ID:', data.patient?.$id);
        // console.log('Action Data: in columns.tsx', { patientId: data.patient?.$id, userId: data.userId, appointment: data });
            return (
                <div className="flex gap-1">
                    <AppointmentModel 
                      type='schedule' 
                      patientId={data.patient?.$id || 'default-patient-id'} 
                      userId={data.userId}
                      appointment={data}
                    />
                    <AppointmentModel 
                      type='cancel' 
                      patientId={data.patient?.$id || 'default-patient-id'} 
                      userId={data.userId}
                      appointment={data}
                    />
                </div>
            )
        }
    }
]