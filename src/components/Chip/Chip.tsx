import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES, STATUSES_EXPANDED } from "../../constants";
import type { StatusExpanded } from "../../types";
import { DotIcon } from "../Icons";
import { Text } from "../Text";

const ChipStyles = cva("flex place-items-center px-2 py-[1px] rounded-[80px] transition-all", {
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

type ChipProps = React.ComponentProps<"div"> &
	VariantProps<typeof ChipStyles> & {
		label: string;
		status: StatusExpanded;
	};

const Chip = ({ label, withDot, status, className, ref }: ChipProps) => (
	<div className={twMerge(ChipStyles({ withDot, status }), className)} ref={ref} role={ROLES.Chip}>
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

Chip.displayName = "Chip";
export { Chip };
