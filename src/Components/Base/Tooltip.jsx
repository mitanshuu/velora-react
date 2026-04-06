import { Tooltip } from "primereact/tooltip";

const BaseTooltip = ({
  className,
  position = "top",
  tooltip = "asd",
  escape = true,
  target,
}) => {
  return (
    <Tooltip
      className={className}
      position={position}
      tooltip={tooltip}
      escape={escape}
      target={target}
      appendTo="body"
    />
  );
};

export default BaseTooltip;
