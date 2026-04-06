import BaseButton from "./Base/Button";

const DialogFooter = ({
  onHide,
  handleSave,
  loading,
  buttonLabel,
  disabled,
}) => {
  return (
    <div className="flex justify-end gap-3">
      <BaseButton
        label="Cancel"
        className="w-auto! bg-gray-100 border-none text-gray-700 hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        onClick={onHide}
      />
      <BaseButton
        label={buttonLabel}
        loading={loading}
        className="w-auto! bg-blue-600 border-none text-white shadow-lg shadow-blue-100 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        onClick={handleSave}
        disabled={loading || disabled}
      />
    </div>
  );
};

export default DialogFooter;
