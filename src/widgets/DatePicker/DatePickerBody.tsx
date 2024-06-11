import type { DatePickerType } from "@types";
import { DateView } from "./DateView";
import { QuarterView } from "./QuarterView";
import { TimeView } from "./TimeView";
import { YearView } from "./YearView";

type DatePickerBodyProps = Pick<
	DatePickerType,
	| "selected"
	| "displayMonth"
	| "displayYear"
	| "startOfWeek"
	| "changingType"
	| "dateLimits"
	| "lastSelection"
	| "onDateSelect"
	| "onDisplayMonthChange"
	| "onDisplayYearChange"
	| "onTypeChange"
>;

export const DatePickerBody = ({
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	dateLimits,
	lastSelection,
	onDateSelect,
	onDisplayMonthChange,
	onDisplayYearChange,
	onTypeChange,
}: DatePickerBodyProps) => {
	const now = new Date();

	switch (changingType) {
		case "date":
			return (
				<DateView
					current={now}
					selected={selected}
					displayMonth={displayMonth}
					displayYear={displayYear}
					startOfWeek={startOfWeek}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onDateSelect={onDateSelect}
					onDisplayMonthChange={onDisplayMonthChange}
				/>
			);
		case "month":
			return (
				<YearView
					current={now.getMonth()}
					selected={selected}
					displayYear={displayYear}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onDisplayYearChange={onDisplayYearChange}
					onDateSelect={onDateSelect}
					onTypeChange={onTypeChange}
					onMonthSelect={(month) => {
						onDisplayMonthChange(month);
						onDateSelect(new Date(displayYear, month));
					}}
				/>
			);

		case "year":
			return (
				<QuarterView
					current={now.getFullYear()}
					displayYear={displayYear}
					selected={selected.getFullYear()}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onTypeChange={onTypeChange}
					onDisplayYearChange={onDisplayYearChange}
					onYearSelect={(year) => {
						onDisplayYearChange(year);
						onDateSelect(new Date(year, displayMonth));
					}}
				/>
			);
		case "hours":
		case "minutes":
			return (
				<TimeView
					current={now}
					selected={selected}
					changingType={changingType}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onDateSelect={onDateSelect}
					onTypeChange={onTypeChange}
				/>
			);
		default:
			return null;
	}
};
