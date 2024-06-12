import { DatePickerTag, Text } from "../../components";
import { ROLES } from "../../constants";
import type { DateTypeEnum } from "../../types";

type RangePickerHeadProps = {
	from: Date;
	to: Date;
	changingType: DateTypeEnum;
	changingFromOrTo: "from" | "to";
	withTime?: boolean;
	onTypeChange: (type: DateTypeEnum) => void;
	onFromOrToChange: (toOrFrom: "from" | "to") => void;
};

export const RangePickerHead = ({
	from,
	to,
	changingType,
	changingFromOrTo,
	withTime,
	onTypeChange,
	onFromOrToChange,
}: RangePickerHeadProps) => {
	const fromStrings = {
		date: from.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}),
		time: from.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}),
	};
	const toStrings = {
		date: to.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}),
		time: to.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}),
	};
	const currentTimeString = changingFromOrTo === "from" ? fromStrings.time : toStrings.time;

	return (
		<div className="w-full flex gap-2 justify-between border-b border-black-10 p-4">
			<div className="flex gap-3 items-center">
				<Text
					as="time"
					title={`Range starts with ${
						withTime ? `${fromStrings.date}T${fromStrings.time}` : fromStrings.date
					}`}
					dateTime={withTime ? `${fromStrings.date}T${fromStrings.time}` : fromStrings.date}
					className={"inline-flex items-center w-min"}
					size={14}
				>
					<DatePickerTag
						id="tab-date"
						aria-controls="panel-date"
						role={ROLES.datepickerHeadTab}
						label={fromStrings.date.split("/")[0]}
						title={`Range starts with day ${fromStrings.date.split("/")[0]}`}
						textSize={14}
						isActive={
							["date", "hours", "minutes"].includes(changingType) && changingFromOrTo === "from"
						}
						onClick={() => {
							onFromOrToChange("from");
							onTypeChange("date");
						}}
					/>
					<Text as="span" size={14} className="text-black-20">
						/
					</Text>
					<DatePickerTag
						id="tab-month"
						aria-controls="panel-month"
						role={ROLES.datepickerHeadTab}
						label={fromStrings.date.split("/")[1]}
						title={`Range starts with month ${fromStrings.date.split("/")[1]}`}
						textSize={14}
						isActive={
							["month", "hours", "minutes"].includes(changingType) && changingFromOrTo === "from"
						}
						onClick={() => {
							onFromOrToChange("from");
							onTypeChange("month");
						}}
					/>
					<Text as="span" size={14} className="text-black-20">
						/
					</Text>
					<DatePickerTag
						id="tab-year"
						aria-controls="panel-year"
						role={ROLES.datepickerHeadTab}
						label={fromStrings.date.split("/")[2]}
						title={`Range starts with year ${fromStrings.date.split("/")[2]}`}
						textSize={14}
						isActive={
							["year", "hours", "minutes"].includes(changingType) && changingFromOrTo === "from"
						}
						onClick={() => {
							onFromOrToChange("from");
							onTypeChange("year");
						}}
					/>
				</Text>
				<Text as="span" size={14} className="text-black-20">
					-
				</Text>
				<Text
					as="time"
					title={`Selected date is ${
						withTime ? `${toStrings.date}T${toStrings.time}` : toStrings.date
					}`}
					dateTime={withTime ? `${toStrings.date}T${toStrings.time}` : toStrings.date}
					className={"inline-flex items-center w-min"}
					size={14}
				>
					<DatePickerTag
						id="tab-date"
						aria-controls="panel-date"
						role={ROLES.datepickerHeadTab}
						label={toStrings.date.split("/")[0]}
						title={`Range ends with day ${toStrings.date.split("/")[0]}`}
						textSize={14}
						isActive={
							["date", "hours", "minutes"].includes(changingType) && changingFromOrTo === "to"
						}
						onClick={() => {
							onFromOrToChange("to");
							onTypeChange("date");
						}}
					/>
					<Text as="span" size={14} className="text-black-20">
						/
					</Text>
					<DatePickerTag
						id="tab-month"
						aria-controls="panel-month"
						role={ROLES.datepickerHeadTab}
						label={toStrings.date.split("/")[1]}
						title={`Range ends with month ${toStrings.date.split("/")[1]}`}
						textSize={14}
						isActive={
							["month", "hours", "minutes"].includes(changingType) && changingFromOrTo === "to"
						}
						onClick={() => {
							onFromOrToChange("to");
							onTypeChange("month");
						}}
					/>
					<Text as="span" size={14} className="text-black-20">
						/
					</Text>
					<DatePickerTag
						id="tab-year"
						aria-controls="panel-year"
						role={ROLES.datepickerHeadTab}
						label={toStrings.date.split("/")[2]}
						title={`Range ends with year ${toStrings.date.split("/")[2]}`}
						textSize={14}
						isActive={
							["year", "hours", "minutes"].includes(changingType) && changingFromOrTo === "to"
						}
						onClick={() => {
							onFromOrToChange("to");
							onTypeChange("year");
						}}
					/>
				</Text>
			</div>
			{withTime && (
				<Text as="time" dateTime={currentTimeString}>
					<DatePickerTag
						id="tab-time"
						aria-controls="panel-time"
						role={ROLES.datepickerHeadTab}
						title={`Current time is ${currentTimeString}`}
						textSize={14}
						label={currentTimeString}
						isActive={["hours", "minutes"].includes(changingType)}
						onClick={() => onTypeChange("hours")}
					/>
				</Text>
			)}
		</div>
	);
};
