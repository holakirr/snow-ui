import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import { LoadingBIcon } from "..";

const InputStatusIcon = ({
	status,
	className,
	size,
}: {
	status: "progress" | "success" | "error";
	className: string;
	size: number;
}) => {
	switch (status) {
		case "progress":
			return (
				<LoadingBIcon
					weight="regular"
					alt={status}
					size={size}
					className={twMerge("fill-black-100", className)}
				/>
			);
		case "success":
			return (
				<Check
					alt={status}
					size={size}
					className={twMerge("fill-secondary-green", className)}
				/>
			);
		case "error":
			return (
				<Warning
					alt={status}
					size={size}
					className={twMerge("fill-secondary-red", className)}
				/>
			);
		default:
			return null;
	}
};

InputStatusIcon.displayName = "InputStatusIcon";
export { InputStatusIcon };
