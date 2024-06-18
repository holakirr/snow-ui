import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { TooltipComponent, type TooltipComponentProps } from "./TooltipComponent";

export type TooltipProps = TooltipComponentProps & {
	position?: "top" | "bottom" | "left" | "right";
	visible?: boolean;
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

const Tooltip = ({ label, kbd, position, visible, className, children, ref }: TooltipProps) => (
	<div className={twMerge("relative", className)} ref={ref}>
		{children}
		{visible && (
			<TooltipComponent
				className={twMerge("absolute z-100", tooltipPosStyles({ position }))}
				label={label}
				kbd={kbd}
			/>
		)}
	</div>
);

Tooltip.displayName = "WithTooltip";
export { Tooltip };
