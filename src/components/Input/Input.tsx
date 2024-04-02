import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { type VariantProps, cva } from "class-variance-authority";
import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { type CustomIcon, LoadingBIcon, Text, XCircleIcon } from "..";

const inputClasses = cva(
	"px-5 py-4 transition-all bg-white-80 rounded-2xl border-1 border-black-10 placeholder:text-black-20 hover:border-black-40 disabled:bg-black-5 disabled:text-black-10 disabled:border-none disabled:cursor-not-allowed focus:shadow-black-5 focus:shadow-[0_0_0_4px] focus:outline-none text-black-100",
	{
		variants: {
			status: {
				progress: "pr-10",
				success: "pr-10",
				error: "pr-10 border-secondary-red",
			},
		},
	},
);

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
		const [hideError, setHideError] = useState<boolean>(false);

		const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
			if (error) setHideError(true);
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
							Icon && "pl-11",
							title && "peer h-[74px] focus:h-[60px] content-end",
							title && value && "h-[60px]",
							title && status && "h-[74px] focus:h-[74px] content-center",
							error && "border-secondary-red",
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
					{status === "error" ? (
						!hideError && (
							<StatusIcon
								status={status}
								className="absolute right-5 bottom-[calc(50%-10px)]"
								size={20}
							/>
						)
					) : (
						<StatusIcon
							status={status}
							className="absolute right-5 bottom-[calc(50%-10px)]"
							size={20}
						/>
					)}
					{value && !status && clearable && (
						<XCircleIcon
							alt="clear input"
							weight="fill"
							size={20}
							className="absolute right-5 bottom-[calc(50%-10px)] fill-black-20"
							onClick={clearHandler}
						/>
					)}
				</div>
				{!hideError && error && (
					<Text className="text-secondary-red">{error}</Text>
				)}
			</div>
		);
	},
);

const StatusIcon = ({
	status,
	className,
	size,
}: {
	status: VariantProps<typeof inputClasses>["status"];
	className: string;
	size: number;
}) => {
	switch (status) {
		case "progress":
			return (
				<LoadingBIcon
					weight="regular"
					alt={status}
					size={size}
					className={twMerge("fill-black-100", className)}
				/>
			);
		case "success":
			return (
				<Check
					alt={status}
					size={size}
					className={twMerge("fill-secondary-green", className)}
				/>
			);
		case "error":
			return (
				<Warning
					alt={status}
					size={size}
					className={twMerge("fill-secondary-red", className)}
				/>
			);
		default:
			return null;
	}
};

Input.displayName = "Input";
export { Input };
