import { DialogTitle, type DialogTitleProps } from "@components";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type DialogProps = ComponentProps<"div"> &
	DialogTitleProps & {
		show: boolean;
	};

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
	({ show, titleIcon, title, className, onClose, children, ...props }, ref) => (
		<div
			ref={ref}
			role="dialog"
			className={twMerge(
				"fixed z-50 bottom-0 left-1/2 -translate-x-1/2 transition-all overflow-hidden grid gap-7 items-center justify-center content-center *:transition-transform",
				className,
				!show &&
					"w-0 h-0 opacity-0 *:text-[0rem] *:w-[0rem] *:h-[0rem] *:opacity-0 *:p-0 *:m-0",
				show &&
					"w-dvw h-dvh backdrop-blur-[20px] bg-[linear-gradient(180deg, rgba(215, 208, 255, 0.20) 0%, rgba(203, 221, 255, 0.50) 100%)] opacity-100",
			)}
			{...props}
		>
			<DialogTitle title={title} onClose={onClose} titleIcon={titleIcon} />
			{children}
		</div>
	),
);

Dialog.displayName = "Dialog";
export { Dialog };
