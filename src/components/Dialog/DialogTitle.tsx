import { Button, CloseIcon, Text } from "@components";
import { ROLES } from "@constants";
import type { Icon } from "@phosphor-icons/react";
import type { CustomIcon } from "@types";

export type DialogTitleProps = React.ComponentProps<"div"> & {
	titleIcon?: Icon | CustomIcon;
	title: string;
	onClose?: () => void;
};

const DialogTitle = ({ titleIcon: Icon, title, onClose, ref }: DialogTitleProps) => (
	<div className="flex justify-between items-center" ref={ref} role={ROLES.dialogTitle}>
		<div className="flex gap-4 items-center text-black-100">
			{Icon && <Icon size={48} alt={`Icon for dialog ${title}`} weight="regular" />}
			<Text as="p" size={48} semibold>
				{title}
			</Text>
		</div>
		{onClose && (
			<Button
				autoFocus
				onClick={onClose}
				size="md"
				variant="gray"
				leftIcon={CloseIcon}
				title="Close dialog icon button"
			/>
		)}
	</div>
);

DialogTitle.displayName = "DialogTitle";
export { DialogTitle };
