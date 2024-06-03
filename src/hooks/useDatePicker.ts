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

const getNewSelected = ({
	changingDate,
	date,
	changingType,
	dateLimits,
}: {
	changingDate: Date;
	date: Date;
	changingType: DateTypeEnum;
	dateLimits?: [Date, Date];
}): Date => {
	const newDate = new Date(
		["year", "month", "date"].includes(changingType)
			? date.getFullYear()
			: changingDate.getFullYear(),
		["month", "date"].includes(changingType) ? date.getMonth() : changingDate.getMonth(),
		changingType === "date" ? date.getDate() : changingDate.getDate(),
		["hours", "minutes"].includes(changingType) ? date.getHours() : changingDate.getHours(),
		["hours", "minutes"].includes(changingType) ? date.getMinutes() : changingDate.getMinutes(),
	);

	if (dateLimits) {
		const [minDate, maxDate] = dateLimits;
		if (newDate.valueOf() < minDate.valueOf()) {
			return minDate;
		}
		if (newDate.valueOf() > maxDate.valueOf()) {
			return maxDate;
		}
	}

	return newDate;
};

type PickAndOmit<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export const useDatePicker = (props: PickAndOmit<DatePickerProps, "selected">): DatePickerProps => {
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
		const newDate = getNewSelected({
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
