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
      <div className="form-header">Support Request</div>
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/** Full Name Field */}
        <div className="form-full-name">
          <div className="form-container">
            <label htmlFor="fullName">Full Name:</label>
            <input id="fullName" {...register("fullName")} />
          </div>
          {errors.fullName && (
            <p className="error-message">{errors.fullName.message}</p>
          )}
        </div>

        {/** Email Field */}
        <div className="form-email">
          <div className="form-container">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/** Issue Type Field */}
        <div className="form-issue-type">
          <div className="form-container">
            <label htmlFor="issue-ype">Issue Type:</label>
            <Controller
              name="issueType"
              control={control}
              render={({ field }) => (
                <Select
                  inputId="issue-type"
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
          </div>
          {errors.issueType && (
            <p className="error-message">{errors.issueType.message}</p>
          )}
        </div>

        {/** Tags Field */}
        <div className="form-tags">
          <div className="form-container">
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
        </div>

        {/** Reproduce Steps Field */}
        <div className="form-reproduce-steps">
          <div className="form-container">
            {fields.map((field, index) => (
              <div className="form-reproduce-step" key={field.id}>
                <div className="form-step-container">
                  <label htmlFor={`reproduce-steps-${index}`}>
                    Reproduce Step {index + 1}:
                  </label>
                  <input
                    id={`reproduce-steps-${index}`}
                    {...register(`reproduceSteps.${index}.step` as const)}
                    defaultValue={field.step}
                  />
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>

                {errors.reproduceSteps?.[index]?.step && (
                  <p>{errors.reproduceSteps[index].step.message}</p>
                )}
              </div>
            ))}
          </div>
          <button
            className="form-add-step"
            type="button"
            onClick={() => append({ step: "" })}
          >
            Add Detailed Reproduce Steps
          </button>
          {errors.reproduceSteps && (
            <p className="error-message">{errors.reproduceSteps.message}</p>
          )}
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
