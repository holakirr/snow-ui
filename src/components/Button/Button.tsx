import { ComponentProps } from "react";

type ButtonVariants = "borderless" | "gray" | "outline" | "filled";
type ButtonSizes = "sm" | "md" | "lg";
type ButtonProps = {
	variant?: ButtonVariants;
	size?: ButtonSizes;
} & ComponentProps<"button">;

export const Button = ({
	variant = "filled",
	size = "md",
	onClick,
}: ButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={"py-4 px-8 rounded-lg transition-all dark:text-white"}
	>
		Button
	</button>
);
