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
      ? fields.filter((field) => field.name === name)
      : fields;

    validationFields.forEach((field) => {
      const value = data[field.name];
      if (field.required && (value === "" || value === undefined)) {
        newErrors[
          field.name as keyof UserInterface
        ] = `${field.display_name} is required.`;
      } else if (field.name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value as string)) {
          newErrors[field.name as keyof UserInterface] =
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
              key={field.name}
              className={field.name === "id" ? "field_hide" : ""}
            >
              <label htmlFor={field.name}>{field.display_name}:</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.display_name}
                value={(formData[field.name] ?? "") as string}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors[field.name as keyof UserInterface] && (
                <span className="error">
                  {errors[field.name as keyof UserInterface]}
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
