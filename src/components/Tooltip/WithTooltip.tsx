import { Tooltip, type TooltipProps } from "@components";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type WithTooltipProps = TooltipProps & {
	position?: "top" | "bottom" | "left" | "right";
	visible?: boolean;
	setVisible?: (visible: boolean) => void;
};

const tooltipPosStyles = cva("", {
	variants: {
		position: {
			top: "bottom-full -translate-y-1 left-1/2 -translate-x-1/2",
			bottom: "top-full translate-y-1 left-1/2 -translate-x-1/2",
			left: "right-full translate-x-1 top-1/2 -translate-y-1/2",
			right: "left-full -translate-x-1 top-1/2 -translate-y-1/2",
		},
	},
	defaultVariants: {
		position: "bottom",
	},
});
// FIXME: fix the tooltip

const WithTooltip = ({
	label,
	kbd,
	position,
	visible,
	setVisible,
	children,
	ref,
}: WithTooltipProps) => (
	<div
		onMouseEnter={() => setVisible?.(true)}
		onMouseLeave={() => setVisible?.(false)}
		className="relative"
		ref={ref}
	>
		{children}
		{visible && (
			<Tooltip
				className={twMerge("absolute z-100", tooltipPosStyles({ position }))}
				label={label}
				kbd={kbd}
			/>
		)}
	</div>
);

WithTooltip.displayName = "WithTooltip";
export { WithTooltip };
