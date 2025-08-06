import { Check, Warning } from "@phosphor-icons/react/dist/ssr";

import { STATUSES } from "../constants";
import type { CustomIconProps, Status } from "../types";
import { LoadingAIcon } from "./LoadingA";

type StatusIconProps = CustomIconProps & {
	status: Status;
	className?: string;
};

const StatusIcon = ({ status, className, ...props }: StatusIconProps) => {
	const alt = `Icon for status ${status}`;
	switch (status) {
		case STATUSES.progress:
			return (
				<LoadingAIcon
					alt={alt}
					className={`fill-black-100 ${className}`}
					style={{
						fill: "rgba(var(--color-black))",
					}}
					{...props}
				/>
			);
		case STATUSES.error:
			return (
				<Warning alt={alt} className={`fill-secondary-red ${className}`} role="img" {...props} />
			);
		case STATUSES.success:
			return (
				<Check alt={alt} className={`fill-secondary-green ${className}`} role="img" {...props} />
			);
		default:
			return null;
	}
};

StatusIcon.displayName = "StatusIcon";
export { StatusIcon };
