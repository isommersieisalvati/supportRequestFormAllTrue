import React from 'react'
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from 'react-redux';
import { saveFormData } from '../store/formSlice';
import type { RequestForm } from '../types/formTypes';
import { useNavigate } from 'react-router-dom';


const RequestFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.string().min(1, "Issue type is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  reproduceSteps: z.array(z.object({
    value: z.string().min(1, "Reproduce step is required"),
  })).min(1, "At least one reproduce step is required"),
})

type FormValues = z.infer<typeof RequestFormSchema>;

const RequestForm : React.FC= () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, register, handleSubmit,formState: { errors }, } = useForm<RequestForm>({
    defaultValues: {
      fullName: '',
      email: '',
      issueType: '',
      tags: [],
      reproduceSteps: [{ value: "" }],
    },
    mode: 'onBlur',
    resolver: zodResolver(RequestFormSchema),
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "reproduceSteps", // unique name for your Field Array
  });

  const onSubmit = (data: FormValues) => {
    dispatch(saveFormData(data));
    console.log('Form saved to Redux:', data);
    navigate('/confirmation');
  }

  return (
    <div className="support-form">

    <div className="div">Submit Your Request Support Here</div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fullName")} placeholder="Full Name" />
       <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        })}
        placeholder="Enter your email"
      />
      {errors.email && <p>{errors.email.message}</p>}
      <select {...register("issueType")}>
        <option value="bug">Bug Report</option>
        <option value="feature">Feature Request</option>
        <option value="general">General Inquiry</option>
      </select>
      <select
        id="tags"
        multiple
        {...register("tags", {
          validate: value =>
            value.length > 0 || "Select at least one tag",
        })}
      >
        <option value="ui">UI</option>
        <option value="backend">Backend</option>
        <option value="performance">Performance</option>
      </select>
        {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`reproduceSteps.${index}.value` as const)}
            defaultValue={field.value}
            placeholder={`Input ${index + 1}`}
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ value: "" })}
        style={{ marginTop: "10px" }}
      >
        Detailed Reproduce Steps
      </button>

      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default RequestForm
