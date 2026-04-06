import { Button } from "primereact/button";

const BaseButton = ({
  label = "Submit",
  loading = false,
  className = "",
  disabled = false,
  iconPos = "left",
  size,
  icon,
  onClick,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      icon={icon}
      iconPos={iconPos}
      loading={loading}
      disabled={disabled || loading}
      size={size}
      className={`w-full flex justify-center items-center ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 ml-2">
          <div className="p-button-label">loading...</div>
        </div>
      ) : (
        <>{label && <span className="p-button-label">{label}</span>}</>
      )}
    </Button>
  );
};

export default BaseButton;
