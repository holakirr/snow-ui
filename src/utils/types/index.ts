import type { IconProps, IconWeight } from "@phosphor-icons/react";
import type {
	ComponentPropsWithRef,
	ComponentPropsWithoutRef,
	ElementType,
	ForwardRefExoticComponent,
	JSXElementConstructor,
	ReactElement,
	RefAttributes,
} from "react";

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

export type Status = "progress" | "success" | "error";

export type Size = "sm" | "md" | "lg";

export type CustomIconWeights = Map<IconWeight, ReactElement>;

export interface IconBaseProps extends IconProps {
	weights: CustomIconWeights;
}

export interface CustomIconProps extends IconProps {
	alt: string;
}

export type CustomIcon = ForwardRefExoticComponent<
	Omit<CustomIconProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export type ButtonVariant = "borderless" | "gray" | "outline" | "filled";
