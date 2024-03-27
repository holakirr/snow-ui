import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import type { CustomIcon } from "../..";

const inputClasses = cva("", {
	variants: {
		status: {
			progress: "",
			success: "",
			error: "",
		},
	},
});

type InputProps = ComponentProps<"input"> &
	VariantProps<typeof inputClasses> & {
		icon?: CustomIcon;
		error?: string;
	};

// TODO: Add content component

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ placeholder, id, className, icon: Icon, status, error, ...props },
		ref,
	) => (
		<div className="relative">
			<input
				ref={ref}
				placeholder={placeholder}
				className={twMerge(
					"px-5 py-4 transition-all bg-white-80 rounded-2xl border-1 border-black-10 placeholder:text-black-20 hover:border-black-40 disabled:bg-black-5 disabled:text-black-10 disabled:border-none disabled:cursor-not-allowed focus:shadow-black-5 focus:shadow-[0_0_0_4px] focus:outline-none text-black-100",
					Icon && "pl-11",
					className,
				)}
				{...props}
			/>
			{Icon && (
				<Icon
					alt={placeholder || "Input icon"}
					className="absolute top-1/2 left-5 transform -translate-y-1/2"
					size={20}
				/>
			)}
		</div>
	),
);

Input.displayName = "Input";
export { Input };
