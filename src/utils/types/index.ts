import type { IconProps, IconWeight } from "@phosphor-icons/react";
import type {
	ForwardRefExoticComponent,
	ReactElement,
	RefAttributes,
} from "react";

export type StatusNotify = "success" | "error";

export type Status = StatusNotify | "progress";

export type StatusExpanded = StatusNotify | "warning" | "default" | "info";

export type SimpleSize = "sm" | "lg";

export type Size = SimpleSize | "md";

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

export type SeparatorDirection = "horizontal" | "vertical";
