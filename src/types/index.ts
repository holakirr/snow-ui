import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
import type { ReactElement } from "react";

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

type CustomIconType = (props: CustomIconProps) => JSX.Element;

export type CustomIcon = CustomIconType & { displayName: string };

export type BaseIcon = (props: IconBaseProps) => JSX.Element;

export type ButtonVariant = "borderless" | "gray" | "outline" | "filled";

export type SeparatorDirection = "horizontal" | "vertical";

export type BreadcrumbType = {
	label: string;
	id: string;
	disabled?: boolean;
};

export type NavigationItemType = {
	label: string;
	id: string;
	items?: NavigationItemType[];
	icon?: Icon | CustomIcon;
};

export type ModifiedNavigationItemType = NavigationItemType & {
	expanded?: boolean;
	active?: boolean;
};

export type DateTypeEnum = "date" | "month" | "year" | "hours" | "minutes";
