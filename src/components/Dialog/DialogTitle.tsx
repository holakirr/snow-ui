import { Button, CloseIcon, Text } from "@components";
import type { Icon } from "@phosphor-icons/react";
import type { CustomIcon } from "@utils";
import { type ComponentProps, forwardRef } from "react";

export type DialogTitleProps = {
	titleIcon?: Icon | CustomIcon;
	title: string;
	onClose?: () => void;
} & ComponentProps<"div">;

const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
	({ titleIcon: Icon, title, onClose }, ref) => (
		<div
			className="flex justify-between items-center"
			ref={ref}
			role="complementary"
		>
			<div className="flex gap-4 items-center text-black-100">
				{Icon && (
					<Icon size={48} alt={`Icon for dialog ${title}`} weight="regular" />
				)}
				<Text as="p" size={48} semibold>
					{title}
				</Text>
			</div>
			{onClose && (
				<Button
					onClick={onClose}
					size="md"
					variant="gray"
					leftIcon={CloseIcon}
				/>
			)}
		</div>
	),
);

DialogTitle.displayName = "DialogTitle";
export { DialogTitle };
