import clsx from "clsx";

export function LineSeperator(props: {
  orientation?: "vertical" | "horizontal";
  margin?: number;
  color?: string;
}) {
  const { orientation = "horizontal", margin = 5, color } = props;

  const marginStyle =
    orientation === "vertical" ? `mx-${margin}` : `my-${margin}`;
  const sizeStyle =
    orientation === "vertical" ? `h-full min-w-[1px]` : `min-h-[1px] w-full`;
  const colorStyle = "bg-[#e5e5e5]";

  return (
    <div
      role="separator"
      className={clsx(marginStyle, sizeStyle, colorStyle)}
    />
  );
}
