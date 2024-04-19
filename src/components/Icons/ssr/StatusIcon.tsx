import { LoadingBIcon } from "@components";
import { STATUSES } from "@constants";
import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import type { Status } from "@utils";
import { twMerge } from "tailwind-merge";

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
				/>
			);
		case STATUSES.error:
			return (
				<Warning
					alt={`Icon for status ${status}`}
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
