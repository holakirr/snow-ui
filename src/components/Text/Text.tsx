import { type VariantProps, cva } from "class-variance-authority";
import type { ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const textStyles = cva(["font-normal transition-all"], {
	variants: {
		size: {
			64: "text-[4rem] leading-[4.875rem]",
			48: "text-[3rem] leading-[3.625rem]",
			24: "text-[1.5rem] leading-[2.25rem]",
			18: "text-[1.125rem] leading-[1.5rem]",
			14: "text-[0.875rem] leading-[1.25rem]",
			12: "text-[0.75rem] leading-[1.125rem]",
		},
		semibold: {
			true: "font-semibold",
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
		italic: {
			true: "italic",
		},
		underline: {
			true: "underline",
		},
	},
	defaultVariants: {
		size: 12,
		align: "left",
	},
});

export type TextSize = VariantProps<typeof textStyles>["size"];

type TextProps<C extends ElementType> = React.ComponentProps<C> &
	VariantProps<typeof textStyles> & {
		as?: C;
	};

export const Text = <C extends ElementType = "span">({
	as,
	size,
	semibold,
	align,
	italic,
	underline,
	className,
	children,
	ref,
	...props
}: TextProps<C>): ReactNode => {
	const Component = as || "span";
	return (
		<Component
			ref={ref}
			className={twMerge(textStyles({ size, semibold, align, italic, underline, className }))}
			{...props}
		>
			{children}
		</Component>
	);
};
