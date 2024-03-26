import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "..";
import type { CustomIcon } from "../Icons";

export type TooltipProps = {
	/**
	 * The label of the Tooltip
	 */
	label: string;
	/**
	 * The icon of the Tooltip
	 */
	icon?: CustomIcon;
} & ComponentProps<"div">;

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
	({ label, icon: Icon, className }, ref) => (
		<div
			className={twMerge(
				"py-1 px-2 flex place-items-center gap-2 bg-black-80 backdrop-blur-[20px] rounded-lg transition-all",
				className,
			)}
			ref={ref}
		>
			<Text as="span" className="text-white-100">
				{label}
			</Text>
			{Icon && <Icon alt={label} size={20} className="text-white-40" />}
		</div>
	),
);

Tooltip.displayName = "Tooltip";
export { Tooltip };
