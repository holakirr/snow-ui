import { useState } from "react";
import { getNewDate } from "../helpers";
import type { DatePickerType, DateTypeEnum, PickAndPartialOmit } from "../types";

const initialDatePickerState: Pick<
	DatePickerType,
	"startOfWeek" | "changingType" | "withTime" | "lastSelection" | "dateLimits"
> = {
	startOfWeek: 1,
	changingType: "date",
	withTime: false,
	lastSelection: undefined,
	dateLimits: [null, null],
} as const;

export const useDatePicker = (
	props: PickAndPartialOmit<DatePickerType, "selected">,
): DatePickerType => {
	const [datePickerState, setDatePickerState] = useState<
		Omit<
			DatePickerType,
			| "onDateSelect"
			| "onTypeChange"
			| "onDisplayMonthChange"
			| "onDisplayYearChange"
			| "onFromOrToChange"
		>
	>({
		...initialDatePickerState,
		...props,
		displayMonth: props.displayMonth ? props.displayMonth : props.selected.getMonth(),
		displayYear: props.displayYear ? props.displayYear : props.selected.getFullYear(),
	});
	const {
		selected,
		displayMonth,
		displayYear,
		startOfWeek,
		changingType,
		withTime,
		lastSelection,
		dateLimits,
	} = datePickerState;

	const setSelected = (date: Date) => {
		return setDatePickerState((prev) => ({
			...prev,
			selected: date,
			displayMonth: date.getMonth(),
			displayYear: date.getFullYear(),
		}));
	};
	const setDisplayMonth = (month: number) =>
		setDatePickerState((prev) => ({
			...prev,
			displayMonth: (12 + month) % 12,
			displayYear: month < 0 ? displayYear - 1 : month > 11 ? displayYear + 1 : displayYear,
		}));
	const setType = (type: DateTypeEnum) =>
		setDatePickerState((prev) => ({
			...prev,
			changingType: type,
		}));
	const setDisplayYear = (year: number) =>
		setDatePickerState((prev) => ({
			...prev,
			displayYear: year,
		}));

	const onDateSelect = (date: Date) => {
		const newDate = getNewDate({
			changingDate: selected,
			date,
			changingType,
			dateLimits,
		});
		setSelected(newDate);

		if (props.onDateSelect) props.onDateSelect(newDate);
	};
	const onDisplayMonthChange = (month: number) => {
		setDisplayMonth(month);

		if (props.onDisplayMonthChange) props.onDisplayMonthChange(month);
	};
	const onTypeChange = (type: DateTypeEnum) => {
		setType(type);

		if (props.onTypeChange) props.onTypeChange(type);
	};
	const onDisplayYearChange = (year: number) => {
		setDisplayYear(year);

		if (props.onDisplayYearChange) props.onDisplayYearChange(year);
	};

	return {
		selected,
		displayMonth,
		displayYear,
		startOfWeek,
		changingType,
		withTime,
		lastSelection,
		dateLimits,
		onDateSelect,
		onTypeChange,
		onDisplayMonthChange,
		onDisplayYearChange,
	};
};
