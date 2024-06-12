import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { CloseIcon, DotIcon } from "../Icons";
import { Text, type TextSize } from "../Text";

export type TagProps = React.ComponentProps<"div"> & {
	label: string | number;
	textSize?: TextSize;
	withDot?: boolean;
	onClose?: () => void;
};

const Tag = ({ label, textSize, withDot, onClose, className, ref, ...props }: TagProps) => (
	<div
		className={twMerge(
			"text-black-100 text-xs grid grid-flow-col-dense items-center px-2 py-0.5 bg-black-5 hover:bg-black-10 rounded-lg hover:cursor-pointer relative",
			(withDot || onClose) && "pl-1",
			className,
		)}
		ref={ref}
		role={ROLES.tag}
		{...props}
	>
		{withDot && <DotIcon alt={`Dot icon for tag ${label}`} size={16} weight="fill" />}
		<Text size={textSize} as="span">
			{label}
		</Text>
		{onClose && (
			<CloseIcon
				alt={`Close icon for tag ${label}`}
				size={16}
				onClick={onClose}
				className="fill-black-20"
			/>
		)}
	</div>
);

Tag.displayName = "Tag";
export { Tag };
