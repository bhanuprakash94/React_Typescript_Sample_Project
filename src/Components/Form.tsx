import React, { useState } from "react";
import {
  Userschema as actionSchema,
  UserInterface as actionInterface,
} from "./../types";
import "./Form.css";

// Utility type to exclude actions
type fieldsWithoutActions = Omit<actionInterface, "actions">;

interface FormProps {
  fields: actionSchema<actionInterface>[];
  data: actionInterface;
  onSave: (data: actionInterface) => void;
  onCancel: () => void;
}

const UserForm: React.FC<FormProps> = ({ fields, data, onSave, onCancel }) => {
  const [formData, setFormData] = useState<fieldsWithoutActions>(data);
  const [errors, setErrors] = useState<{
    [key in keyof fieldsWithoutActions]?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof fieldsWithoutActions;
    const newErrors = validate(formData, fieldName);

    setErrors((prevErrors) =>
      newErrors[fieldName] ? newErrors : { [fieldName]: undefined }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: data.id !== 0 ? data.id : Math.floor(Math.random() * 10000),
    } as actionInterface);
  };

  const validate = (
    data: fieldsWithoutActions,
    name: keyof fieldsWithoutActions | null = null
  ) => {
    const newErrors: { [key in keyof fieldsWithoutActions]?: string } = {};

    const validationFields = name
      ? fields.filter((field) => field.field_name === name)
      : fields;

    validationFields.forEach((field) => {
      if (field.field_name === "actions") return; // Skip "actions" field in validation
      const value = data[field.field_name as keyof fieldsWithoutActions];
      if (field.required && (value === "" || value === undefined)) {
        newErrors[
          field.field_name as keyof fieldsWithoutActions
        ] = `${field.display_name} is required.`;
      } else if (field.field_name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value as string)) {
          newErrors[field.field_name as keyof fieldsWithoutActions] =
            "Please enter a valid email address.";
        }
      }
    });

    return newErrors;
  };

  return (
    <div className="form">
      <h2>{data.id ? "Edit User" : "Add User"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {fields.map((field) => {
            if (field.field_name === "id" || field.field_name === "actions")
              return null; // Skip the 'id' and 'actions' field
            return (
              <div key={field.field_name}>
                <label htmlFor={field.field_name}>{field.display_name}:</label>
                <input
                  type={field.type}
                  name={field.field_name}
                  placeholder={field.display_name}
                  value={(formData[field.field_name] ?? "") as string}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors[field.field_name as keyof fieldsWithoutActions] && (
                  <span className="error">
                    {errors[field.field_name as keyof fieldsWithoutActions]}
                  </span>
                )}
              </div>
            );
          })}
          <div className="buttons">
            <button type="submit">{data.id ? "Update" : "Add"} User</button>
            <button type="button" className="cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
