import { twMerge } from "tailwind-merge";
import { KBD, type KBDProps } from "../KBD";
import { Text } from "../Text";

export type TooltipComponentProps = React.ComponentProps<"div"> & {
	/**
	 * The label of the TooltipComponent
	 */
	label: string;
	/**
	 * Keybindings to display
	 */
	kbd?: KBDProps;
};

const TooltipComponent = ({ label, kbd, className, ref }: TooltipComponentProps) => (
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
		{kbd && <KBD {...kbd} className="text-white-40" />}
	</div>
);

TooltipComponent.displayName = "TooltipComponent";
export { TooltipComponent };
