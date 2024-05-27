import { StatusIcon, Text, XCircleIcon } from "@components";
import { ROLES } from "@constants";
import type { CustomIcon } from "@types";
import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { InputBase } from "./InputBase";

type InputProps = ComponentProps<"input"> &
	VariantProps<typeof inputClasses> & {
		icon?: CustomIcon;
		iconSize?: number;
		iconClassName?: string;
		error?: string;
		title?: string;
		clearable?: boolean;
		onClear?: () => void;
	};

export const statusInputClasses = "pr-10";

const inputClasses = cva("", {
	variants: {
		status: {
			progress: statusInputClasses,
			success: statusInputClasses,
			error: `border-secondary-red ${statusInputClasses}`,
		},
	},
});

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			title,
			placeholder,
			id,
			className,
			icon: Icon,
			iconSize,
			iconClassName,
			status,
			error,
			value,
			clearable,
			onChange,
			onClear,
			...props
		},
		ref,
	) => (
		<div className="flex flex-col items-start gap-2 transition-all">
			<div className="relative">
				<InputBase
					id={id}
					ref={ref}
					title={title}
					placeholder={placeholder}
					className={twMerge(
						inputClasses({ status, className }),
						Icon && "ps-11",
						title && status && "h-[74px] focus:h-[74px] content-center",
						error && "border-secondary-red",
					)}
					onChange={onChange}
					value={value}
					role={ROLES.input}
					{...props}
				/>
				{title && (
					<Text
						as="label"
						htmlFor={id}
						className={twMerge(
							"absolute cursor-text top-1/2 left-5 transform -translate-y-1/2 text-black-20 peer-focus:top-[9px] peer-focus:translate-y-0 peer-focus:text-xs peer-disabled:text-black-10 w-min",
							value && "top-[9px] translate-y-0",
							status && "peer-focus:top-4",
							status && value && "top-4",
						)}
						size={value ? 12 : 18}
					>
						{title}
					</Text>
				)}
				{Icon && (
					<Icon
						alt={`Icon in input ${title} with id ${id}`}
						className={twMerge(
							"absolute top-1/2 left-5 transform -translate-y-1/2",
							iconClassName,
						)}
						size={iconSize || 20}
					/>
				)}
				{status && (
					<StatusIcon
						status={status}
						className="absolute right-5 bottom-[calc(50%-10px)]"
						size={iconSize || 20}
					/>
				)}
				{value && clearable && (
					<XCircleIcon
						alt={`Clear input ${title} with id ${id}`}
						weight="fill"
						size={iconSize || 20}
						className="absolute right-5 bottom-[calc(50%-10px)] fill-black-20"
						onClick={onClear}
					/>
				)}
			</div>
			{error && <Text className="text-secondary-red">{error}</Text>}
		</div>
	),
);

Input.displayName = "Input";
export { Input };
