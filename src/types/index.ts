import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
import type { ReactElement } from "react";

export type PickAndPartialOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type StatusNotify = "success" | "error";

export type Status = StatusNotify | "progress";

export type StatusExpanded = StatusNotify | "warning" | "default" | "info";

export type SimpleSize = "sm" | "lg";

export type Size = SimpleSize | "md";

export type IconSize = 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;

export type CustomIconWeights = Map<IconWeight, ReactElement>;

export interface IconBaseProps extends IconProps {
	weights: CustomIconWeights;
}

/**
 * Represents the properties for a custom icon.
 */
export interface CustomIconProps extends IconProps {
	/**
	 * The alternative text for the icon.
	 */
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
	active?: boolean;
	href?: string;
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

/**
 * Represents the configuration options for a date picker.
 */
export type DatePickerType = {
	/**
	 * The currently selected date.
	 */
	selected: Date;
	/**
	 * The month to display in the date picker.
	 */
	displayMonth: number;
	/**
	 * The year to display in the date picker.
	 */
	displayYear: number;
	/**
	 * The starting day of the week in the date picker.
	 */
	startOfWeek: number;
	/**
	 * The type of date being displayed in the date picker.
	 */
	changingType: DateTypeEnum;
	/**
	 * The limits for selecting dates in the date picker.
	 */
	dateLimits: DateLimitsType;
	/**
	 * Indicates whether the time should be displayed in the date picker.
	 */
	withTime?: boolean;
	/**
	 * The last selected date in the date picker.
	 */
	lastSelection?: Date;
	/**
	 * A callback function that is called when a date is selected in the date picker.
	 * @param date The selected date.
	 */
	onDateSelect: (date: Date) => void;
	/**
	 * A callback function that is called when the type of date being displayed in the date picker changes.
	 * @param type The new date type.
	 */
	onTypeChange: (type: DateTypeEnum) => void;
	/**
	 * A callback function that is called when the displayed month in the date picker changes.
	 * @param month The new month.
	 */
	onDisplayMonthChange: (month: number) => void;
	/**
	 * A callback function that is called when the displayed year in the date picker changes.
	 * @param year The new year.
	 */
	onDisplayYearChange: (year: number) => void;
};

/**
 * Represents the configuration options for a range picker.
 */
export type RangePickerType = {
	/**
	 * The start date of the range.
	 */
	from: Date;
	/**
	 * The end date of the range.
	 */
	to: Date;
	/**
	 * The month to display in the range picker.
	 */
	displayMonth: number;
	/**
	 * The year to display in the range picker.
	 */
	displayYear: number;
	/**
	 * The starting day of the week in the range picker.
	 */
	startOfWeek: number;

	/**
	 * The type of date being displayed in the range picker.
	 */
	changingType: DateTypeEnum;

	/**
	 * The type of date being changed in the range picker.
	 */
	changingFromOrTo: "from" | "to";

	/**
	 * The limits for selecting dates in the range picker.
	 */
	dateLimits: DateLimitsType;

	/**
	 * Indicates whether the time should be displayed in the range picker.
	 */
	withTime?: boolean;

	/**
	 * The last selected date in the range picker.
	 */
	lastSelection?: Date;

	/**
	 * A callback function that is called when a date is selected in the range picker.
	 * @param date The selected date.
	 */
	onDateSelect: (date: Date) => void;

	/**
	 * A callback function that is called when the type of date being displayed in the range picker changes.
	 * @param type The new date type.
	 */
	onTypeChange: (type: DateTypeEnum) => void;

	/**
	 * A callback function that is called when the displayed month in the range picker changes.
	 * @param month The new month.
	 */
	onDisplayMonthChange: (month: number) => void;

	/**
	 * A callback function that is called when the displayed year in the range picker changes.
	 * @param year The new year.
	 */
	onDisplayYearChange: (year: number) => void;

	/**
	 * A callback function that is called when the type of date being changed in the range picker changes.
	 * @param fromOrTo The new date type.
	 */
	onFromOrToChange: (fromOrTo: "from" | "to") => void;
};

export type PopoverContentType = {
	/**
	 * The position of the popover.
	 * @default "bottom"
	 */
	position?: "top" | "bottom" | "left" | "right";

	/**
	 * Additional class name for the popover content.
	 */
	className?: string;
};

export type PopoverType = PopoverContentType & {
	/**
	 * Whether the popover is visible or not.
	 */
	visible: boolean;
};
