import { Tag, Text } from "@components";
import { twMerge } from "tailwind-merge";

type TimeSelectorProps = {
	date: Date;
	isActive: boolean;
	onClick: () => void;
};

export const TimeSelector = ({
	date,
	isActive,
	onClick,
}: TimeSelectorProps) => {
	const time = Intl.DateTimeFormat("en", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(date);

	return (
		<Text as="time" dateTime={time}>
			<Tag
				textSize={14}
				label={time}
				className={twMerge(
					"py-0.5 px-1 bg-transparent text-nowrap rounded-[4px]",
					isActive && "bg-black-10",
				)}
				onClick={onClick}
			/>
		</Text>
	);
};
