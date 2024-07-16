import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ICON_SIZES, ROLES, STATUSES_EXPANDED } from "../../constants";
import type { StatusExpanded } from "../../types";
import { DotIcon } from "../Icons";
import { Text } from "../Text";

const statusBadgeStyles = cva("flex justify-start place-items-center transition-all", {
	variants: {
		status: {
			default: "bg-secondary-indigoLighter text-secondary-indigoDarker",
			success: "bg-secondary-greenLighter text-secondary-greenDarker",
			info: "bg-secondary-blueLighter text-secondary-blueDarker",
			warning: "bg-secondary-yellowLighter text-secondary-yellowDarker",
			error: "bg-black-5 text-black-40",
		},
		size: {
			sm: "text-xs px-2 py-[1px] rounded-full",
			md: "text-sm px-3 py-1 rounded-xl",
		},
		withDot: {
			true: "bg-transparent p-0",
		},
	},
	defaultVariants: {
		status: STATUSES_EXPANDED.default,
		withDot: false,
		size: "sm",
	},
});

const iconStyles = cva("", {
	variants: {
		status: {
			default: "fill-secondary-indigo",
			success: "fill-secondary-green",
			info: "fill-secondary-blue",
			warning: "fill-secondary-yellow",
			error: "fill-black-40",
		},
	},
});

type StatusBadgeProps = React.ComponentProps<"div"> &
	VariantProps<typeof statusBadgeStyles> & {
		/**
		 * The label text or number displayed on the chip.
		 */
		label: string;

		/**
		 * The status of the chip.
		 */
		status: StatusExpanded;
	};

/**
 * StatusBadge component displays a badge with a status icon.
 */
const StatusBadge = ({ label, withDot, size = "sm", status, className, ref }: StatusBadgeProps) => (
	<div
		className={twMerge(statusBadgeStyles({ withDot, status, size }), className)}
		ref={ref}
		role={ROLES.status}
	>
		{withDot && size === "sm" && (
			<DotIcon
				alt={`Dot icon for status badge ${label}`}
				size={ICON_SIZES[16]}
				weight="fill"
				className={twMerge(iconStyles({ status }))}
			/>
		)}
		{withDot && size === "md" && (
			<DotIcon
				alt={`Dot icon for status badge ${label}`}
				size={ICON_SIZES[20]}
				weight="regular"
				className={twMerge(iconStyles({ status }))}
			/>
		)}
		<Text as="span">{label}</Text>
	</div>
);

StatusBadge.displayName = "Chip";
export { StatusBadge };
