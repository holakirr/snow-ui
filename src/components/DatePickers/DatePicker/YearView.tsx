import type { DateTypeEnum } from "@types";
import { Button } from "../../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../../Icons";
import { Text } from "../../Text";
import { DatePickerTag } from "./DatePickerTag";

type YearViewProps = {
	selected: Date;
	current: number;
	displayYear: number;
	dateLimits?: [Date, Date];
	lastSelection?: Date;
	onMonthSelect: (month: number) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onYearChange: (year: number) => void;
	onDateSelect: (date: Date) => void;
};

export const YearView = ({
	selected,
	current,
	displayYear,
	dateLimits,
	lastSelection,
	onMonthSelect,
	onTypeChange,
	onDateSelect,
	onYearChange,
}: YearViewProps) => {
	const limits =
		dateLimits?.map((date) => new Date(date.getFullYear(), date.getMonth())) ??
		[];
	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<DatePickerTag
						label="This month"
						onClick={() => onDateSelect(new Date())}
					/>
					{lastSelection && (
						<DatePickerTag
							label="Last selection"
							onClick={() => onDateSelect(lastSelection)}
						/>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						onClick={() => onYearChange(displayYear - 1)}
					/>
					<Text as="span" size={12}>
						{displayYear}
					</Text>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						onClick={() => onYearChange(displayYear + 1)}
					/>
				</div>
			</div>
			<div className="p-4 min-h-[260px] flex flex-col justify-between items-end">
				<div className="grid grid-cols-6 auto-rows-[38px] w-full">
					{Array.from({ length: 12 }, (_, i) => {
						const date = new Date(displayYear, i);
						const month = Intl.DateTimeFormat("en-US", {
							month: "short",
						}).format(date);
						const isDisabled =
							limits.length === 2 &&
							(date.valueOf() < limits[0].valueOf() ||
								date.valueOf() > limits[1].valueOf());
						const isSelected =
							selected.getFullYear() === displayYear &&
							selected.getMonth() === i;
						const isCurrent =
							new Date().getFullYear() === displayYear && current === i;

						return (
							<Button
								key={month}
								label={month}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								disabled={isDisabled}
								onClick={() => onMonthSelect(i)}
								className={
									isCurrent && !isSelected ? " bg-secondary-purple" : ""
								}
							/>
						);
					})}
				</div>
				<Button
					leftIcon={ArrowLineLeftIcon}
					label="Back"
					className="text-black-40"
					onClick={() => onTypeChange("date")}
				/>
			</div>
		</div>
	);
};
