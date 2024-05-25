import {
	ArrowLineLeftIcon,
	ArrowLineRightIcon,
	Button,
	Text,
} from "@components";
import { twMerge } from "tailwind-merge";
import { DatePickerTag } from "./DatePickerTag";

type MonthProps = {
	current: Date;
	selected: Date;
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
	selected,
	displayMonth,
	displayYear,
	startOfWeek,
	dateLimits,
	lastSelection,
	onDateSelect,
	onMonthChange,
}: MonthProps) => {
	const currDayValue = new Date(current).setHours(0, 0, 0, 0);
	const selectedDayValue = new Date(selected).setHours(0, 0, 0, 0);
	const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
	const daysToAddBefore = (7 + firstDayOfMonth - startOfWeek) % 7;
	const daysToAddAfter = (7 - ((daysInMonth + daysToAddBefore) % 7)) % 7;
	const totalDaysToRender = daysInMonth + daysToAddBefore + daysToAddAfter;

	const weekDays = Array.from({ length: 7 }, (_, i) =>
		Intl.DateTimeFormat("en-US", {
			weekday: "short",
		})
			.format(new Date(0, 0, i + startOfWeek))
			.slice(0, 2),
	);
	const days = Array.from(
		{
			length: totalDaysToRender,
		},
		(_, i) => {
			const day = new Date(displayYear, displayMonth, i - daysToAddBefore + 1);
			const dayValue = day.valueOf();
			const dateTime = day.toDateString();
			const isToday = currDayValue === dayValue;
			const isSelected = selectedDayValue === dayValue;
			const isDisabled =
				dateLimits &&
				(dayValue < dateLimits[0].valueOf() ||
					dayValue > dateLimits[1].valueOf());
			const isOutOfMonth =
				day.getMonth() !== displayMonth || day.getFullYear() !== displayYear;
			return {
				day,
				dateTime,
				isToday,
				isSelected,
				isDisabled,
				isOutOfMonth,
			};
		},
	);

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<DatePickerTag label="Today" onClick={() => onDateSelect(current)} />
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
						{Intl.DateTimeFormat("en-US", { month: "short" }).format(
							new Date(displayYear, displayMonth),
						)}
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
					{days.map(
						({
							day,
							dateTime,
							isToday,
							isSelected,
							isDisabled,
							isOutOfMonth,
						}) => (
							<Button
								key={dateTime}
								tabIndex={0}
								label={day.getDate()}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								title={dateTime}
								aria-label={dateTime}
								disabled={isDisabled}
								className={twMerge(
									"rounded-xl hover:bg-black-5 hover:text-black-100",
									isToday && !isSelected && "bg-secondary-purple",
									isOutOfMonth && "opacity-40",
									isSelected && "rounded-xl",
								)}
								onClick={() => onDateSelect(day)}
							/>
						),
					)}
				</div>
			</div>
		</div>
	);
};
