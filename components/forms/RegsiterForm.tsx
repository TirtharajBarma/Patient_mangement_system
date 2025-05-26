"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants"
import { Label } from "../ui/label"
import Image from "next/image"
import { SelectItem } from "../ui/select"
import FileUploader from "../FileUploader"

 
const RegisterForm = ({user}: {user: User}) => {
    const [isLoading, SetIsLoading] = useState(false);
    const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)

     SetIsLoading(true);

    try {
        const userData = { name, email, phone };
        const user = await createUser(userData);
        if(user) router.push(`/patients/${user.$id}/register`);

    } catch (error) {
      console.log(error);
    }

  }
  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">

        <section className="space-y-4">
            <h1 className="text-3xl">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
        </section>


        {/* Personal Information Section */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            label = 'Full Name'
            control={form.control} 
            name = 'name'
            placeholder='Your name....'
            iconSrc = '/assets/icons/user.svg'
            iconAlt = 'user'
        />

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'email'
                label = 'Email'
                placeholder='Your email....'
                iconSrc = '/assets/icons/email.svg'
                iconAlt = 'email'
            />

            <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control} 
                name = 'phone'
                label = 'Phone Number'
                placeholder='Your phone number....'
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control} 
                name = 'birthDate'
                label = 'Date of Birth'
            />

            <CustomFormField 
                fieldType={FormFieldType.SKELETON}
                control={form.control} 
                name = 'gender'
                label = 'Gender'
                renderSkeleton={(field) => (
                    <FormControl>
                        <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue="field.value">
                            {GenderOptions.map((option) => (
                                <div className="radio-group" key={option}>
                                    <RadioGroupItem value={option} id={option} />
                                    <Label htmlFor={option} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'address'
                label = 'Address'
                placeholder='Your address....'
            />

            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'occupation'
                label = 'Occupation'
                placeholder='Your occupation....'
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'emergencyContactName'
                label = 'Emergency contact name'
                placeholder="Guardian's name...."
            />

            <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control} 
                name = 'emergencyContactNumber'
                label = 'Emergency contact number'
                placeholder="Guardian's contact number...."
            />
        </div>
        

        {/* Medical Information Section */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Medical Information</h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            label = 'Primary Physician'
            control={form.control} 
            name = 'primaryPhysician'
            placeholder='Select a physician....' 
        >
                {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                        <div className="flex cursor-pointer items-center gap-2">
                            <Image 
                                src={doctor.image}
                                width={32}
                                height={32}
                                alt={doctor.name}
                                className='rounded-full border border-dark-500'
                            />
                            <p>{doctor.name}</p>
                        </div>
                    </SelectItem>
                ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'insuranceProvider'
                label = 'Insurance Provider'
                placeholder='Your Insurance Provider....'
            />

            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control} 
                name = 'insurancePolicyNumber'
                label = 'Insurance Policy Number'
                placeholder='Your Insurance Number....'
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control} 
                name = 'allergies'
                label = 'Allergies (if any)'
                placeholder='Any allergies you have....'
            />

            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control} 
                name = 'currentMedication'
                label = 'Current Medication (if any)'
                placeholder='Medication....'
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control} 
                name = 'familyMedicalHistory'
                label = 'Family Medical History'
                placeholder='family History....'
            />

            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control} 
                name = 'pastMedicalHistory'
                label = 'Past Medical History'
                placeholder='Medical History....'
            />
        </div>


        {/* Identification section */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification and Verification</h2>

            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            label = 'Identification Type'
            control={form.control} 
            name = 'identificationType'
            placeholder='Select an Identification Type....' 
        >
                {IdentificationTypes.map((type) => (
                    <SelectItem key={type} value={type} >
                       {type}
                    </SelectItem>
                ))}
        </CustomFormField>

         <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control} 
            name = 'identificationNumber'
            label = 'Identification Number'
            placeholder='Identification Number....'
        />

        <CustomFormField 
            fieldType={FormFieldType.SKELETON}
            control={form.control} 
            name = 'identificationDocument'
            label = 'Scanned copy of identification document'
            renderSkeleton={(field) => (
                <FormControl>
                    <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
            )}
        />

        {/* Consent section */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>

            </div>
        </section>
        
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='treatmentConsent'
            label="I consent to treatment"
        />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='discloserConsent'
            label="I consent to Disclosure of Information"
        />
        <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='privacyConsent'
            label="I consent to Privacy Policy"
        />


        <SubmitButton isLoading={isLoading}> Get Started </SubmitButton>
      </form>
    </Form>
    </div>
  )
}

export default RegisterForm
