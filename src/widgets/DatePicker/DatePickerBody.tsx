import type { DateTypeEnum } from "@types";
import { DateView } from "./DateView";
import { QuarterView } from "./QuarterView";
import { TimeView } from "./TimeView";
import { YearView } from "./YearView";

type DatePickerBodyProps = {
	selected: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (date: Date) => void;
	onDisplayMonthChange: (month: number) => void;
	onDisplayYearChange: (year: number) => void;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const DatePickerBody = ({
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	lastSelection,
	dateLimits,
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
