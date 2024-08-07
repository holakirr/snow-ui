import { twMerge } from "tailwind-merge";
import { ICON_SIZES, ROLES } from "../../constants";
import type { TextSize } from "../../types";
import { CloseIcon, DotIcon } from "../Icons";
import { Text } from "../Text";

/**
 * Props for the Tag component.
 */
export type TagProps = React.ComponentProps<"div"> & {
	/**
	 * The label of the tag.
	 */
	label: string | number;

	/**
	 * The size of the text in the tag.
	 */
	textSize?: TextSize;

	/**
	 * Determines whether to display a dot in the tag.
	 */
	withDot?: boolean;

	/**
	 * Callback function to be called when the tag is closed.
	 */
	onClose?: () => void;
};

/**
 * Tag component displays a tag with a label and optional dot and close icon.
 */
const Tag = ({ label, textSize, withDot, onClose, className, ref, ...props }: TagProps) => (
	<div
		className={twMerge(
			"text-black-100 text-xs grid grid-flow-col-dense items-center px-2 py-0.5 bg-black-5 hover:bg-black-10 rounded-lg hover:cursor-pointer relative",
			(withDot || onClose) && "pl-1",
			className,
		)}
		ref={ref}
		role={ROLES.listitem}
		{...props}
	>
		{withDot && <DotIcon alt={`Dot icon for tag ${label}`} size={ICON_SIZES[16]} weight="fill" />}
		<Text size={textSize} as="span">
			{label}
		</Text>
		{onClose && (
			<CloseIcon
				alt={`Close icon for tag ${label}`}
				size={ICON_SIZES[16]}
				onClick={onClose}
				className="fill-black-20"
			/>
		)}
	</div>
);

Tag.displayName = "Tag";
export { Tag };
