import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SuccessPage = async ({ params, searchParams }: { params?: Promise<Record<string, string>>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) => {
    // Await params and searchParams before accessing their properties
    const resolvedParams = params ? await params : {};
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const { userId } = resolvedParams;
    const appointmentId = (resolvedSearchParams?.appointmentId as string) || '';
    const appointment = await getAppointment(appointmentId);
    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician)

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
         <Link href='/'>
            <Image src='/assets/icons/medinest-logo.png' 
                height={300} 
                width={300} 
                alt="patient" 
                className="h-[190px] w-fit -my-10" />
        </Link>

        <section className='flex flex-col items-center'>
            <Image 
                src='/assets/gifs/success.gif'
                height={300}
                width={200}
                alt='success'
                unoptimized
            />
            <h2 className='header mb-6 max-w-[600px] text-center'>
                Your <span className='text-green-500'>appointment request</span> has been successfully submitted
            </h2>
            <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className='request-details'>
            <p>Requested appointment details</p>
            <div className='flex items-center gap-3'>
                <Image 
                    src={doctor?.image || '/assets/images/default-doctor.png'}
                    alt='doctor'
                    width={100}
                    height={100}
                    className='size-6'
                />
                <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
            </div>
            <div className='flex gap-2'>
                <Image 
                    src='/assets/icons/calendar.svg'
                    width={24}
                    height={24}
                    alt='calendar'
                />
                <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
        </section>
        <Button variant='outline' className='shadow-primary-btn' asChild>
            <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
            </Link>
        </Button>
        <p className="copyright py-12">© 2025 Tirtharaj</p>
      </div>
    </div>
  )
}

export default SuccessPage
