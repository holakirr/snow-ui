import { twMerge } from "tailwind-merge";
import { Button } from "../../Button";

type DayContentProps = {
	current: Date;
	day: Date;
	date: Date;
	isDisabled?: boolean;
	isOutOfMonth?: boolean;
	onClick: (day: Date) => void;
};

export const DayContent = ({
	current,
	day,
	date,
	isDisabled,
	isOutOfMonth,
	onClick,
}: DayContentProps) => {
	const dateTime = day.toDateString();
	const isToday =
		new Date(
			current.getFullYear(),
			current.getMonth(),
			current.getDate(),
		).valueOf() ===
		new Date(day.getFullYear(), day.getMonth(), day.getDate()).valueOf();
	const selected = day.toDateString() === date.toDateString();

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
				selected && "rounded-xl",
			)}
		/>
	);
};
