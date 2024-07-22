"use client"
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType{
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT='phoneInput',
  CHECKBOX='checkbox',
  DATE_PICKER='datePicker',
  SELECT='select',
  SKELETON='skeleton',
}
 
const  PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading]= useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email:"",
      phone:"",

    },
  })
async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);
      if (user) {
        router.push(`/patients/${user.$id}/register`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 🎩</h1>
          <p className="text-dark-700">
           Schedule your first appointment.
          </p>
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
        fieldTyp={FormFieldType.PHONE_INPUT}
        control= {form.control}
        name="phone"
        label="Phone number"
        placeholder="(+49)176 00000000"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
        />
        <SubmitButton isLoading={isLoading}>
          Get Started

        </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
