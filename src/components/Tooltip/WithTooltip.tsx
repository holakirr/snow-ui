import { cva } from "class-variance-authority";
import { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Tooltip, type TooltipProps } from ".";

type WithTooltipProps = TooltipProps & {
	position?: "top" | "bottom" | "left" | "right";
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

const WithTooltip = forwardRef<HTMLDivElement, WithTooltipProps>(
	({ label, icon, position, children }, ref) => {
		const [isVisible, setIsVisible] = useState(false);
		return (
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				className="relative"
				ref={ref}
			>
				{children}
				{isVisible && (
					<Tooltip
						className={twMerge(
							"absolute z-100",
							tooltipPosStyles({ position }),
						)}
						label={label}
						icon={icon}
					/>
				)}
			</div>
		);
	},
);

WithTooltip.displayName = "WithTooltip";
export { WithTooltip };
