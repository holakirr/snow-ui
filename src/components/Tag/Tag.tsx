import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { CloseIcon, DotIcon, Text } from "../..";

type TagProps = ComponentProps<"div"> & {
	label: string;
	withDot?: boolean;
	onClose?: () => void;
};

const Tag = forwardRef<HTMLDivElement, TagProps>(
	({ label, withDot, onClose, className }, ref) => (
		<div
			className={twMerge(
				"text-black-100 grid grid-flow-col-dense items-center px-2 py-0.5 bg-black-5 hover:bg-black-10 rounded-lg hover:cursor-default relative",
				withDot && "pl-1",
				onClose && "pr-1 hover:cursor-pointer",
				className,
			)}
			ref={ref}
		>
			{withDot && <DotIcon alt={label} size={16} weight="fill" />}
			<Text size={12} as="span">
				{label}
			</Text>
			{onClose && (
				<CloseIcon
					alt="Close"
					size={16}
					onClick={onClose}
					className="fill-black-20"
				/>
			)}
		</div>
	),
);

Tag.displayName = "Tag";
export { Tag };
