import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../";

export type ButtonVariants = "borderless" | "gray" | "outline" | "filled";
export type ButtonSizes = "sm" | "md" | "lg";
type ButtonProps = VariantProps<typeof buttonStyles> &
	ComponentProps<"button"> & {
		label: string;
	};

const buttonStyles = cva(
	[
		"group transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-black-10 inline-flex justify-center items-center focus:ring-4 focus:ring-black-5",
	],
	{
		variants: {
			variant: {
				borderless: ["text-black-100 font-normal hover:bg-black-5"],
				gray: "text-black-100 bg-black-5 hover:bg-black-20 disabled:bg-black-5 focus:ring-offset-2",
				outline: [
					"text-black-100 border-1 border-black-10 border-solid hover:bg-black-5 disabled:border-black-10",
				],
				filled: [
					"text-white-100 bg-primary-brand hover:bg-primary-brand-hover disabled:bg-black-5",
				],
			},
			size: {
				sm: ["text-sm py-1 px-2 rounded-lg gap-1"],
				md: ["text-lg py-2 px-4 rounded-xl gap-2"],
				lg: ["text-lg py-4 px-6 rounded-2xl gap-2"],
			},
		},
		defaultVariants: {
			variant: "borderless",
			size: "sm",
		},
	},
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant, size, className, label, ...props }, ref) => (
		<button
			ref={ref}
			type="button"
			className={twMerge(buttonStyles({ variant, size, className }))}
			{...props}
		>
			<Text size={size === "sm" ? 14 : 18} className="group-hover:px-1">
				{label}
			</Text>
		</button>
	),
);
