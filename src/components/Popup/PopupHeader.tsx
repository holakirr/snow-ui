import type { Icon } from "@phosphor-icons/react";
import { ROLES } from "../../constants";
import type { CustomIcon } from "../../types";
import { Button } from "../Button";
import { CloseIcon } from "../Icons";
import { Text } from "../Text";

/**
 * Props for the PopupHeader component.
 */
export type PopupHeaderProps = React.ComponentProps<"div"> & {
	/**
	 * The icon to be displayed next to the title.
	 */
	titleIcon?: Icon | CustomIcon;

	/**
	 * The title text.
	 */
	title: string;

	/**
	 * Callback function to be called when the popup is closed.
	 */
	onClose: () => void;
};

const PopupHeader = ({ titleIcon: Icon, title, onClose, ref }: PopupHeaderProps) => (
	<div className="flex justify-between items-center" ref={ref} role={ROLES.heading}>
		<div className="flex gap-4 items-center text-black-100">
			{Icon && <Icon size={48} alt={`Icon for popup ${title}`} weight="regular" />}
			<Text as="p" size={48} semibold>
				{title}
			</Text>
		</div>
		<Button
			autoFocus
			onClick={onClose}
			size="md"
			variant="gray"
			leftIcon={CloseIcon}
			title="Close popup icon button"
		/>
	</div>
);

PopupHeader.displayName = "PopupHeader";
export { PopupHeader };
