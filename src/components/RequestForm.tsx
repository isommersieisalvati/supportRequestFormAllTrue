import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { saveFormData } from "../store/formSlice";
import type { RequestForm } from "../types/formTypes";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const RequestFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.string().min(1, "Issue type is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestForm>({
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "reproduceSteps",
  });

  const onSubmit = (data: FormValues) => {
    dispatch(saveFormData(data));
    console.log("Form saved to Redux:", data);
    navigate("/confirmation");
  };

  return (
    <div className="support-form">
      <div className="div">Submit Your Request Support Here</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="full-name">
          <label htmlFor="fullName">Full Name:</label>
          <input {...register("fullName")} />
        </div>
        <div className="email">
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
        <div className="issue-type">
          <label htmlFor="issueType">Issue Type:</label>
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
          {errors.issueType && (
            <p className="text-red-500 text-sm">{errors.issueType.message}</p>
          )}
        </div>
        <div className="tags">
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
          {errors.tags && <p style={{ color: "red" }}>{errors.tags.message}</p>}
        </div>
        <div className="reproduce-steps">
          <label>Reproduce Steps:</label>

          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                {...register(`reproduceSteps.${index}.step` as const)}
                defaultValue={field.step}
              />
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ step: "" })}>
            Add Another Step
          </button>
        </div>
        <div className="submit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
