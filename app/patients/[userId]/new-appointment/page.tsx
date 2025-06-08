import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PatientAppointmentWrapper from "@/components/forms/PatientAppointmentWrapper";
import { getPatients } from "@/lib/actions/patient.actions";
import { Patient } from "@/types/appwrite.types";

// Next.js 15 expects params to be a Promise<any> for app directory pages
export default async function NewAppointment({ params }: { params?: Promise<Record<string, string>> }) {
  const resolvedParams = params ? await params : {};
  const { userId } = resolvedParams;
  
  const patients: Patient[] = await getPatients(userId);

  // If no patients, show a message or redirect to register
  if (!patients || patients.length === 0) {
    return (
      <div className="flex h-screen max-h-screen items-center justify-center">
        <div className="text-center">
          <p>No patients found. Please register a patient first.</p>
          <Link href={`/patients/${userId}/register`}>
            <Button className="mt-4">Register Patient</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Render patient selection dropdown and appointment form
  return(
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[866px] flex-1 justify-between">
          
          <div className="flex items-center justify-between">
            <Image src='/assets/icons/medinest-logo.png' 
                height={300} 
                width={300} 
                alt="patient" 
                className="h-[190px] w-fit -my-8" />
            <Link href={`/patients/${userId}/register`}>
              <Button variant="outline" className="ml-4">Back to Patient Form</Button>
            </Link>
          </div>

          <PatientAppointmentWrapper userId={userId} patients={patients} />

          <p className="copyright py-12">© 2025 Tirtharaj</p>

        </div>
      </section>

      <Image 
        src='/assets/images/appointment-img.png'
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px] bg-bottom"
      />

    </div>

  )
}
