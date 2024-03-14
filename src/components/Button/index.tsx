import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonVariants = "borderless" | "gray" | "outline" | "filled";
export type ButtonSizes = "sm" | "md" | "lg";
type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

const buttonStyles = cva(
	[
		"transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:text-black-10 inline-flex justify-center items-center",
	],
	{
		variants: {
			variant: {
				borderless: ["text-black-100 font-normal hover:bg-black-5"],
				gray: [
					"text-black-100 bg-black-5 hover:bg-black-20 disabled:bg-black-5",
				],
				outline: [
					"text-black-100 border-1 border-black-10 border-solid hover:bg-black-5 disabled:border-black-10",
				],
				filled: [
					"text-white-100 bg-primary-brand hover:bg-primary-brand hover:bg-gradient-to-b hover:from-white-40 hover:to-white-40 disabled:bg-black-5",
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
	({ variant, size, className, ...props }, ref) => (
		<button
			ref={ref}
			type="button"
			className={twMerge(buttonStyles({ variant, size, className }))}
			{...props}
		/>
	),
);
