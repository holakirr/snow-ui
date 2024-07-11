import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import { ROLES, STATUSES } from "../../../constants";
import type { IconSize, Status } from "../../../types";
import { LoadingBIcon } from "./LoadingB";

type StatusIconProps = {
	status: Status;
	className?: string;
	size: IconSize;
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
					role={ROLES.img}
				/>
			);
		case STATUSES.error:
			return (
				<Warning
					alt={`Icon for status ${status}`}
					size={size}
					className={twMerge("fill-secondary-red", className)}
					role={ROLES.img}
				/>
			);
		default:
			return null;
	}
};

StatusIcon.displayName = "StatusIcon";
export { StatusIcon };
