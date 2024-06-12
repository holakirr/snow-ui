import { twMerge } from "tailwind-merge";
import { Tag, Text } from "../../components";
import type { DateTypeEnum } from "../../types";

type DateSelectorProps = {
	date: Date;
	changingType?: DateTypeEnum;
	isActive?: boolean;
	onItemClick: (type: DateTypeEnum) => void;
} & React.ComponentProps<"time">;

export const DateSelector = ({ date, changingType, isActive, onItemClick }: DateSelectorProps) => {
	const dateTime = new Intl.DateTimeFormat(["ban", "id"], {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);

	return (
		<Text
			as="time"
			dateTime={dateTime}
			className={twMerge("inline-flex items-center w-min", !isActive && "opacity-20")}
			size={14}
		>
			<Tag
				label={dateTime.split("/")[0]}
				textSize={14}
				className={twMerge(
					"py-0.5 px-1 bg-transparent",
					changingType === "date" && isActive && "bg-black-10",
				)}
				onClick={() => onItemClick("date")}
			/>
			<Text as="span" size={14} className="text-black-20">
				/
			</Text>
			<Tag
				label={dateTime.split("/")[1]}
				textSize={14}
				className={twMerge(
					"py-0.5 px-1 bg-transparent",
					changingType === "month" && isActive && "bg-black-10",
				)}
				onClick={() => onItemClick("month")}
			/>
			<Text as="span" size={14} className="text-black-20">
				/
			</Text>
			<Tag
				label={dateTime.split("/")[2]}
				textSize={14}
				className={twMerge(
					"py-0.5 px-1 bg-transparent",
					changingType === "year" && isActive && "bg-black-10",
				)}
				onClick={() => onItemClick("year")}
			/>
		</Text>
	);
};
