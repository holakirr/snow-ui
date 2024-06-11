import { Button } from "@components";
import { twMerge } from "tailwind-merge";

type DayContentProps = {
	day: Date;
	isInRange: boolean;
	isRangeStart: boolean;
	isRangeEnd: boolean;
	isDisabled?: boolean;
	isOutOfMonth?: boolean;
	onClick: (day: Date) => void;
};

export const DayContent = ({
	day,
	isInRange,
	isRangeStart,
	isRangeEnd,
	isDisabled,
	isOutOfMonth,
	onClick,
}: DayContentProps) => {
	const dateTime = day.toDateString();
	const isToday = new Date().toDateString() === dateTime;

	return (
		<Button
			onClick={() => onClick(day)}
			tabIndex={0}
			label={day.getDate()}
			textSize={12}
			variant={isInRange ? "filled" : "borderless"}
			title={dateTime}
			aria-label={dateTime}
			disabled={isDisabled}
			className={twMerge(
				"rounded-xl hover:bg-black-5 hover:text-black-100",
				isToday && !isInRange && "bg-secondary-purple",
				isOutOfMonth && "opacity-40",
				isInRange && "rounded-none",
				isRangeStart && "rounded-l-xl",
				isRangeEnd && "rounded-r-xl",
			)}
		/>
	);
};
