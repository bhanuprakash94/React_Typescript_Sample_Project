import React, { useState, useEffect } from "react";
import { Userschema, UserInterface } from "./types";
import "./UserForm.css";

interface UserFormProps {
  fields: Userschema[];
  user: Partial<UserInterface> | null;
  onSave: (user: UserInterface) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  fields,
  user,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<UserInterface>>({});
  const [errors, setErrors] = useState<{
    [key in keyof UserInterface]?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({});
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof UserInterface;
    const newErrors = validate(formData, fieldName);

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...(newErrors[fieldName] ? newErrors : { [fieldName]: undefined }),
    }));
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
      id: user?.id ?? Math.floor(Math.random() * 10000),
    } as UserInterface);
  };

  const validate = (
    data: Partial<UserInterface>,
    name: keyof UserInterface | null = null
  ) => {
    const newErrors: { [key in keyof UserInterface]?: string } = {};

    const validationFields = name
      ? fields.filter((field) => field.field_name === name)
      : fields;

    validationFields.forEach((field) => {
      const value = data[field.field_name];
      if (field.required && (value === "" || value === undefined)) {
        newErrors[
          field.field_name as keyof UserInterface
        ] = `${field.display_name} is required.`;
      } else if (field.field_name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value as string)) {
          newErrors[field.field_name as keyof UserInterface] =
            "Please enter a valid email address.";
        }
      }
    });

    return newErrors;
  };

  return (
    <div className="form">
      <h2>{user?.id ? "Edit User" : "Add User"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {fields.map((field) => (
            <div
              key={field.field_name}
              className={field.field_name === "id" ? "field_hide" : ""}
            >
              <label htmlFor={field.field_name}>{field.display_name}:</label>
              <input
                type={field.type}
                name={field.field_name}
                placeholder={field.display_name}
                value={(formData[field.field_name] ?? "") as string}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors[field.field_name as keyof UserInterface] && (
                <span className="error">
                  {errors[field.field_name as keyof UserInterface]}
                </span>
              )}
            </div>
          ))}
          <div className="buttons">
            <button type="submit">{user?.id ? "Update" : "Add"} User</button>
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
