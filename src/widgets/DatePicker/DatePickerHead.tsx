import { Text } from "@components";
import type { DateTypeEnum } from "@types";
import { twMerge } from "tailwind-merge";
import { DatePickerTag } from "./DatePickerTag";

type DatePickerHeadProps = {
	date: Date;
	changingType: DateTypeEnum;
	withTime?: boolean;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const DatePickerHead = ({
	date,
	changingType,
	withTime,
	onTypeChange,
}: DatePickerHeadProps) => {
	const dateString = date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	const timeString = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
	const dateTime = `${dateString}T${timeString}`;

	return (
		<div className="w-full flex justify-between border-b border-black-10 p-4">
			<Text
				as="time"
				dateTime={dateTime}
				className={"inline-flex items-center w-min"}
				size={14}
			>
				<DatePickerTag
					label={dateString.split("/")[0]}
					textSize={14}
					className={twMerge(
						"py-0.5 px-1 bg-transparent",
						changingType === "date" && "bg-black-10",
					)}
					onClick={() => onTypeChange("date")}
				/>
				<Text as="span" size={14} className="text-black-20">
					/
				</Text>
				<DatePickerTag
					label={dateString.split("/")[1]}
					textSize={14}
					className={twMerge(
						"py-0.5 px-1 bg-transparent",
						changingType === "month" && "bg-black-10",
					)}
					onClick={() => onTypeChange("month")}
				/>
				<Text as="span" size={14} className="text-black-20">
					/
				</Text>
				<DatePickerTag
					label={dateString.split("/")[2]}
					textSize={14}
					className={twMerge(
						"py-0.5 px-1 bg-transparent",
						changingType === "year" && "bg-black-10",
					)}
					onClick={() => onTypeChange("year")}
				/>
			</Text>
			{withTime && (
				<Text as="time" dateTime={timeString}>
					<DatePickerTag
						textSize={14}
						label={timeString}
						className={twMerge(
							"py-0.5 px-1 bg-transparent text-nowrap rounded-[4px]",
							["hours", "minutes"].includes(changingType) && "bg-black-10",
						)}
						onClick={() => onTypeChange("hours")}
					/>
				</Text>
			)}
		</div>
	);
};
