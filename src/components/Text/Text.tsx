import { type VariantProps, cva } from "class-variance-authority";
import { type ElementType, type ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import type { PolimorphicComponentPropsWithRef, PolimorphicRef } from "../..";

const textStyles = cva(["w-full font-normal transition-all"], {
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

export type TextSizes = VariantProps<typeof textStyles>["size"];

type TextProps<C extends ElementType> = PolimorphicComponentPropsWithRef<
	C,
	VariantProps<typeof textStyles>
>;

type TextComponent = <C extends ElementType = "span">(
	props: TextProps<C>,
) => ReactNode;

export const Text: TextComponent = forwardRef(
	<C extends ElementType = "span">(
		{
			as,
			size,
			semibold,
			align,
			italic,
			underline,
			className,
			children,
			...props
		}: TextProps<C>,
		ref?: PolimorphicRef<C>,
	): ReactNode => {
		const Component = as || "span";
		return (
			<Component
				ref={ref}
				className={twMerge(
					textStyles({ size, semibold, align, italic, underline, className }),
				)}
				{...props}
			>
				{children}
			</Component>
		);
	},
);
