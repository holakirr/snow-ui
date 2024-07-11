import { twMerge } from "tailwind-merge";
import { ROLES, TEXT_SIZES } from "../../constants";
import { Button } from "../Button";
import { CloseIcon } from "../Icons";
import { Text } from "../Text";

export type PopupHeaderProps = React.ComponentProps<"div"> & {
	/**
	 * The icon to be displayed next to the title.
	 */
	startContent?: JSX.Element;

	/**
	 * The title text.
	 */
	title?: string;

	/**
	 * Whether to display the close icon button.
	 */
	withCloseIcon?: boolean;

	/**
	 * Callback function to be called when the popup is closed.
	 */
	onClose: () => void;
};

const PopupHeader = ({
	startContent,
	title,
	withCloseIcon,
	onClose,
	className,
	ref,
}: PopupHeaderProps) =>
	startContent || title || withCloseIcon ? (
		<div
			className={twMerge("grid grid-flow-col justify-between items-center min-h-0 mb-7", className)}
			ref={ref}
			role={ROLES.heading}
		>
			<div className="flex gap-4 items-center text-black-100">
				{startContent}
				{title && (
					<Text as="p" size={TEXT_SIZES[48]} semibold>
						{title}
					</Text>
				)}
			</div>
			{withCloseIcon && (
				<Button
					autoFocus
					onClick={onClose}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							onClose();
						}
					}}
					size="md"
					variant="gray"
					leftIcon={CloseIcon}
					title="Close popup icon button"
				/>
			)}
		</div>
	) : null;

PopupHeader.displayName = "PopupHeader";
export { PopupHeader };
