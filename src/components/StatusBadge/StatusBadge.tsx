import { DotIcon, Text } from "@components";
import { ROLES, STATUSES_EXPANDED } from "@constants";
import type { StatusExpanded } from "@types";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const statusBadgeStyles = cva(
	"flex place-items-center px-2 py-[1px] rounded-[80px] transition-all",
	{
		variants: {
			status: {
				default: "bg-secondary-indigoLighter text-secondary-indigoDarker",
				success: "bg-secondary-greenLighter text-secondary-greenDarker",
				info: "bg-secondary-blueLighter text-secondary-blueDarker",
				warning: "bg-secondary-yellowLighter text-secondary-yellowDarker",
				error: "bg-black-5 text-black-40",
			},
			withDot: {
				true: "bg-transparent p-0",
			},
		},
		defaultVariants: {
			status: STATUSES_EXPANDED.default,
			withDot: false,
		},
	},
);

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
		label: string;
		status: StatusExpanded;
	};

const StatusBadge = ({ label, withDot, status, className, ref }: StatusBadgeProps) => (
	<div
		className={twMerge(statusBadgeStyles({ withDot, status }), className)}
		ref={ref}
		role={ROLES.statusBadge}
	>
		{withDot && (
			<DotIcon
				alt={`Dot icon for status badge ${label}`}
				size={16}
				weight="fill"
				className={twMerge(iconStyles({ status }))}
			/>
		)}
		<Text as="span">{label}</Text>
	</div>
);

StatusBadge.displayName = "StatusBadge";
export { StatusBadge };
