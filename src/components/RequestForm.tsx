import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { saveFormData } from "../store/formSlice";
import type { SupportForm } from "../types/formTypes";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./RequestForm.css";

// Define the schema for form validation using Zod
const RequestFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.string().min(1, "Issue type is required"),
  tags: z.array(z.string()).min(0),
  reproduceSteps: z
    .array(
      z.object({
        step: z.string().min(1, "Reproduce step is required"),
      })
    )
    .min(1, "At least one reproduce step is required"),
});

type FormValues = z.infer<typeof RequestFormSchema>;

const RequestForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize the form with react-hook-form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupportForm>({
    defaultValues: {
      fullName: "",
      email: "",
      issueType: "",
      tags: [],
      reproduceSteps: [{ step: "" }],
    },
    mode: "onBlur",
    resolver: zodResolver(RequestFormSchema),
  });

  // Use useFieldArray for dynamic fields
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reproduceSteps",
  });

  // Options for issue type and tags
  const issueOptions = [
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "general", label: "General Inquiry" },
  ];

  const tagOptions = [
    { value: "ui", label: "UI" },
    { value: "backend", label: "Backend" },
    { value: "performance", label: "Performance" },
    { value: "security", label: "Security" },
  ];

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    dispatch(saveFormData(data));
    console.log("Form saved to Redux:", data);
    navigate("/confirmation");
  };

  return (
    <div className="request-form">
      {/* Form Header */}
      <div className="form-header">Submit Your Request Support Here</div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/** Full Name Field */}
        <div className="form-full-name">
          <label htmlFor="fullName">Full Name:</label>
          <input {...register("fullName")} />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>

        {/** Email Field */}
        <div className="form-email">
          <label htmlFor="email">Email:</label>

          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/** Issue Type Field */}
        <div className="form-issue-type">
          <label htmlFor="issue-ype">Issue Type:</label>
          <Controller
            name="issueType"
            control={control}
            render={({ field }) => (
              <Select
                options={issueOptions}
                value={issueOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(selected) =>
                  field.onChange(selected ? selected.value : "")
                }
              />
            )}
          />
          {errors.issueType && <p>{errors.issueType.message}</p>}
        </div>

        {/** Tags Field */}
        <div className="form-tags">
          <label htmlFor="tags">Tags:</label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="tags"
                options={tagOptions}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selected) => {
                  field.onChange(selected.map((opt) => opt.value));
                }}
                value={tagOptions.filter((opt) =>
                  field.value.includes(opt.value)
                )}
              />
            )}
          />
        </div>

        {/** Reproduce Steps Field */}
        <div className="form-reproduce-steps">
          <label>Reproduce Steps:</label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                {...register(`reproduceSteps.${index}.step` as const)}
                defaultValue={field.step}
              />
              {errors.reproduceSteps?.[index]?.step && (
                <p>{errors.reproduceSteps[index].step.message}</p>
              )}
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ step: "" })}>
            Add Another Step
          </button>
          {errors.reproduceSteps && <p>{errors.reproduceSteps.message}</p>}
        </div>

        {/** Submit Button */}
        <div className="form-submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
