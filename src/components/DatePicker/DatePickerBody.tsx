import type { DateTypeEnum } from "@types";
import { Button } from "../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../Icons";
import { Tag } from "../Tag";
import { Text } from "../Text";
import { MonthView } from "./MonthView";
import { QuarterView } from "./QuarterView";
import { YearView } from "./YearView";

type DatePickerBodyProps = {
	date: Date;
	rangeEnd?: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	changingType: DateTypeEnum;
	changingFromOrTo: "from" | "to";
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (date: Date) => void;
	onMonthChange: (month: number) => void;
	onYearChange: (year: number) => void;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const DatePickerBody = ({
	date,
	rangeEnd,
	displayMonth,
	displayYear,
	startOfWeek,
	changingType,
	changingFromOrTo,
	lastSelection,
	dateLimits,
	onDateSelect,
	onMonthChange,
	onYearChange,
	onTypeChange,
}: DatePickerBodyProps) => {
	const now = new Date();
	const currDate = changingFromOrTo === "to" && rangeEnd ? rangeEnd : date;

	switch (changingType) {
		case "date":
			return (
				<div className="flex flex-col h-full">
					<div className="flex justify-between px-4 pt-4">
						<div className="flex gap-2 items-center">
							<Tag label="Today" onClick={() => onDateSelect(now)} />
							{lastSelection && (
								<Tag
									label="Last selection"
									onClick={() => onDateSelect(lastSelection)}
								/>
							)}
						</div>
						<div className="flex gap-2 items-center">
							<Button
								leftIcon={ArrowLineLeftIcon}
								size="md"
								onClick={() => onMonthChange(displayMonth - 1)}
							/>
							<Text as="span" size={12}>
								{Intl.DateTimeFormat("en-US", { month: "long" })
									.format(new Date(displayYear, displayMonth))
									.slice(0, 3)}
							</Text>
							<Button
								leftIcon={ArrowLineRightIcon}
								size="md"
								onClick={() => onMonthChange(displayMonth + 1)}
							/>
						</div>
					</div>

					<div className="p-4 min-h-[260px]">
						<MonthView
							date={date}
							rangeEnd={rangeEnd}
							displayMonth={displayMonth}
							displayYear={displayYear}
							startOfWeek={startOfWeek}
							dateLimits={dateLimits}
							onDateSelect={onDateSelect}
							onMonthChange={onMonthChange}
						/>
					</div>
				</div>
			);
		case "month":
			return (
				<div className="flex flex-col h-full">
					<div className="flex justify-between px-4 pt-4">
						<div className="flex gap-2 items-center">
							<Tag label="This month" onClick={() => onDateSelect(now)} />
							{lastSelection && (
								<Tag
									label="Last selection"
									onClick={() => onDateSelect(lastSelection)}
								/>
							)}
						</div>
						<div className="flex gap-2 items-center">
							<Button
								leftIcon={ArrowLineLeftIcon}
								size="md"
								onClick={() => onYearChange(displayYear - 1)}
							/>
							<Text as="span" size={12}>
								{displayYear}
							</Text>
							<Button
								leftIcon={ArrowLineRightIcon}
								size="md"
								onClick={() => onYearChange(displayYear + 1)}
							/>
						</div>
					</div>

					<div className="p-4 min-h-[260px] flex flex-col justify-between items-end">
						<YearView
							current={now.getMonth()}
							selectedDate={currDate}
							displayYear={displayYear}
							dateLimits={dateLimits}
							onMonthSelect={(month) => {
								onMonthChange(month);
								onDateSelect(
									new Date(
										displayYear,
										month,
										currDate.getDate(),
										currDate.getHours(),
										currDate.getMinutes(),
									),
								);
							}}
						/>
						<Button
							leftIcon={ArrowLineLeftIcon}
							label="Back"
							className="text-black-40"
							onClick={() => onTypeChange("date")}
						/>
					</div>
				</div>
			);
		case "year":
			return (
				<div className="flex flex-col h-full">
					<div className="flex justify-between px-4 pt-4">
						<div className="flex gap-2 items-center">
							<Tag label="This year" onClick={() => onDateSelect(now)} />
							{lastSelection && (
								<Tag
									label="Last selection"
									onClick={() => onDateSelect(lastSelection)}
								/>
							)}
						</div>
						<div className="flex gap-2 items-center">
							<Button
								leftIcon={ArrowLineLeftIcon}
								size="md"
								onClick={() => onYearChange(displayYear - 25)}
							/>
							<Button
								leftIcon={ArrowLineRightIcon}
								size="md"
								onClick={() => onYearChange(displayYear + 25)}
							/>
						</div>
					</div>

					<div className="p-4 min-h-[260px] flex flex-col justify-between items-end">
						<QuarterView
							current={now.getFullYear()}
							displayYear={displayYear}
							selected={currDate.getFullYear()}
							dateLimits={dateLimits}
							onYearSelect={(year) => {
								onYearChange(year);
								onDateSelect(
									new Date(
										year,
										displayMonth,
										currDate.getDate(),
										currDate.getHours(),
										currDate.getMinutes(),
									),
								);
							}}
						/>
						<Button
							leftIcon={ArrowLineLeftIcon}
							label="Back"
							className="text-black-40 mt-auto"
							onClick={() => onTypeChange("month")}
						/>
					</div>
				</div>
			);
		case "hours" || "minutes":
			return (
				<div>
					<Text>Hours or minutes view</Text>
				</div>
			);
		default:
			return null;
	}
};
