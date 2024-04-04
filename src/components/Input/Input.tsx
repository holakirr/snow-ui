import { type VariantProps, cva } from "class-variance-authority";
import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	useEffect,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { Text, XCircleIcon } from "..";
import type { CustomIcon } from "../../utils";
import { InputStatusIcon } from "./InputStatusIcon";

export const basicInputClasses =
	"px-5 transition-all rounded-2xl bg-white-80 border-1 border-black-10 placeholder:text-black-20 hover:border-black-40 text-black-100";

export const disabledInputClasses =
	"disabled:bg-black-5 disabled:text-black-10 disabled:border-none disabled:cursor-not-allowed";

export const focusInputClasses =
	"focus:shadow-black-5 focus:shadow-[0_0_0_4px] focus:outline-none active:border-black-40 focus:border-black-40";

export const statusInputClasses = "pr-10";

const inputClasses = cva("py-4", {
	variants: {
		status: {
			progress: statusInputClasses,
			success: statusInputClasses,
			error: `border-secondary-red ${statusInputClasses}`,
		},
	},
});

type InputProps = ComponentProps<"input"> &
	VariantProps<typeof inputClasses> & {
		icon?: CustomIcon;
		error?: string;
		title?: string;
		clearable?: boolean;
	};

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			title,
			placeholder,
			id,
			className,
			icon: Icon,
			status,
			error,
			value,
			onChange,
			clearable,
			...props
		},
		ref,
	) => {
		const [hideStatus, setHideStatus] = useState<boolean>(false);

		useEffect(() => {
			setHideStatus(!status);
		}, [status]);

		const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
			setHideStatus(true);
			onChange?.(e);
		};

		const clearHandler = () => {
			const newEvent = {
				target: { value: "" },
			} as ChangeEvent<HTMLInputElement>;
			return onChangeHandler(newEvent);
		};

		return (
			<div className="flex flex-col items-start gap-2 transition-all">
				<div className="relative">
					<input
						id={id}
						ref={ref}
						placeholder={title ? "" : placeholder}
						className={twMerge(
							inputClasses({ status, className }),
							Icon && "ps-11",
							title && "peer h-[74px] focus:h-[60px] content-end",
							title && value && "h-[60px]",
							title && status && "h-[74px] focus:h-[74px] content-center",
							error && "border-secondary-red",
							basicInputClasses,
							disabledInputClasses,
							focusInputClasses,
						)}
						onChange={onChangeHandler}
						value={value}
						{...props}
					/>
					{title && (
						<Text
							as="label"
							htmlFor={id}
							className={twMerge(
								"absolute cursor-text top-1/2 left-5 transform -translate-y-1/2 text-black-20 peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-xs peer-disabled:text-black-10 w-min",
								value && "text-xs top-[9px] translate-y-0",
								status && "peer-focus:top-4",
								status && value && "top-4",
							)}
							size={18}
						>
							{title}
						</Text>
					)}
					{Icon && (
						<Icon
							alt={placeholder || "Input icon"}
							className="absolute top-1/2 left-5 transform -translate-y-1/2"
							size={20}
						/>
					)}
					{status && !hideStatus && (
						<InputStatusIcon
							status={status}
							className="absolute right-5 bottom-[calc(50%-10px)]"
							size={20}
						/>
					)}
					{value && hideStatus && clearable && (
						<XCircleIcon
							alt="clear input"
							weight="fill"
							size={20}
							className="absolute right-5 bottom-[calc(50%-10px)] fill-black-20"
							onClick={clearHandler}
						/>
					)}
				</div>
				{!hideStatus && error && (
					<Text className="text-secondary-red">{error}</Text>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
export { Input };
