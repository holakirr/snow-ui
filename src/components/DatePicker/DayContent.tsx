import { twMerge } from "tailwind-merge";
import { Button } from "../Button";

type DayContentProps = {
	day: Date;
	date: Date;
	rangeEnd?: Date;
	isDisabled?: boolean;
	isOutOfMonth?: boolean;
	onClick: (day: Date) => void;
};

export const DayContent = ({
	day,
	date,
	rangeEnd,
	isDisabled,
	isOutOfMonth,
	onClick,
}: DayContentProps) => {
	const dateTime = day.toDateString();
	const isToday = new Date().toDateString() === dateTime;
	const inRange = rangeEnd && day > date && day < rangeEnd;
	const isRangeStart = day.toDateString() === date.toDateString();
	const isRangeEnd = rangeEnd
		? day.toDateString() === rangeEnd.toDateString()
		: day.toDateString() === date.toDateString();
	const selected = inRange || isRangeStart || isRangeEnd;

	return (
		<Button
			onClick={() => onClick(day)}
			tabIndex={0}
			label={day.getDate()}
			textSize={12}
			variant={selected ? "filled" : "borderless"}
			title={dateTime}
			aria-label={dateTime}
			disabled={isDisabled}
			className={twMerge(
				"rounded-xl hover:bg-black-5 hover:text-black-100",
				isToday && !selected && "bg-secondary-purple",
				isOutOfMonth && "opacity-40",
				selected && "rounded-none",
				isRangeStart && "rounded-l-xl",
				isRangeEnd && "rounded-r-xl",
			)}
		/>
	);
};
