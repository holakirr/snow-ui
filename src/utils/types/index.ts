import type { IconProps, IconWeight } from "@phosphor-icons/react";
import type {
	ForwardRefExoticComponent,
	ReactElement,
	RefAttributes,
} from "react";

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
