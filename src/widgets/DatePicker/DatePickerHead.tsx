import { Text } from "../../components";
import { DatePickerTag } from "../../components/Tag/DatePickerTag";
import { ROLES, TEXT_SIZES } from "../../constants";
import type { DateTypeEnum } from "../../types";

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
		<div className="w-full flex justify-between border-b border-black-10 p-4" role={ROLES.tablist}>
			<Text
				as="time"
				title={`Selected date is ${withTime ? dateTime : dateString}`}
				dateTime={withTime ? dateTime : dateString}
				className={"inline-flex items-center w-min"}
				size={TEXT_SIZES[14]}
			>
				<DatePickerTag
					id="tab-date"
					aria-controls="panel-date"
					role={ROLES.tab}
					label={dateString.split("/")[0]}
					title={`Current day is ${dateString.split("/")[0]}`}
					textSize={TEXT_SIZES[14]}
					isActive={changingType === "date"}
					onClick={() => onTypeChange("date")}
				/>
				<Text as="span" size={TEXT_SIZES[14]} className="text-black-20">
					/
				</Text>
				<DatePickerTag
					id="tab-month"
					aria-controls="panel-month"
					role={ROLES.tab}
					label={dateString.split("/")[1]}
					title={`Current month is ${dateString.split("/")[1]}`}
					textSize={TEXT_SIZES[14]}
					isActive={changingType === "month"}
					onClick={() => onTypeChange("month")}
				/>
				<Text as="span" size={TEXT_SIZES[14]} className="text-black-20">
					/
				</Text>
				<DatePickerTag
					id="tab-year"
					aria-controls="panel-year"
					role={ROLES.tab}
					label={dateString.split("/")[2]}
					title={`Current year is ${dateString.split("/")[2]}`}
					textSize={TEXT_SIZES[14]}
					isActive={changingType === "year"}
					onClick={() => onTypeChange("year")}
				/>
			</Text>
			{withTime && (
				<Text as="time" dateTime={timeString}>
					<DatePickerTag
						id="tab-time"
						aria-controls="panel-time"
						role={ROLES.tab}
						title={`Current time is ${timeString}`}
						textSize={TEXT_SIZES[14]}
						label={timeString}
						isActive={["hours", "minutes"].includes(changingType)}
						onClick={() => onTypeChange("hours")}
					/>
				</Text>
			)}
		</div>
	);
};
