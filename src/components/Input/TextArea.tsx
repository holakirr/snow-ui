import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { basicInputClasses, disabledInputClasses, focusInputClasses } from "./";
import "./TextArea.module.css";

type TextAreaProps = ComponentProps<"textarea"> & {
	status?: "progress" | "success" | "error";
	error?: string;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, id, ...props }, ref) => (
		<textarea
			id={id}
			ref={ref}
			className={twMerge(
				basicInputClasses,
				disabledInputClasses,
				focusInputClasses,
				"pt-4 pb-7 resize",
				className,
			)}
			{...props}
		/>
	),
);

TextArea.displayName = "TextArea";
export { TextArea };
