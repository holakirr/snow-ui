import { twMerge } from "tailwind-merge";
import { Text } from "../../components";

type CaptionProps = React.ComponentProps<"caption">;

const Caption = ({ className, ...props }: CaptionProps) => (
	<Text as="caption" size={14} className={twMerge("text-black-100", className)} {...props} />
);

Caption.displayName = "TableB.Caption";
export { Caption };
