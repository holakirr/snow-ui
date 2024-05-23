import type { DatePickerProps } from "@components";
import type { DateTypeEnum } from "@types";
import { useState } from "react";

const initialDatePickerState = {
	startOfWeek: 1,
	changingType: "date",
	changingFromOrTo: "from",
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
		changingFromOrTo,
		withTime,
		lastSelection,
		dateLimits,
	} = datePickerState;

	const setSelected = (date: Date, fromOrTo?: "from" | "to") =>
		setDatePickerState((prev) => ({
			...prev,
			selected: Array.isArray(prev.selected)
				? fromOrTo === "from"
					? [
							getNewSelected(prev.selected[0], date, changingType, dateLimits),
							prev.selected[1],
						]
					: [
							prev.selected[0],
							getNewSelected(prev.selected[1], date, changingType, dateLimits),
						]
				: getNewSelected(prev.selected, date, changingType, dateLimits),
			displayMonth: date.getMonth(),
			displayYear: date.getFullYear(),
		}));
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
	const setFromOrTo = (fromOrTo: "from" | "to") => {
		const newDisplayDate = Array.isArray(selected)
			? fromOrTo === "from"
				? selected[0]
				: selected[1]
			: selected;
		return setDatePickerState((prev) => ({
			...prev,
			changingFromOrTo: fromOrTo,
			displayMonth: newDisplayDate.getMonth(),
			displayYear: newDisplayDate.getFullYear(),
		}));
	};
	const setDisplayYear = (year: number) =>
		setDatePickerState((prev) => ({
			...prev,
			displayYear: year,
		}));

	const onDateSelect = (newDate: Date) => {
		if (Array.isArray(selected)) {
			const newDateValue = newDate.valueOf();
			if (changingFromOrTo === "from") {
				if (newDateValue === selected[0].valueOf()) {
					setFromOrTo("to");
				}
				setSelected(newDate, "from");
				if (newDateValue >= selected[1].valueOf()) {
					setSelected(newDate, "to");
				}
			} else {
				setSelected(newDate, "to");
				if (newDateValue <= selected[0].valueOf()) {
					setSelected(newDate, "from");
				}
			}
		} else {
			setSelected(newDate);
		}

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
	const onFromOrToChange = (changingFromOrTo: "from" | "to") => {
		setFromOrTo(changingFromOrTo);

		if (props.onFromOrToChange) props.onFromOrToChange(changingFromOrTo);
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
		changingFromOrTo,
		withTime,
		lastSelection,
		dateLimits,
		onDateSelect,
		onTypeChange,
		onDisplayMonthChange,
		onDisplayYearChange,
		onFromOrToChange,
	};
};
