import { twMerge } from "tailwind-merge";
import { KBD, type KBDProps } from "../KBD";
import { PopoverContent } from "../Popover";
import { Text } from "../Text";

export type TooltipComponentType = {
	/**
	 * The label of the TooltipComponent
	 */
	label: string;
	/**
	 * Keybindings to display
	 */
	kbd?: KBDProps;
};

type TooltipComponentProps = React.ComponentProps<"div"> &
	TooltipComponentType & {
		/**
		 * Whether the tooltip is visible or not.
		 */
		visible: boolean;
	};

const TooltipComponent = ({ label, kbd, visible, className, ref }: TooltipComponentProps) => (
	<PopoverContent visible={visible} ref={ref}>
		<div
			className={twMerge(
				"py-1 px-2 flex place-items-center gap-2 bg-black-80 backdrop-blur-[20px] rounded-lg transition-all text-xs",
				className,
			)}
		>
			<Text as="span" className="text-white-100">
				{label}
			</Text>
			{kbd && <KBD {...kbd} className="text-white-40" />}
		</div>
	</PopoverContent>
);

TooltipComponent.displayName = "TooltipComponent";
export { TooltipComponent };
