import type { PopoverContentType } from "../../types";
import { Popover } from "../Popover";
import { TooltipComponent, type TooltipComponentProps } from "./TooltipComponent";

/**
 * Props for the Tooltip component.
 */
export type TooltipProps = TooltipComponentProps &
	PopoverContentType & {
		/**
		 * Additional class name for the wrapper.
		 */
		wrapperClassname?: string;
	};

const Tooltip = ({
	label,
	kbd,
	position,
	visible,
	wrapperClassname,
	className,
	children,
	ref,
}: TooltipProps) => (
	<Popover position={position} visible={visible} wrapperClassName={wrapperClassname}>
		{children}
		<TooltipComponent ref={ref} className={className} label={label} kbd={kbd} />
	</Popover>
);

Tooltip.displayName = "WithTooltip";
export { Tooltip };
