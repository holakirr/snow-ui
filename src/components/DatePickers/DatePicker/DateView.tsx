import { Button } from "../../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../../Icons";
import { Text } from "../../Text";
import { DatePickerTag } from "./DatePickerTag";
import { DayContent } from "./DayContent";

type MonthProps = {
	current: Date;
	date: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	lastSelection?: Date;
	dateLimits?: [Date, Date];
	onDateSelect: (day: Date) => void;
	onMonthChange: (month: number) => void;
};

export const DateView = ({
	current,
	date,
	displayMonth,
	displayYear,
	startOfWeek,
	dateLimits,
	lastSelection,
	onDateSelect,
	onMonthChange,
}: MonthProps) => {
	const hour = date.getHours();
	const minute = date.getMinutes();
	const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
	const firstDay = new Date(displayYear, displayMonth, 1).getDay();
	const lastDay = new Date(displayYear, displayMonth, daysInMonth).getDay();

	const weekDays = Array.from({ length: 7 }, (_, i) =>
		Intl.DateTimeFormat("en-US", {
			weekday: "short",
		})
			.format(new Date(0, 0, i + startOfWeek))
			.slice(0, 2),
	);
	const prevDays = Array.from(
		{ length: (7 + firstDay - startOfWeek) % 7 },
		(_, i) => new Date(displayYear, displayMonth, -i, hour, minute),
	).reverse();
	const currDays = Array.from(
		{ length: daysInMonth },
		(_, i) => new Date(displayYear, displayMonth, i + 1, hour, minute),
	);
	const nextDays = Array.from(
		{ length: (6 - lastDay + startOfWeek) % 7 },
		(_, i) => new Date(displayYear, displayMonth + 1, i + 1, hour, minute),
	);

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<DatePickerTag
						label="Today"
						onClick={() => onDateSelect(new Date())}
					/>
					{lastSelection && (
						<DatePickerTag
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
				<div className="grid grid-cols-7 auto-rows-[38px]">
					{weekDays.map((weekDay) => (
						<Text
							key={weekDay}
							as="span"
							className="px-4 py-2 text-black-40 text-center"
							size={12}
						>
							{weekDay}
						</Text>
					))}
					{prevDays.map((day) => (
						<DayContent
							current={current}
							key={day.toDateString()}
							day={day}
							isDisabled={
								dateLimits &&
								(day.valueOf() < dateLimits[0].valueOf() ||
									day.valueOf() > dateLimits[1].valueOf())
							}
							date={date}
							isOutOfMonth
							onClick={() => onMonthChange(displayMonth - 1)}
						/>
					))}
					{currDays.map((day) => (
						<DayContent
							current={current}
							key={day.toDateString()}
							day={day}
							date={date}
							isDisabled={
								dateLimits &&
								(day.valueOf() < dateLimits[0].valueOf() ||
									day.valueOf() > dateLimits[1].valueOf())
							}
							onClick={onDateSelect}
						/>
					))}
					{nextDays.map((day) => (
						<DayContent
							current={current}
							key={day.toDateString()}
							day={day}
							date={date}
							isDisabled={
								dateLimits &&
								(day.valueOf() < dateLimits[0].valueOf() ||
									day.valueOf() > dateLimits[1].valueOf())
							}
							isOutOfMonth
							onClick={() => onMonthChange(displayMonth + 1)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
