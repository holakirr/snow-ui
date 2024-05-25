import { twMerge } from "tailwind-merge";
import { Button } from "../../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../../Icons";
import { Text } from "../../Text";
import { DatePickerTag } from "./DatePickerTag";

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
	const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();
	const lastDayOfWeek = new Date(
		displayYear,
		displayMonth,
		daysInMonth,
	).getDay();
	const currentDay = new Date(
		current.getFullYear(),
		current.getMonth(),
		current.getDate(),
	);

	const weekDays = Array.from({ length: 7 }, (_, i) =>
		Intl.DateTimeFormat("en-US", {
			weekday: "short",
		})
			.format(new Date(0, 0, i + startOfWeek))
			.slice(0, 2),
	);
	const days = Array.from(
		{ length: daysInMonth + firstDayOfWeek + (7 - lastDayOfWeek - 1) },
		(_, i) => {
			const day = i - firstDayOfWeek + 1 + startOfWeek;
			return new Date(displayYear, displayMonth, day);
		},
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
					{days.map((day) => {
						const isToday = currentDay.valueOf() === day.valueOf();
						const isSelected =
							new Date(
								date.getFullYear(),
								date.getMonth(),
								date.getDate(),
							).valueOf() === day.valueOf();
						const isOutOfMonth =
							day.getMonth() !== displayMonth ||
							day.getFullYear() !== displayYear;
						const dateTime = day.toDateString();
						return (
							<Button
								key={day.toDateString()}
								tabIndex={0}
								label={day.getDate()}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								title={dateTime}
								aria-label={dateTime}
								disabled={
									dateLimits &&
									(day.valueOf() < dateLimits[0].valueOf() ||
										day.valueOf() > dateLimits[1].valueOf())
								}
								className={twMerge(
									"rounded-xl hover:bg-black-5 hover:text-black-100",
									isToday && !isSelected && "bg-secondary-purple",
									isOutOfMonth && "opacity-40",
									isSelected && "rounded-xl",
								)}
								onClick={() =>
									onDateSelect(
										new Date(
											displayYear,
											displayMonth,
											day.getDate(),
											hour,
											minute,
										),
									)
								}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};
