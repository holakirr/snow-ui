import type { DatePickerProps } from "@components";
import type { DateTypeEnum } from "@types";
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
		if (newDate.valueOf() < dateLimits[0].valueOf()) {
			return dateLimits[0];
		}
		if (newDate.valueOf() > dateLimits[1].valueOf()) {
			return dateLimits[1];
		}
	}

	switch (changingType) {
		case "date":
			return new Date(
				newDate.getFullYear(),
				newDate.getMonth(),
				newDate.getDate(),
				changingDate.getHours(),
				changingDate.getMinutes(),
			);
		case "month":
			return new Date(
				newDate.getFullYear(),
				newDate.getMonth(),
				changingDate.getDate(),
				changingDate.getHours(),
				changingDate.getMinutes(),
			);
		case "year":
			return new Date(
				newDate.getFullYear(),
				changingDate.getMonth(),
				changingDate.getDate(),
				changingDate.getHours(),
				changingDate.getMinutes(),
			);
		case "hours":
			return new Date(
				changingDate.getFullYear(),
				changingDate.getMonth(),
				changingDate.getDate(),
				newDate.getHours(),
				changingDate.getMinutes(),
			);
		case "minutes":
			return new Date(
				changingDate.getFullYear(),
				changingDate.getMonth(),
				changingDate.getDate(),
				changingDate.getHours(),
				newDate.getMinutes(),
			);
	}
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
			: Array.isArray(props.selected)
				? props.selected[0].getMonth()
				: props.selected.getMonth(),
		displayYear: props.displayYear
			? props.displayYear
			: Array.isArray(props.selected)
				? props.selected[0].getFullYear()
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
		const newDate = getNewSelected(selected, date, changingType, dateLimits);
		return setDatePickerState((prev) => ({
			...prev,
			selected: newDate,
			displayMonth: newDate.getMonth(),
			displayYear: newDate.getFullYear(),
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

	const onDateSelect = (newDate: Date) => {
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
