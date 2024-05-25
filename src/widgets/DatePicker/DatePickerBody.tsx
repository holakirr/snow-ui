import type { DateTypeEnum } from "@types";
import { DateView } from "./DateView";
import { HoursView } from "./HoursView";
import { MinutesView } from "./MinutesView";
import { QuarterView } from "./QuarterView";
import { YearView } from "./YearView";

type DatePickerBodyProps = {
	date: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (date: Date) => void;
	onMonthChange: (month: number) => void;
	onYearChange: (year: number) => void;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const DatePickerBody = ({
	date,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	lastSelection,
	dateLimits,
	onDateSelect,
	onMonthChange,
	onYearChange,
	onTypeChange,
}: DatePickerBodyProps) => {
	const now = new Date();

	switch (changingType) {
		case "date":
			return (
				<DateView
					current={now}
					selected={date}
					displayMonth={displayMonth}
					displayYear={displayYear}
					startOfWeek={startOfWeek}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onDateSelect={onDateSelect}
					onMonthChange={onMonthChange}
				/>
			);
		case "month":
			return (
				<YearView
					current={now.getMonth()}
					selected={date}
					displayYear={displayYear}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onYearChange={onYearChange}
					onDateSelect={onDateSelect}
					onTypeChange={onTypeChange}
					onMonthSelect={(month) => {
						onMonthChange(month);
						onDateSelect(
							new Date(
								displayYear,
								month,
								date.getDate(),
								date.getHours(),
								date.getMinutes(),
							),
						);
					}}
				/>
			);

		case "year":
			return (
				<QuarterView
					current={now.getFullYear()}
					displayYear={displayYear}
					selected={date.getFullYear()}
					dateLimits={dateLimits}
					lastSelection={lastSelection}
					onTypeChange={onTypeChange}
					onYearChange={onYearChange}
					onDateSelect={onDateSelect}
					onYearSelect={(year) => {
						onYearChange(year);
						onDateSelect(
							new Date(
								year,
								displayMonth,
								date.getDate(),
								date.getHours(),
								date.getMinutes(),
							),
						);
					}}
				/>
			);
		case "hours":
			return <HoursView />;
		case "minutes":
			return <MinutesView />;
		default:
			return null;
	}
};
