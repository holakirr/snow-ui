import { type VariantProps, cva } from "class-variance-authority";
import type { KeyboardEventHandler, MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import { PopupHeader, type PopupHeaderProps } from "./PopupHeader";

type DialogProps = React.ComponentProps<"dialog"> &
	PopupHeaderProps &
	VariantProps<typeof popupClasses>;

const popupClasses = cva(
	"fixed w-[0%] h-[0%] bottom-0 left-1/2 -translate-x-1/2 z-50 overflow-hidden flex items-center transition-all duration-500",
	{
		variants: {
			open: {
				true: "w-[100%] h-[100%]",
			},
			withBlur: {
				true: "backdrop-blur-md bg-gradient-to-b from-[rgba(215_208_255/0.2)_0%] to-[rgba(203_221_255/0.5)_100%]",
			},
		},
	},
);

const Popup = ({
	open,
	withBlur,
	startContent,
	title,
	withCloseIcon,
	className,
	onClose,
	children,
	ref,
	...props
}: DialogProps) => {
	const handleOutsideClick: MouseEventHandler = (event) => {
		event.preventDefault();
		if (event.target === event.currentTarget && onClose) {
			onClose();
		}
	};
	const handleEscapeKey: KeyboardEventHandler<HTMLDivElement> = (event) => {
		event.preventDefault();
		if (event.key === "Escape" && onClose) {
			onClose();
		}
	};

	return (
		<div
			onClick={handleOutsideClick}
			onKeyUp={handleEscapeKey}
			className={twMerge(popupClasses({ open, withBlur }))}
		>
			<dialog
				ref={ref}
				role={ROLES.dialog}
				className={twMerge("bg-transparent block", className)}
				{...props}
			>
				<PopupHeader
					title={title}
					onClose={onClose}
					startContent={startContent}
					withCloseIcon={withCloseIcon}
				/>
				<div
					className={twMerge(
						"grid transition-[grid-template-rows] duration-300",
						open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
					)}
				>
					<div className="min-h-0 overflow-hidden">{children}</div>
				</div>
			</dialog>
		</div>
	);
};

Popup.displayName = "Popup";
export { Popup };
