import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const RenderField = ({ label, value }: { label: string; value: any }) => {
  if (Array.isArray(value)) {
    return (
      <div className="form-group">
        <div className="form-label">{label}:</div>
        <ul>
          {value.map((item, idx) => (
            <li key={idx}>
              <RenderField label={`#${idx + 1}`} value={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <div className="form-group">
        <div className="form-label">{label}:</div>
        <div className="form-nested">
          {Object.entries(value).map(([key, val]) => (
            <RenderField key={key} label={key} value={val} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="form-field">
        <span className="form-label">{label}:</span>{" "}
        <span className="form-value">{String(value)}</span>
      </div>
    );
  }
};

const Confirmation: React.FC = () => {
  const formData = useSelector((state: RootState) => state.form.data);

  if (!formData) return <div>No data submitted.</div>;

  return (
    <div className="form-container">
      <h2>Submitted Form Data</h2>
      {Object.entries(formData).map(([key, value]) => (
        <RenderField key={key} label={key} value={value} />
      ))}
    </div>
  );
};

export default Confirmation;
