import { Dialog } from "primereact/dialog";

const BaseDialog = ({
  visible,
  header,
  footer,
  resizable,
  draggable = false,
  closeIcon,
  closable,
  contentClassName,
  id,
  loading,
  headerClassName,
  headerStyle,
  onHide,
  ...props
}) => {
  return (
    <>
      <Dialog
        visible={visible}
        header={header}
        footer={footer}
        resizable={resizable}
        draggable={draggable}
        closeIcon={closeIcon}
        closable={closable}
        contentClassName={contentClassName}
        id={id}
        loading={loading}
        headerClassName={headerClassName}
        headerStyle={headerStyle}
        onHide={onHide}
        {...props}
      />
      <style>{`
        /* Container styling */
        .p-dialog {
          width: 50vw !important;
        }
      `}</style>
    </>
  );
};

export default BaseDialog;
