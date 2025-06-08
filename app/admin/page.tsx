"use server";
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminAppointmentsTable from '@/components/table/AdminAppointmentsTable';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const page = async() => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_jwt")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
      isAdmin = decoded.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    redirect("/");
  }
  const appointments = await getRecentAppointmentList();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer'>
            <Image src='/assets/icons/medinest-logo.png' 
                height={300} 
                width={300} 
                alt="patient" 
                className="h-[165px] w-fit -my-8" />
        </Link>
        <div className="flex items-center gap-4">
          <p className='text-16-semibold'>Admin Dashboard</p>
          <form action="/api/admin-logout" method="POST">
            <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">Logout</button>
          </form>
        </div>
      </header>

      <main className='admin-main'>
        <section className='w-full space-y-4'>
            <h1 className='header'>Welcome</h1>
            <p className='text-dark-700'>Start the day with managing new appointment</p>
        </section>

        {/* header section */}
        <section className='admin-stat'>
            <StatCard 
                type = "appointments"
                count = {appointments.scheduledCount}
                label = 'Scheduled appointments'
                icon = '/assets/icons/appointments.svg'
            />

            <StatCard 
                type = "pending"
                count = {appointments.pendingCount}
                label = 'Pending appointments'
                icon = '/assets/icons/pending.svg'
            />

            <StatCard 
                type = "cancelled"
                count = {appointments.cancelledCount}
                label = 'Cancelled appointments'
                icon = '/assets/icons/cancelled.svg'
            />
        </section>

        {/* main section */}
        {/* dataTable with filter dropdown */}
        <AdminAppointmentsTable appointments={appointments.documents} />

      </main>

    </div>
  )
}

export default page