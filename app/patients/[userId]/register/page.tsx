import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';
import Image from 'next/image';
import React from 'react';

// ✅ Correct
const Register = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const resolvedParams = await params;
  const userId = resolvedParams?.userId;
  
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Fetch user data asynchronously
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image src='/assets/icons/medinest-logo.png' 
          height={300} 
          width={300} 
          alt="patient" 
          className="h-[190px] w-fit -my-8" />

          <RegisterForm user={user} />
          <p className="copyright py-12">© 2025 Tirtharaj</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
