import type { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { DialogTitle, type DialogTitleProps } from "./DialogTitle";

type DialogProps = React.ComponentProps<"dialog"> &
	DialogTitleProps & {
		onClose: () => void;
	};

const Dialog = ({
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

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: it should be closed by clicking outside
		<div
			onClick={handleOutsideClick}
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
				<DialogTitle title={title} onClose={onClose} titleIcon={titleIcon} />
				{children}
			</dialog>
		</div>
	);
};

Dialog.displayName = "Dialog";
export { Dialog };
