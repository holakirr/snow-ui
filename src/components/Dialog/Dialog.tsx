import { DialogTitle, type DialogTitleProps } from "@components";
import { ROLES } from "@constants";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type DialogProps = ComponentProps<"dialog"> & DialogTitleProps & {};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
	({ open, titleIcon, title, className, onClose, children, ...props }, ref) => (
		<dialog
			ref={ref}
			role={ROLES.dialog}
			className={twMerge(
				"fixed z-50 bottom-0 left-1/2 -translate-x-1/2 overflow-hidden grid gap-7 items-center justify-center content-center transition-all duration-300",
				className,
				!open &&
					"h-0 opacity-0 *:text-[0rem] *:w-[0rem] *:h-[0rem] *:opacity-0 *:p-0 *:m-0",
				open &&
					"w-dvw h-dvh backdrop-blur-[20px] bg-transparent bg-gradient-to-b  from-[rgba(215_208_255/0.2)_0%] to-[rgba(203_221_255/0.5)_100%] opacity-100",
			)}
			open={open}
			{...props}
		>
			<DialogTitle title={title} onClose={onClose} titleIcon={titleIcon} />
			{children}
		</dialog>
	),
);

Dialog.displayName = "Dialog";
export { Dialog };
