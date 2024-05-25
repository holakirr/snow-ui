import type { DateTypeEnum } from "@types";
import type { DatePickerProps } from "@widgets";
import { useState } from "react";

const initialDatePickerState = {
	startOfWeek: 1,
	changingType: "date",
	withTime: false,
	lastSelection: undefined,
	dateLimits: undefined,
} as const;

const getNewSelected = (
	changingDate: Date,
	newDate: Date,
	changingType: DateTypeEnum,
	dateLimits?: [Date, Date],
) => {
	if (dateLimits) {
		const [minDate, maxDate] = dateLimits;
		if (newDate.valueOf() < minDate.valueOf()) {
			return minDate;
		}
		if (newDate.valueOf() > maxDate.valueOf()) {
			return maxDate;
		}
	}

	return new Date(
		["year", "month", "date"].includes(changingType)
			? newDate.getFullYear()
			: changingDate.getFullYear(),
		["month", "date"].includes(changingType)
			? newDate.getMonth()
			: changingDate.getMonth(),
		changingType === "date" ? newDate.getDate() : changingDate.getDate(),
		changingType === "hours" ? newDate.getHours() : changingDate.getHours(),
		changingType === "minutes"
			? newDate.getMinutes()
			: changingDate.getMinutes(),
	);
};

export const useDatePicker = (
	props: Pick<DatePickerProps, "selected"> &
		Partial<Omit<DatePickerProps, "selected">>,
): DatePickerProps => {
	const [datePickerState, setDatePickerState] = useState<
		Omit<
			DatePickerProps,
			| "onDateSelect"
			| "onTypeChange"
			| "onDisplayMonthChange"
			| "onDisplayYearChange"
			| "onFromOrToChange"
		>
	>({
		...initialDatePickerState,
		...props,
		displayMonth: props.displayMonth
			? props.displayMonth
			: props.selected.getMonth(),
		displayYear: props.displayYear
			? props.displayYear
			: props.selected.getFullYear(),
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
			displayYear:
				month < 0
					? displayYear - 1
					: month > 11
						? displayYear + 1
						: displayYear,
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
		const newDate = getNewSelected(selected, date, changingType, dateLimits);
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