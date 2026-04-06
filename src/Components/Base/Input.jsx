import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function BaseInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  showClear = false,
  rows = 3,
  disabled = false,
  className = "",
  iconLeft,
  iconRight,
  error = false,
  errormessage = "",
  showSearch = false,
  labelClassName,
  digitOnly = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const handleClear = () => {
    if (onChange) onChange({ target: { value: "" } });
  };

  const handleChange = (e) => {
    if (!onChange) return;

    let val = e.target.value;
    if (digitOnly) {
      val = val.replace(/\D/g, "");
    }

    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: val,
      },
    });
  };

  return (
    <div className="flex flex-col relative w-full">
      {label && (
        <label
          className={`mb-1 text-sm font-semibold text-gray-700 ${labelClassName}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {iconLeft && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2">
            {iconLeft}
          </span>
        )}

        {type === "textarea" ? (
          <InputTextarea
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            invalid={error}
            className={`w-full rounded p-2 ${
              iconLeft ? "pl-8" : ""
            } ${iconRight ? "pr-8" : ""} ${className}`}
            {...props}
          />
        ) : (
          <InputText
            type={inputType}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            invalid={error}
            className={`w-full rounded p-2 ${
              iconLeft ? "pl-8" : ""
            } ${iconRight ? "pr-8" : ""} ${className}`}
            {...props}
          />
        )}

        {type === "password" && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 mr-2 flex justify-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className="pi pi-eye-slash"></i>
            ) : (
              <i className="pi pi-eye"></i>
            )}
          </span>
        )}

        {showClear && value && type !== "password" && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onClick={handleClear}
          >
            <i className="pi pi-times"></i>
          </span>
        )}

        {showSearch && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            onChange={onChange}
          >
            <i className="pi pi-search" />
          </span>
        )}

        {iconRight && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {iconRight}
          </span>
        )}
      </div>

      {error && errormessage && (
        <p className="text-red-500 text-xs mt-1">{errormessage}</p>
      )}
    </div>
  );
}
