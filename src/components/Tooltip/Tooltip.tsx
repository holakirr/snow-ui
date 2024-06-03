import { KBD, type KBDProps, Text } from "@components";
import { ROLES } from "@constants";
import { twMerge } from "tailwind-merge";

export type TooltipProps = React.ComponentProps<"div"> & {
	/**
	 * The label of the Tooltip
	 */
	label: string;
	/**
	 * Keybindings to display
	 */
	kbd?: KBDProps;
};

const Tooltip = ({ label, kbd, className, ref }: TooltipProps) => (
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
);

Tooltip.displayName = "Tooltip";
export { Tooltip };
