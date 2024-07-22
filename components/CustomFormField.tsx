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
import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/PatientForm"
import { Label } from "@radix-ui/react-label"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../components/ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"

interface CustomProps{
    control: Control<any>,
    fieldTyp: FormFieldType,
    name: string,
    label?:string,
    placeholder?:string,
    iconSrc?:string,
    iconAlt?:string,
    disabled?:boolean,
    dateFormat?:string,
    showTimeSelect?:boolean,
    children?:React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode,
}

const RenderField = ({field, props} : { field:any; props:CustomProps}) =>{
 const {fieldTyp, renderSkeleton , iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat} = props;
    switch(props.fieldTyp){
    case FormFieldType.INPUT:
        return(
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
                {iconSrc && (
                    <Image
                    height={24}
                    width={24}
                    src={iconSrc}
                    alt={iconAlt || 'icon'}
                    className="ml-2"
                    />
                )}
                <FormControl>
                    <Input
                    placeholder={placeholder}
                    {...field}
                    className="shad-input border-0"
                    />

                </FormControl>
            </div>
        )
        case FormFieldType.PHONE_INPUT:
            return(
                <FormControl>
                    <PhoneInput
                     defaultCountry="DE" 
                     placeholder={placeholder}
                     international
                     withCountryCallingCode
                     //@ts-ignore
                     value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return(
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                 <Image
                 src="/assets/icons/calendar.svg"
                 height={24}
                 width={24}
                 alt="calnder"
                 className="ml-2"
                 />
                 <FormControl>
                 <DatePicker selected={field.value} 
                   onChange={(date) => field.onChange(date)} 
                   dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                   showTimeSelect={showTimeSelect ?? false}
                   timeInputLabel="Time"
                   wrapperClassName="date-picker"
                   />
                 </FormControl>
                </div>
            )
        case FormFieldType.SKELETON:
            return(
                renderSkeleton ? renderSkeleton(field)
                :null
            )
            case FormFieldType.SELECT:
                return (
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="shad-select-trigger">
                          <SelectValue placeholder={props.placeholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="shad-select-content">
                        {props.children}
                      </SelectContent>
                    </Select>
                  </FormControl>
                );
            case FormFieldType.TEXTAREA:
              return(
                <FormControl>
                  <Textarea
                  placeholder={placeholder}
                  {...field}
                  className="shad-textArea"
                  disabled={props.disabled}
                  />

                </FormControl>
              )
            case FormFieldType.CHECKBOX:
              return(
                 <div className="flex items-center gap-4">
                    <Checkbox
                    id={props.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                   <Label htmlFor={props.name}
                   className="checkbox-label"
                   >
                    {props.label}
                    </Label> 
                 </div>
              )
    break;
}
}

const  CustomFormField = (props: CustomProps) => {
    const {control, fieldTyp, name, label} = props;
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex-1">
        {fieldTyp !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
        )}
     <RenderField 
     field={field} props={props}/>
     <FormMessage className="shad-error"/>
      </FormItem>

    )}
  />
  )
}

export default CustomFormField