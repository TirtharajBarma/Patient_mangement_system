"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';


const AppointmentModel = ({
  type, 
  patientId,
  userId,
  appointment,
}: {
  type: 'schedule' | 'cancel'
  patientId: string,
  userId: string,
  appointment?: Appointment 
}) => {

  const [open, setOpen] = useState(false);
  // console.log('AppointmentModel Data:', { type, patientId, userId, appointment });

  // dialog box of the appointment
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' className={`capitalize ${type === "schedule" ? "text-green-500" : ""}`}>
          {type}
        </Button>
      </DialogTrigger>

      <DialogContent className='shad-dialog sm:max-w-md'>
        <DialogHeader className='mt-4 space-y-3'>

          {/* schedule and cancel button -> type */}
          <DialogTitle className='capitalized'> {type} Appointment </DialogTitle>
          
          <DialogDescription>
            Please fill in the following details to {type} an appointment
          </DialogDescription>
        </DialogHeader>

        {/* form of the information */}
        <AppointmentForm 
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentModel
