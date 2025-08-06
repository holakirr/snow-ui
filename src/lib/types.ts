import type { ComponentPropsWithoutRef, FC, ReactElement, RefAttributes } from "react";

export type IconSize = 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;

export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
export interface IconProps extends ComponentPropsWithoutRef<"svg">, RefAttributes<SVGSVGElement> {
	alt?: string;
	color?: string;
	size?: string | number;
	weight?: IconWeight;
	mirrored?: boolean;
}

export type CustomIconWeights = Map<IconWeight, ReactElement>;

export interface IconBaseProps extends IconProps {
	weights: CustomIconWeights;
}

/**
 * Represents the properties for a custom icon.
 */
export interface CustomIconProps extends IconProps {
	/**
	 * The size of the icon.
	 */
	size?: IconSize;
}

export type Icon = FC<CustomIconProps>;

export type BaseIcon = FC<IconBaseProps>;

export type Status = "progress" | "error" | "success";
