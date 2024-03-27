import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { type VariantProps, cva } from "class-variance-authority";
import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { type CustomIcon, LoadingBIcon, Text } from "..";

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
		onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	};

const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			placeholder,
			id,
			className,
			icon: Icon,
			status,
			error,
			onChange,
			...props
		},
		ref,
	) => {
		const [withError, setWithError] = useState<boolean>(!!error);

		const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
			if (error) setWithError(false);
			return onChange(e);
		};

		return (
			<div className="flex flex-col gap-2 transition-all">
				<div className="relative">
					<input
						id={id}
						ref={ref}
						placeholder={placeholder}
						className={twMerge(
							inputClasses({ status }),
							Icon && "pl-11",
							className,
						)}
						onChange={onChangeHandler}
						{...props}
					/>
					{Icon && (
						<Icon
							alt={placeholder || "Input icon"}
							className="absolute top-1/2 left-5 transform -translate-y-1/2"
							size={20}
						/>
					)}
					{status === "error" ? (
						withError && (
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
				</div>
				{withError && error && (
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
					className={className}
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
