import { ROLES } from "@constants";
import { twMerge } from "tailwind-merge";

export const basicInputClasses =
	"py-4 px-5 transition-all rounded-2xl bg-white-80 border-1 border-black-10 placeholder:text-black-20 hover:border-black-40 text-black-100";

export const disabledInputClasses =
	"disabled:bg-black-5 disabled:text-black-10 disabled:border-none disabled:cursor-not-allowed";

export const focusInputClasses =
	"focus:ring-4 focus:ring-black-5 focus:outline-none active:border-black-40 focus:border-black-40";

export type InputBaseProps = React.ComponentProps<"input"> & {
	title?: string;
};

export const InputBase = ({
	id,
	ref,
	value,
	title,
	placeholder,
	className,
	onChange,
	...props
}: InputBaseProps) => (
	<input
		id={id}
		ref={ref}
		placeholder={title ? "" : placeholder}
		className={twMerge(
			basicInputClasses,
			disabledInputClasses,
			focusInputClasses,
			title && "peer h-[74px] focus:h-[60px] content-end",
			title && value && "h-[60px]",
			className,
		)}
		onChange={onChange}
		value={value}
		role={ROLES.input}
		{...props}
	/>
);
