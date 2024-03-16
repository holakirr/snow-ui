import type { IconProps, IconWeight } from "@phosphor-icons/react";
import type { ReactElement } from "react";

export type CustomIconWeights = Map<IconWeight, ReactElement>;

export interface IconBaseProps extends IconProps {
	weights: CustomIconWeights;
}

export interface CustomIconProps extends IconProps {
	alt: string;
}
