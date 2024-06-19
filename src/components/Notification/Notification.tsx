import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES, STATUSES_NOTIFY } from "../../constants";
import type { StatusNotify } from "../../types";
import { StatusIcon } from "../Icons";
import { Text } from "../Text";

const notificationClasses = cva(
	"flex items-center bg-black-80 text-white-100 backdrop-blur-[20px]",
	{
		variants: {
			size: {
				sm: "gap-1 px-2 py-1 rounded",
				lg: "gap-2 px-4 py-2 rounded-lg",
			},
		},
		defaultVariants: {
			size: "sm",
		},
	},
);

type NotificationProps = React.ComponentProps<"div"> &
	VariantProps<typeof notificationClasses> & {
		/**
		 * The status of the notification.
		 * @default "success"
		 * @see StatusNotify
		 * */
		status: StatusNotify;
		/**
		 * The title text displayed on the notification.
		 * */
		title: string;
	};

const Notification = ({
	size = "sm",
	className,
	status = STATUSES_NOTIFY.success,
	title,
	ref,
}: NotificationProps) => (
	<div
		className={twMerge(notificationClasses({ size, className }))}
		ref={ref}
		role={ROLES.notification}
	>
		<StatusIcon status={status} size={size === "sm" ? 16 : 24} className="fill-white-100" />
		<Text size={size === "sm" ? 12 : 14}>{title}</Text>
	</div>
);

Notification.displayName = "Notification";
export { Notification };
