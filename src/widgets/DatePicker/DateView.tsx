import { twMerge } from "tailwind-merge";
import {
	Abbr,
	ArrowLineLeftIcon,
	ArrowLineRightIcon,
	Button,
	DatePickerTag,
} from "../../components";
import { ROLES, TEXT_SIZES } from "../../constants";
import type { DateLimitsType } from "../../types";

type DateViewProps = {
	current: Date;
	selected: Date;
	displayMonth: number;
	displayYear: number;
	startOfWeek: number;
	dateLimits: DateLimitsType;
	lastSelection?: Date;
	onDateSelect: (day: Date) => void;
	onDisplayMonthChange: (month: number) => void;
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
	onDisplayMonthChange,
}: DateViewProps) => {
	const currDayValue = new Date(current).setHours(0, 0, 0, 0);
	const selectedDayValue = new Date(selected).setHours(0, 0, 0, 0);
	const displayDate = new Date(displayYear, displayMonth);
	const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
	const firstDayOfMonth = displayDate.getDay();
	const daysToAddBefore = (7 + firstDayOfMonth - startOfWeek) % 7;
	const daysToAddAfter = (7 - ((daysInMonth + daysToAddBefore) % 7)) % 7;
	const [minLimit, maxLimit] = dateLimits;

	const weekDays = Array.from({ length: 7 }, (_, i) =>
		Intl.DateTimeFormat("en-US", {
			weekday: "long",
		}).format(new Date(0, 0, i + startOfWeek)),
	);
	const days = Array.from(
		{
			length: daysInMonth + daysToAddBefore + daysToAddAfter,
		},
		(_, i) => {
			const day = new Date(displayYear, displayMonth, i - daysToAddBefore + 1);
			const dayValue = day.valueOf();
			const dateTime = day.toDateString();
			const isToday = currDayValue === dayValue;
			const isSelected = selectedDayValue === dayValue;
			const isDisabled = Boolean((minLimit && day < minLimit) || (maxLimit && day > maxLimit));
			const isOutOfMonth = day.getMonth() !== displayMonth || day.getFullYear() !== displayYear;
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
		<div className="flex flex-col" role={ROLES.tabpanel} id="panel-date" aria-labelledby="tab-date">
			<div className="flex justify-between px-4 pt-4" role={ROLES.navigation}>
				<div className="flex gap-2 items-center">
					<DatePickerTag
						label="Today"
						title={current.toLocaleDateString("en-GB")}
						className="bg-black-5"
						onClick={() => onDateSelect(current)}
					/>
					{lastSelection && (
						<DatePickerTag
							label="Last selection"
							title={lastSelection.toLocaleDateString("en-GB")}
							className="bg-black-5"
							onClick={() => onDateSelect(lastSelection)}
						/>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						title="Previous month"
						aria-label="Previous month"
						onClick={() => onDisplayMonthChange(displayMonth - 1)}
						className="p-1 rounded-lg"
					/>
					<Abbr
						tooltipProps={{
							label: `Display month is ${Intl.DateTimeFormat("en-US", { month: "long" }).format(
								displayDate,
							)}`,
							className: "text-nowrap",
						}}
						title={`Display month is ${Intl.DateTimeFormat("en-US", { month: "long" }).format(
							displayDate,
						)}`}
						size={TEXT_SIZES[12]}
						role={ROLES.status}
						className="flex items-center"
					>
						{Intl.DateTimeFormat("en-US", { month: "short" }).format(displayDate)}
					</Abbr>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						title="Next month"
						aria-label="Next month"
						onClick={() => onDisplayMonthChange(displayMonth + 1)}
						className="p-1"
					/>
				</div>
			</div>
			<div className="p-4 min-h-[260px]" role={ROLES.grid}>
				<div className="grid grid-cols-7 auto-rows-[38px]">
					{weekDays.map((weekDay) => (
						<Abbr
							key={weekDay}
							role={ROLES.columnheader}
							tooltipProps={{
								label: weekDay,
								position: "top",
								wrapperClassname: "flex items-center justify-center",
							}}
							title={weekDay}
							size={TEXT_SIZES[12]}
						>
							{weekDay.slice(0, 2)}
						</Abbr>
					))}
					{days.map(({ day, dateTime, isToday, isSelected, isDisabled, isOutOfMonth }) => (
						<Button
							key={dateTime}
							label={day.getDate()}
							textSize={TEXT_SIZES[12]}
							variant={isSelected ? "filled" : "borderless"}
							title={dateTime}
							aria-label={dateTime}
							aria-selected={isSelected}
							aria-current={isToday ? "date" : undefined}
							role={ROLES.cell}
							tabIndex={isDisabled ? -1 : 0}
							disabled={isDisabled}
							className={twMerge(
								"rounded-xl hover:bg-black-5 hover:text-black-100",
								isToday && !isSelected && "bg-secondary-purple",
								isOutOfMonth && "opacity-40",
								isSelected && "rounded-xl",
							)}
							onClick={() => {
								if (isOutOfMonth) {
									return onDisplayMonthChange(day.getMonth());
								}
								return onDateSelect(day);
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
