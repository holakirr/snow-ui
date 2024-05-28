import { ArrowLineLeftIcon, Button, Text } from "@components";
import { ROLES } from "@constants";
import type { DateTypeEnum } from "@types";
import { twMerge } from "tailwind-merge";
import { DatePickerTag } from "./DatePickerTag";
import { TimeInput } from "./TimeInput";

type TimeViewProps = {
	current: Date;
	selected: Date;
	changingType: DateTypeEnum;
	dateLimits?: [Date, Date];
	lastSelection?: Date;
	onDateSelect: (day: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const TimeView = ({
	current,
	selected,
	changingType,
	dateLimits,
	lastSelection,
	onDateSelect,
	onTypeChange,
}: TimeViewProps) => {
	const minutes = Array.from({ length: 60 }, (_, i) => {
		const timeStamp = new Date(
			selected.getFullYear(),
			selected.getMonth(),
			selected.getDate(),
			selected.getHours(),
			i + 1,
		);
		const minuteValue = timeStamp.valueOf();

		return {
			minute: timeStamp,
			dateTime: i + 1 < 10 ? `0${i + 1}` : i + 1,
			isSelected: i + 1 === selected.getMinutes(),
			isDisabled: dateLimits
				? minuteValue < dateLimits[0].valueOf() || minuteValue > dateLimits[1].valueOf()
				: false,
		};
	});
	const hours = Array.from({ length: 12 }, (_, i) => {
		const timeStamp = new Date(
			selected.getFullYear(),
			selected.getMonth(),
			selected.getDate(),
			selected.getHours() > 12 ? i + 13 : i + 1,
			selected.getMinutes(),
		);
		const hourValue = timeStamp.valueOf();
		const dateTime = Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(timeStamp);
		return {
			hour: timeStamp,
			dateTime,
			isSelected: timeStamp.getHours() === selected.getHours(),
			isDisabled: dateLimits
				? hourValue < dateLimits[0].valueOf() || hourValue > dateLimits[1].valueOf()
				: false,
		};
	});
	return (
		<div
			className="flex flex-col h-full"
			role={ROLES.datepickerBody}
			id="panel-time"
			aria-labelledby="tab-time"
		>
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<DatePickerTag
						className="bg-black-5"
						label="System time"
						onClick={() => onDateSelect(current)}
					/>
					{lastSelection && (
						<DatePickerTag
							className="bg-black-5"
							label="Last selection"
							onClick={() => onDateSelect(lastSelection)}
						/>
					)}
				</div>
			</div>
			<div className="grid grid-cols-5 pt-4 px-4 gap-2">
				<TimeInput
					value={Number(
						Intl.DateTimeFormat("en-US", {
							hour: "2-digit",
							hour12: true,
						})
							.format(selected)
							.split(" ")[0],
					)}
					changingType={changingType}
					onChange={(e) => onDateSelect(new Date(selected.setHours(+e.target.value)))}
					onFocus={() => onTypeChange("hours")}
				/>
				<Text size={12} className="flex items-center justify-center">
					:
				</Text>
				<TimeInput
					value={selected.getMinutes()}
					changingType={changingType}
					onChange={(e) => onDateSelect(new Date(selected.setMinutes(+e.target.value)))}
					onFocus={() => onTypeChange("minutes")}
				/>
				<Button
					label="AM"
					textSize={12}
					className={twMerge("rounded-xl", selected.getHours() < 12 && "bg-secondary-purple")}
					onClick={() => {
						if (selected.getHours() < 12) return;
						const newDate = new Date(selected);
						newDate.setHours(selected.getHours() - 12);
						onDateSelect(newDate);
					}}
				/>
				<Button
					label="PM"
					textSize={12}
					className={twMerge("rounded-xl", selected.getHours() >= 12 && "bg-secondary-purple")}
					onClick={() => {
						if (selected.getHours() >= 12) return;
						const newDate = new Date(selected);
						newDate.setHours(selected.getHours() + 12);
						onDateSelect(newDate);
					}}
				/>
			</div>
			<div className="p-4 pt-0 min-h-[180px] flex flex-col justify-between items-end">
				{changingType === "hours" && (
					<div className="grid grid-cols-6 auto-rows-[38px] w-full">
						{hours.map(({ hour, dateTime, isSelected, isDisabled }) => (
							<Button
								key={dateTime}
								tabIndex={0}
								label={
									Intl.DateTimeFormat("en-US", {
										hour: "2-digit",
										hour12: true,
									})
										.format(hour)
										.split(" ")[0]
								}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								title={`${hour.getHours()} hours`}
								aria-label={dateTime}
								disabled={isDisabled}
								className={twMerge(
									"rounded-xl hover:bg-black-5 hover:text-black-100",
									isSelected && "rounded-xl",
								)}
								onClick={() => onDateSelect(hour)}
							/>
						))}
					</div>
				)}
				{changingType === "minutes" && (
					<div className="grid grid-cols-6 auto-rows-[38px] w-full max-h-[152px] overflow-scroll">
						{minutes.map(({ minute, dateTime, isSelected, isDisabled }) => (
							<Button
								key={dateTime}
								tabIndex={0}
								label={dateTime}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								title={`${minute.getMinutes()} minutes`}
								aria-label={`${minute.getMinutes()} minutes`}
								disabled={isDisabled}
								className={twMerge(
									"rounded-xl hover:bg-black-5 hover:text-black-100",
									isSelected && "rounded-xl",
								)}
								onClick={() => onDateSelect(minute)}
							/>
						))}
					</div>
				)}
				<Button
					leftIcon={ArrowLineLeftIcon}
					label="Back"
					className="text-black-40 mt-auto"
					onClick={() => onTypeChange(changingType === "minutes" ? "hours" : "year")}
				/>
			</div>
		</div>
	);
};
