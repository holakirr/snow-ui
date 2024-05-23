import { type VariantProps, cva } from "class-variance-authority";
import {
	type ComponentPropsWithRef,
	type ComponentPropsWithoutRef,
	type ElementType,
	type JSXElementConstructor,
	type ReactNode,
	forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

export type PropsOf<
	C extends keyof JSX.IntrinsicElements | JSXElementConstructor<unknown>,
> = JSX.LibraryManagedAttributes<C, ComponentPropsWithoutRef<C>>;

type AsProp<C extends ElementType> = { as?: C };

export type ExtendableProps<
	ExtendedProps = unknown,
	OverrideProps = unknown,
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

export type InheritableElementProps<
	C extends ElementType,
	Props = unknown,
> = ExtendableProps<PropsOf<C>, Props>;

export type PolimorphicComponentProps<
	C extends ElementType,
	Props = unknown,
> = InheritableElementProps<C, Props & AsProp<C>>;

export type PolimorphicRef<C extends ElementType> =
	ComponentPropsWithRef<C>["ref"];

export type PolimorphicComponentPropsWithRef<
	C extends ElementType,
	Props = unknown,
> = PolimorphicComponentProps<C, Props> & { ref?: PolimorphicRef<C> };

const textStyles = cva(["font-normal transition-all font-['Inter']"], {
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
