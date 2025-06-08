"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "@/types/appwrite.types"
 
const AppointmentForm = ({userId, patientId, type, appointment, setOpen}: {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment?: Appointment;
    setOpen?: (open: boolean) => void
}) => {
    const [isLoading, SetIsLoading] = useState(false);
    const router = useRouter();
    const AppointmentFormValidation = getAppointmentSchema(type);

    // console.log(appointment);

  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason:  appointment?.cancellationReason || ""
        },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log('I am submitting', {type})

     SetIsLoading(true);

     let status;
     switch (type) {
        case 'schedule':
            status = 'scheduled';
            break;
        case 'cancel':
            status = 'cancelled';
            break;
     
        default:
            status = 'pending'
            break;
     }

    //  since i pass create as props from page it is by default pending
    // console.log({type})

    try {
        if(type === 'create' && patientId){
            // console.log('I am here');

            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status
            }
            const appointment = await createAppointment(appointmentData);

            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        } else {

            // console.log('updating appointment');

            const appointmentToUpdate = {
                userId,
                appointmentId: appointment?.$id || '',
                appointment: {
                    primaryPhysician: values?.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason,
                },
                type
            }

            const updatedAppointment = await updateAppointment(appointmentToUpdate);
            if(updatedAppointment){
                if (setOpen) setOpen(false);
                form.reset();
            }
        }

    } catch (error) {
      console.log(error);
    } finally {
      SetIsLoading(false);
    }
  }

    let buttonLabel;
    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment'
            break;
        
        case 'create':
            buttonLabel = 'Create Appointment'
            break;

        case 'schedule':
            buttonLabel = 'Schedule Appointment'
            break;
    
        default:
            break;
    }

  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">

        {type === 'create' && 
            <section className="mb-12 space-y-4">
                <h1 className="header">New Appointment</h1>
                <p className="text-dark-700">Request a new appointment in 10 seconds</p>
            </section>
        }

        {type !== "cancel" && (
            <>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    label="Doctor"
                    control={form.control}
                    name="primaryPhysician"
                    placeholder="Select a Doctor...."
                >
                    {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                        <Image
                            src={doctor.image}
                            width={32}
                            height={32}
                            alt={doctor.name}
                            className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                        </div>
                    </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Expected appointment date"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy - h:mm aa"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Reason for appointment"
                        placeholder="Enter reason for appointment"
                    />

                     <CustomFormField 
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Notes"
                        placeholder="Enter notes"
                    />
                </div>
            </>
        )}

        {type === 'cancel' && (
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Enter reason for cancellation"
            />
        )}
        
        <SubmitButton isLoading={isLoading} className={`${type == 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}> {buttonLabel} </SubmitButton>
      </form>
    </Form>
    </div>
  )
}

export default AppointmentForm
