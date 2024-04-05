import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { twMerge } from "tailwind-merge";
import { LoadingBIcon } from "../..";
import { STATUSES } from "../../../consts";
import type { Status } from "../../../utils";

const StatusIcon = ({
	status,
	className,
	size,
}: {
	status: Status;
	className?: string;
	size: number;
}) => {
	switch (status) {
		case STATUSES.progress:
			return (
				<LoadingBIcon
					weight="regular"
					alt={status}
					size={size}
					className={twMerge("fill-black-100", className)}
				/>
			);
		case STATUSES.success:
			return (
				<Check
					alt={status}
					size={size}
					className={twMerge("fill-secondary-green", className)}
				/>
			);
		case STATUSES.error:
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

StatusIcon.displayName = "StatusIcon";
export { StatusIcon };
