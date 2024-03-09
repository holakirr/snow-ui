import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariants = VariantProps<typeof buttonStyles>;
type ButtonProps = ButtonVariants & ComponentProps<"button">;

const buttonStyles = cva(
	["py-4 px-8 rounded-lg transition-all disabled:cursor-not-allowed"],
	{
		variants: {
			variant: {
				filled: ["your", "filled", "classes"],
				borderless: ["your", "borderless", "classes"],
				outlined: ["your", "outlined", "classes"],
			},
			size: {
				sm: ["your", "small", "classes"],
				md: ["your", "medium", "classes"],
				lg: ["your", "large", "classes"],
			},
		},
		defaultVariants: {
			variant: "filled",
			size: "md",
		},
	},
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant, size, className, ...props }, ref) => (
		<button
			ref={ref}
			type="button"
			className={twMerge(buttonStyles({ variant, size, className }))}
			{...props}
		/>
	),
);
