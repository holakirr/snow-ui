import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariants = VariantProps<typeof buttonStyles>;
type ButtonProps = ButtonVariants & ComponentProps<"button">;

const buttonStyles = cva(
	[
		"transition-all hover:cursor-pointer disabled:cursor-not-allowed flex justify-center items-center",
	],
	{
		variants: {
			variant: {
				borderless: ["hover:bg-black-5"],
				gray: ["your", "filled", "classes"],
				outline: ["your", "outlined", "classes"],
				filled: ["your", "filled", "classes"],
			},
			size: {
				sm: ["py-1 px-2 rounded-lg gap-1"],
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
