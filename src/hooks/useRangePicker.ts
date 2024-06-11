import { getNewRange } from "@helpers";
import type { DateTypeEnum, PickAndPartialOmit, RangePickerType } from "@types";
import { useState } from "react";

const initialDatePickerState: Pick<
	RangePickerType,
	"startOfWeek" | "changingType" | "withTime" | "lastSelection" | "dateLimits" | "changingFromOrTo"
> = {
	startOfWeek: 1,
	changingType: "date",
	withTime: false,
	lastSelection: undefined,
	dateLimits: [null, null],
	changingFromOrTo: "from",
} as const;

export const useRangePicker = (
	props: PickAndPartialOmit<RangePickerType, "from" | "to" | "onDateSelect"> & {
		onDateSelect?: ({ from, to }: { from: Date; to: Date }) => void;
	},
): RangePickerType => {
	const [datePickerState, setDatePickerState] = useState<
		Omit<
			RangePickerType,
			| "onDateSelect"
			| "onTypeChange"
			| "onDisplayMonthChange"
			| "onDisplayYearChange"
			| "onFromOrToChange"
		>
	>({
		...initialDatePickerState,
		...props,
		displayMonth: props.displayMonth ? props.displayMonth : props.from.getMonth(),
		displayYear: props.displayYear ? props.displayYear : props.from.getFullYear(),
	});
	const {
		from,
		to,
		displayMonth,
		displayYear,
		startOfWeek,
		changingType,
		withTime,
		lastSelection,
		dateLimits,
		changingFromOrTo,
	} = datePickerState;

	const setSelected = ({ from, to }: { from: Date; to: Date }) => {
		const currDate = changingFromOrTo === "from" ? from : to;
		return setDatePickerState((prev) => ({
			...prev,
			from,
			to,
			displayMonth: currDate.getMonth(),
			displayYear: currDate.getFullYear(),
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
		const newRange = getNewRange({
			from,
			to,
			date,
			changingType,
			dateLimits,
			changingFromOrTo,
		});
		setSelected(newRange);

		if (props.onDateSelect) props.onDateSelect(newRange);
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
	const onFromOrToChange = (fromOrTo: "from" | "to") => {
		setDatePickerState((prev) => ({
			...prev,
			changingFromOrTo: fromOrTo,
		}));

		if (props.onFromOrToChange) props.onFromOrToChange(fromOrTo);
	};

	return {
		from,
		to,
		displayMonth,
		displayYear,
		startOfWeek,
		changingType,
		withTime,
		lastSelection,
		dateLimits,
		changingFromOrTo,
		onDateSelect,
		onTypeChange,
		onDisplayMonthChange,
		onDisplayYearChange,
		onFromOrToChange,
	};
};
