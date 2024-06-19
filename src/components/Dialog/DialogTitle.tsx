import type { Icon } from "@phosphor-icons/react";
import { ROLES } from "../../constants";
import type { CustomIcon } from "../../types";
import { Button } from "../Button";
import { CloseIcon } from "../Icons";
import { Text } from "../Text";

/**
 * Props for the DialogTitle component.
 */
export type DialogTitleProps = React.ComponentProps<"div"> & {
	/**
	 * The icon to be displayed next to the title.
	 */
	titleIcon?: Icon | CustomIcon;

	/**
	 * The title text.
	 */
	title: string;

	/**
	 * Callback function to be called when the dialog is closed.
	 */
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
