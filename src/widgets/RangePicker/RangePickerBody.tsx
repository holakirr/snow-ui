import type { RangePickerType } from "@types";
import { DateView } from "./DateView";
import { QuarterView } from "./QuarterView";
import { TimeView } from "./TimeView";
import { YearView } from "./YearView";

type RangePickerBodyProps = Pick<
	RangePickerType,
	| "from"
	| "to"
	| "displayMonth"
	| "displayYear"
	| "startOfWeek"
	| "changingType"
	| "changingFromOrTo"
	| "lastSelection"
	| "dateLimits"
	| "onDateSelect"
	| "onDisplayMonthChange"
	| "onDisplayYearChange"
	| "onTypeChange"
>;

export const RangePickerBody = ({
	from,
	to,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	changingFromOrTo,
	lastSelection,
	dateLimits,
	onDateSelect,
	onDisplayMonthChange,
	onDisplayYearChange,
	onTypeChange,
}: RangePickerBodyProps) => {
	const now = new Date();
	const currDate = changingFromOrTo === "from" && from ? from : to;

	switch (changingType) {
		case "date":
			return (
				<DateView
					current={now}
					from={from}
					to={to}
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
					selected={currDate}
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
					selected={currDate.getFullYear()}
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
					selected={currDate}
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
