import { STATUSES } from "@constants";
import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import type { Status } from "@types";
import { twMerge } from "tailwind-merge";
import { LoadingBIcon } from "./LoadingB";

type StatusIconProps = {
	status: Status;
	className?: string;
	size: number;
};

const StatusIcon = ({ status, className, size }: StatusIconProps) => {
	switch (status) {
		case STATUSES.progress:
			return (
				<LoadingBIcon
					alt={`Icon for status ${status}`}
					size={size}
					className={twMerge("fill-black-100", className)}
				/>
			);
		case STATUSES.success:
			return (
				<Check
					alt={`Icon for status ${status}`}
					size={size}
					className={twMerge("fill-secondary-green", className)}
					role="img"
				/>
			);
		case STATUSES.error:
			return (
				<Warning
					alt={`Icon for status ${status}`}
					size={size}
					className={twMerge("fill-secondary-red", className)}
					role="img"
				/>
			);
		default:
			return null;
	}
};

StatusIcon.displayName = "StatusIcon";
export { StatusIcon };
