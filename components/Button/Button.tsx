import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariants = "borderless" | "gray" | "outline" | "filled";
type ButtonSizes = "sm" | "md" | "lg";
type ButtonProps = {
	variant?: ButtonVariants;
	size?: ButtonSizes;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
	variant = "filled",
	size = "md",
	onClick,
}: ButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={twMerge(
			"py-4 px-8 rounded-lg transition-all hover:bg-opacity-70 active:bg-opacity-100 active:underline",
			variant === "borderless" && "bg-primary text-white",
			variant === "gray" && "bg-white text-primary",
			variant === "outline" && "p-0 text-primary hover:underline",
			variant === "filled" && "bg-primary text-white",
		)}
	>
		Button
	</button>
);
