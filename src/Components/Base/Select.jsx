import { Dropdown } from "primereact/dropdown";

const BaseSelect = ({
  label,
  disabled,
  required = false,
  onChange,
  placeholder,
  loading,
  onBlur,
  error = false,
  errormessage = "",
  className,
  clearIcon = false,
  emptyMessage,
  emptyFilterMessage,
  editable = false,
  value,
  options,
  optionLabel,
  optionValue,
  showClear,
  ...props
}) => {
  return (
    <div className="flex flex-col relative w-full">
      {label && (
        <label className="mb-1 flex items-center gap-1 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div>
        <Dropdown
          className={`w-full rounded ${className}`}
          placeholder={placeholder}
          options={options}
          value={value}
          emptyMessage={emptyMessage}
          emptyFilterMessage={emptyFilterMessage}
          invalid={error}
          editable={editable}
          optionLabel={optionLabel}
          onChange={onChange}
          clearIcon={clearIcon}
          {...props}
          optionValue={optionValue}
          loading={loading}
          disabled={disabled}
          onBlur={onBlur}
          showClear={showClear}
        />
      </div>
      {error && errormessage && (
        <p className="text-red-500 text-xs mt-1">{errormessage}</p>
      )}
    </div>
  );
};

export default BaseSelect;
