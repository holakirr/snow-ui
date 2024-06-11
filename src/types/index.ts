import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
import type { ReactElement } from "react";

export type PickAndPartialOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

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

export type DateLimitsType = [Date | null, Date | null];

export type DatePickerType = {
	selected: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	dateLimits: DateLimitsType;
	withTime?: boolean;
	lastSelection?: Date;
	onDateSelect: (date: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onDisplayMonthChange: (month: number) => void;
	onDisplayYearChange: (year: number) => void;
};

export type RangePickerType = {
	from: Date;
	to: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	changingFromOrTo: "from" | "to";
	dateLimits: DateLimitsType;
	withTime?: boolean;
	lastSelection?: Date;
	onDateSelect: (date: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onDisplayMonthChange: (month: number) => void;
	onDisplayYearChange: (year: number) => void;
	onFromOrToChange: (fromOrTo: "from" | "to") => void;
};
