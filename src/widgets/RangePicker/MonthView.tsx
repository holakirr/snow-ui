import { Text } from "@components";
import { DayContent } from "./DayContent";

type MonthProps = {
	date: Date;
	rangeEnd?: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	dateLimits?: [Date, Date];
	onDateSelect: (day: Date) => void;
	onDisplayMonthChange: (month: number) => void;
};

export const DateView = ({
	date,
	rangeEnd,
	displayMonth,
	displayYear,
	startOfWeek = 0,
	dateLimits,
	onDateSelect,
	onDisplayMonthChange,
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
		<div className="grid grid-cols-7 auto-rows-[38px]">
			{weekDays.map((weekDay) => (
				<Text key={weekDay} as="span" className="px-4 py-2 text-black-40 text-center" size={12}>
					{weekDay}
				</Text>
			))}
			{prevDays.map((day) => (
				<DayContent
					key={day.toDateString()}
					day={day}
					isDisabled={
						dateLimits &&
						(day.valueOf() < dateLimits[0].valueOf() || day.valueOf() > dateLimits[1].valueOf())
					}
					rangeEnd={rangeEnd}
					date={date}
					isOutOfMonth
					onClick={() => onDisplayMonthChange(displayMonth - 1)}
				/>
			))}
			{currDays.map((day) => (
				<DayContent
					key={day.toDateString()}
					day={day}
					date={date}
					rangeEnd={rangeEnd}
					isDisabled={
						dateLimits &&
						(day.valueOf() < dateLimits[0].valueOf() || day.valueOf() > dateLimits[1].valueOf())
					}
					onClick={onDateSelect}
				/>
			))}
			{nextDays.map((day) => (
				<DayContent
					key={day.toDateString()}
					day={day}
					date={date}
					rangeEnd={rangeEnd}
					isDisabled={
						dateLimits &&
						(day.valueOf() < dateLimits[0].valueOf() || day.valueOf() > dateLimits[1].valueOf())
					}
					isOutOfMonth
					onClick={() => onDisplayMonthChange(displayMonth + 1)}
				/>
			))}
		</div>
	);
};
