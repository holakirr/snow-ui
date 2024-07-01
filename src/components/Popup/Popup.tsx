import type { KeyboardEventHandler, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { PopupHeader, type PopupHeaderProps } from "./PopupHeader";

type DialogProps = React.ComponentProps<"dialog"> &
	PopupHeaderProps & {
		/**
		 * Funciton to be called when the dialog is closed.
		 **/
		onClose: () => void;
	};

const Popup = ({
	open,
	titleIcon,
	title,
	className,
	onClose,
	children,
	ref,
	...props
}: DialogProps) => {
	const handleOutsideClick: MouseEventHandler = (event) => {
		event.preventDefault();
		if (event.target === event.currentTarget) {
			onClose();
		}
	};
	const handleEscapeKey: KeyboardEventHandler<HTMLDivElement> = (event) => {
		if (event.key === "Escape") {
			onClose();
		}
	};

	return (
		<div
			onClick={handleOutsideClick}
			onKeyUp={handleEscapeKey}
			className={twMerge(
				"grid transition-[grid-template-rows_filter] grid-rows-[0fr] fixed top-1/2 left-1/2 z-50 overflow-hidden w-0 h-0 duration-500 content-center",
				open &&
					"grid-rows-[1fr] w-dvw h-dvh backdrop-blur-[20px] bg-gradient-to-b  from-[rgba(215_208_255/0.2)_0%] to-[rgba(203_221_255/0.5)_100%] left-0 top-0",
			)}
		>
			<dialog
				ref={ref}
				role={ROLES.dialog}
				className={twMerge(
					"grid gap-7 content-center justify-center min-h-0 relative bg-transparent",
					className,
					!open && "hidden",
				)}
				open={open}
				{...props}
			>
				<PopupHeader title={title} onClose={onClose} titleIcon={titleIcon} />
				{children}
			</dialog>
		</div>
	);
};

Popup.displayName = "Popup";
export { Popup };
