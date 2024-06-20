import type { Icon } from "@phosphor-icons/react";
import { type VariantProps, cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ROLES } from "../../constants";
import type { CustomIcon } from "../../types";
import { Text, type TextSize } from "../Text";

/**
 * Props for the Button component.
 */
type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonStyles> & {
		/**
		 * The label text or number displayed on the button.
		 */
		label?: string | number;

		/**
		 * The icon component to be displayed on the right side of the button.
		 */
		rightIcon?: Icon | CustomIcon;

		/**
		 * The icon component to be displayed on the left side of the button.
		 */
		leftIcon?: Icon | CustomIcon;

		/**
		 * The size of the text displayed on the button.
		 */
		textSize?: TextSize;
	};

const buttonStyles = cva(
	"group transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:text-black-10 inline-flex justify-center items-center focus:outline-none focus:ring-4 focus:ring-black-5 active:scale-95",
	{
		variants: {
			variant: {
				borderless: "text-black-100 bg-transparent font-normal hover:bg-black-5",
				gray: "text-black-100 bg-black-5 hover:bg-black-20 disabled:bg-black-5 focus:ring-offset-2",
				outline:
					"text-black-100 bg-transparent border border-black-10 border-solid hover:bg-black-5 disabled:border-black-10",
				filled: "text-white-100 bg-primary-brand hover:bg-primary-brandHover disabled:bg-black-5",
			},
			size: {
				sm: "text-sm py-1 px-2 rounded-lg gap-1",
				md: "text-lg py-2 px-4 rounded-xl gap-2",
				lg: "text-lg py-4 px-6 rounded-2xl gap-2",
			},
		},
		defaultVariants: {
			variant: "borderless",
			size: "sm",
		},
	},
);

const IconSizes = {
	sm: 16,
	md: 20,
	lg: 24,
} as const;

const Paddings = {
	sm: "p-1",
	md: "p-2",
	lg: "p-4",
} as const;

const Button = ({
	variant = "borderless",
	size = "sm",
	className,
	label,
	textSize,
	leftIcon: LeftIcon,
	rightIcon: RightIcon,
	ref,
	...props
}: ButtonProps) => (
	<button
		ref={ref}
		type="button"
		title={label?.toString() || "Button title"}
		className={twMerge(
			buttonStyles({ variant, size }),
			LeftIcon && !RightIcon && !label ? Paddings[size || "sm"] : "",
			className,
		)}
		role={ROLES.button}
		aria-label={label?.toString() || "Button aria label"}
		{...props}
	>
		{LeftIcon && <LeftIcon size={IconSizes[size || "sm"]} alt={`Left icon in button ${label}`} />}
		{label && (
			<Text
				size={textSize ? textSize : size === "sm" ? 14 : 18}
				className="group-hover:px-1 text-center"
			>
				{label}
			</Text>
		)}
		{RightIcon && (
			<RightIcon size={IconSizes[size || "sm"]} alt={`Right icon in button ${label}`} />
		)}
	</button>
);

Button.displayName = "Button";
export { Button };
