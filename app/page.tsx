import Image from "next/image";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModel from "@/components/PasskeyModel";

// Use a more specific type for searchParams
export default async function Home({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const isAdmin = resolvedSearchParams?.admin === 'true';

  return(
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">

          {/* OTP verification */}
          {isAdmin && <PasskeyModel />}
          
          <Image src='/assets/icons/medinest-logo.png' 
          height={300} 
          width={300} 
          alt="patient" 
          className="h-[220px] w-fit -my-8" />

          <PatientForm />

          <div className="text-14-regular mt-10 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">© 2025 Tirtharaj</p>
            <Link href='/?admin=true' className="text-gray-500">
              Admin
            </Link>
          </div>

        </div>
      </section>

      <Image 
        src='/assets/images/onboarding-img.png'
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />

    </div>

  )
}
