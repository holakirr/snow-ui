import { KBD, type KBDProps, Text } from "@components";
import { ROLES } from "@constants";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type TooltipProps = {
	/**
	 * The label of the Tooltip
	 */
	label: string;
	/**
	 * The icon of the Tooltip
	 */
	kbd?: KBDProps;
} & ComponentProps<"div">;

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
	({ label, kbd, className }, ref) => (
		<div
			className={twMerge(
				"py-1 px-2 flex place-items-center gap-2 bg-black-80 backdrop-blur-[20px] rounded-lg transition-all",
				className,
			)}
			ref={ref}
			role={ROLES.tooltip}
		>
			<Text as="span" className="text-white-100">
				{label}
			</Text>
			{kbd && <KBD {...kbd} className="text-white-40" />}
		</div>
	),
);

Tooltip.displayName = "Tooltip";
export { Tooltip };
