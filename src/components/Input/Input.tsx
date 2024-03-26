import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import type { CustomIcon } from "../..";

type InputProps = ComponentProps<"input"> & {
	icon?: CustomIcon;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ placeholder, id, className, icon: Icon, ...props }, ref) => (
		<div className="relative">
			<input
				ref={ref}
				placeholder={placeholder}
				className={twMerge(
					"px-5 py-4 transition-all bg-white-80 rounded-2xl border-1 border-black-10 placeholder:text-black-20 hover:border-black-40 disabled:bg-black-5 disabled:text-black-10 focus:shadow-black-5 focus:shadow-[0_0_0_4px] focus:outline-none",
					className,
				)}
				{...props}
			/>
			{Icon && <Icon alt={placeholder || "Input icon"} className="absolute" />}
		</div>
	),
);

Input.displayName = "Input";
export { Input };
