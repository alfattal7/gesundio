"use client"
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import {GenderOptions, IdentificationTypes, Doctors, PatientFormDefaultValues} from "@/constants/index"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";
import { PatientFormValidation } from "@/lib/validation";
const  RegisterForm = ({user}:{user:User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading]= useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email:"",
      phone:"",
      gender: undefined,
    },
  })
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
  return (
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 🎩</h1>
          <p className="text-dark-700">
           Let us know more about yourself
          </p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          </div>
          <h2 className="sun-header">
           Personal Informations
          </h2>
        </section>
        <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="name"
        label="Full name"
        placeholder="Mhd Bashar Al Fattal"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="email"
        label="Email"
        placeholder="basharalfattal@gmail.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        />
      <CustomFormField
        fieldTyp={FormFieldType.DATE_PICKER}
        control= {form.control}
        name="birthDate"
        label="Date of Birth"
        dateFormat="dd/MM/yyyy"
        />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldTyp={FormFieldType.PHONE_INPUT}
        control= {form.control}
        name="phone"
        label="Phone number"
        placeholder="(+49)176 00000000"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        />
       <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label className="cursor-pointer" htmlFor={option}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="address"
        label="Address"
        placeholder="Badstr.20 ,13357 Berlin"
        />
        <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="occupation"
        label="Occupation"
        placeholder="Software Engineer"
        />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="emergencyContactName"
        label="Emergency contact name"
        placeholder="Ahmad Al Sheikh"
        />
        <CustomFormField
        fieldTyp={FormFieldType.PHONE_INPUT}
        control= {form.control}
        name="emergencyContactNumber"
        label="Emergency contact number"
        placeholder="(+49)176 00000000"
        />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          </div>
          <h2 className="sun-header">
           Personal Informations
          </h2>
        </section>
        <CustomFormField
            fieldTyp={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex.row">
          <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="insuranceProvider"
        label="Insurance provider"
        placeholder="AOK,DAK, etc. "
        />
         <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="insurancePolicyNumber"
        label="Insurance policy number"
        placeholder="ABC123456789"
        />
      </div>
      <div className="flex flex-col gap-6 xl:flex.row">
          <CustomFormField
        fieldTyp={FormFieldType.TEXTAREA}
        control= {form.control}
        name="allergies"
        label="Allergies"
        placeholder="allergies of penicillin"
        />
         <CustomFormField
        fieldTyp={FormFieldType.TEXTAREA}
        control= {form.control}
        name="currentMedication"
        label="Current medication"
        placeholder="insulin, etc."
        />
      </div>
      <div className="flex flex-col gap-6 xl:flex.row">
          <CustomFormField
        fieldTyp={FormFieldType.TEXTAREA}
        control= {form.control}
        name="pastMedicalHistory"
        label="Past medical history"
        placeholder="insulin, etc."
        />
         <CustomFormField
        fieldTyp={FormFieldType.TEXTAREA}
        control= {form.control}
        name="familyMedicalHistory"
        label="Family medical history"
        placeholder="Mother and father diseases, etc."
        />
      </div>
      <section className="space-y-6">
          <div className="mb-9 space-y-1">
          </div>
          <h2 className="sun-header">
          Identification and Verification
          </h2>
        </section>
        <CustomFormField
            fieldTyp={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification type"
            placeholder="Select an identification type"
          >
            {IdentificationTypes.map((types) => (
              <SelectItem key={types} value={types}>
                {types}
              </SelectItem>
            ))}
          </CustomFormField>
      <CustomFormField
        fieldTyp={FormFieldType.INPUT}
        control= {form.control}
        name="identificationNumber"
        label="Identification number"
        placeholder="ABCD123456789"
        />
     <CustomFormField
        fieldTyp={FormFieldType.SKELETON}
        control= {form.control}
        name="identificationDocument"
        label="Identification document"
        renderSkeleton={(field)=>(
          <FormControl>
            <FileUploader 
            files={field.value}
            onChange={field.onChange}/>
          </FormControl>
        )}
        />
      <section className="space-y-6">
          <div className="mb-9 space-y-1">
          </div>
          <h2 className="sun-header">
          Consenst and Privacy
          </h2>
        </section>
        <CustomFormField
        fieldTyp={FormFieldType.CHECKBOX}
        control= {form.control}
        name="treatmentConsent"
        label="I consent to treatment"
        />
        <CustomFormField
        fieldTyp={FormFieldType.CHECKBOX}
        control= {form.control}
        name="disclosureConsent"
        label="I consent to disclosure of Informations"
        />
        <CustomFormField
        fieldTyp={FormFieldType.CHECKBOX}
        control= {form.control}
        name="privacyConsent"
        label="I consent to privacy policy"
        />
        <SubmitButton isLoading={isLoading}>
          Get Started
        </SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
