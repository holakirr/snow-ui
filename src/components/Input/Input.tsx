import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ICON_SIZES, ROLES, TEXT_SIZES } from "../../constants";
import type { CustomIcon, IconSize } from "../../types";
import { StatusIcon, XCircleIcon } from "../Icons";
import { Text } from "../Text";
import { InputBase } from "./InputBase";

/**
 * Props for the Input component.
 */
type InputProps = React.ComponentProps<"input"> &
	VariantProps<typeof inputClasses> & {
		/**
		 * The custom icon to be displayed.
		 */
		icon?: CustomIcon;
		/**
		 * The size of the custom icon.
		 */
		iconSize?: IconSize;
		/**
		 * The class name for the custom icon.
		 */
		iconClassName?: string;
		/**
		 * The error message to be displayed.
		 */
		error?: string;
		/**
		 * The title of the input.
		 */
		title?: string;
		/**
		 * Determines if the input is clearable.
		 */
		clearable?: boolean;
		/**
		 * Callback function to be called when the input is cleared.
		 */
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

/**
 * Input component displays an input field.
 */
const Input = ({
	title,
	placeholder,
	id,
	className,
	icon: Icon,
	iconSize = ICON_SIZES[20],
	iconClassName,
	status,
	error,
	value,
	clearable,
	onChange,
	onClear,
	ref,
	...props
}: InputProps) => (
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
				role={ROLES.textbox}
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
					size={value ? TEXT_SIZES[12] : TEXT_SIZES[18]}
				>
					{title}
				</Text>
			)}
			{Icon && (
				<Icon
					alt={`Icon in input ${title} with id ${id}`}
					className={twMerge("absolute top-1/2 left-5 transform -translate-y-1/2", iconClassName)}
					size={iconSize}
				/>
			)}
			{status && (
				<StatusIcon
					status={status}
					className="absolute right-5 bottom-[calc(50%-10px)]"
					size={iconSize}
				/>
			)}
			{value && clearable && (
				<XCircleIcon
					alt={`Clear input ${title} with id ${id}`}
					weight="fill"
					size={iconSize}
					className="absolute right-5 bottom-[calc(50%-10px)] fill-black-20"
					onClick={onClear}
				/>
			)}
		</div>
		{error && (
			<Text className="text-secondary-red" size={12}>
				{error}
			</Text>
		)}
	</div>
);

Input.displayName = "Input";
export { Input };
