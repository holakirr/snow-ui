import { ArrowLineLeftIcon, ArrowLineRightIcon, Button } from "@components";
import type { DateTypeEnum } from "@types";
import { DatePickerTag } from "./DatePickerTag";

type QuarterViewProps = {
	displayYear: number;
	selected: number;
	current: number;
	dateLimits?: [Date, Date];
	lastSelection?: Date;
	onYearSelect: (year: number) => void;
	onDisplayYearChange: (year: number) => void;
	onDateSelect: (date: Date) => void;
	onTypeChange: (type: DateTypeEnum) => void;
};

export const QuarterView = ({
	displayYear,
	selected,
	current,
	dateLimits,
	lastSelection,
	onYearSelect,
	onDisplayYearChange,
	onDateSelect,
	onTypeChange,
}: QuarterViewProps) => {
	const yearLimits = dateLimits ? dateLimits.map((date) => date.getFullYear()) : [];

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<DatePickerTag label="This year" onClick={() => onDateSelect(new Date())} />
					{lastSelection && (
						<DatePickerTag label="Last selection" onClick={() => onDateSelect(lastSelection)} />
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						onClick={() => onDisplayYearChange(displayYear - 25)}
					/>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						onClick={() => onDisplayYearChange(displayYear + 25)}
					/>
				</div>
			</div>
			<div className="p-4 min-h-[260px] flex flex-col justify-between items-end">
				<div className="grid grid-cols-5 w-full auto-rows-[38px]">
					{Array.from({ length: 25 }, (_, i) => {
						const year = displayYear - 12 + i;
						const isDisabled =
							yearLimits.length === 2 && (year < yearLimits[0] || year > yearLimits[1]);
						return (
							<Button
								key={year}
								label={year}
								variant={year === selected ? "filled" : "borderless"}
								onClick={() => onYearSelect(year)}
								disabled={isDisabled}
								textSize={12}
								className={year === current && year !== selected ? "bg-secondary-purple" : ""}
							/>
						);
					})}
				</div>
				<Button
					leftIcon={ArrowLineLeftIcon}
					label="Back"
					className="text-black-40 mt-auto"
					onClick={() => onTypeChange("month")}
				/>
			</div>
		</div>
	);
};
