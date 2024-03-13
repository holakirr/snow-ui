import type {
	ComponentPropsWithRef,
	ComponentPropsWithoutRef,
	ElementType,
	JSXElementConstructor,
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
