import { ArrowLineLeftIcon, ArrowLineRightIcon, Button, DatePickerTag } from "../../components";
import { ROLES } from "../../constants";
import type { DateLimitsType, DateTypeEnum } from "../../types";

type QuarterViewProps = {
	displayYear: number;
	selected: number;
	current: number;
	dateLimits: DateLimitsType;
	lastSelection?: Date;
	onYearSelect: (year: number) => void;
	onDisplayYearChange: (year: number) => void;
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
	onTypeChange,
}: QuarterViewProps) => {
	const now = new Date();
	const [minLimit, maxLimit] = dateLimits.map((date) => (date ? date.getFullYear() : undefined));

	return (
		<div className="flex flex-col" role={ROLES.tabpanel} id="panel-year" aria-labelledby="tab-year">
			<div className="flex justify-between px-4 pt-4" role={ROLES.navigation}>
				<div className="flex gap-2 items-center">
					<DatePickerTag
						label="This year"
						title={now.toLocaleDateString("en-GB", { year: "numeric" })}
						className="bg-black-5"
						onClick={() => onYearSelect(now.getFullYear())}
					/>
					{lastSelection && (
						<DatePickerTag
							label="Last selection"
							title={lastSelection.toLocaleDateString("en-GB")}
							className="bg-black-5"
							onClick={() => onYearSelect(lastSelection.getFullYear())}
						/>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						title="Previous quarter"
						aria-label="Previous quarter"
						onClick={() => onDisplayYearChange(displayYear - 25)}
						className="p-1 rounded-lg"
					/>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						title="Next quarter"
						aria-label="Next quarter"
						onClick={() => onDisplayYearChange(displayYear + 25)}
						className="p-1 rounded-lg"
					/>
				</div>
			</div>
			<div className="p-4 min-h-[260px] flex flex-col justify-between items-end" role={ROLES.grid}>
				<div className="grid grid-cols-5 w-full auto-rows-[38px]">
					{Array.from({ length: 25 }, (_, i) => {
						const year = displayYear - 12 + i;
						const isSelected = year === selected;
						const isCurrent = year === current;
						const isDisabled = Boolean(
							(minLimit && year < minLimit) || (maxLimit && year > maxLimit),
						);
						return (
							<Button
								key={year}
								label={year}
								textSize={12}
								variant={isSelected ? "filled" : "borderless"}
								title={year.toString()}
								aria-label={year.toString()}
								aria-selected={isSelected}
								aria-current={isCurrent ? "date" : undefined}
								role={ROLES.cell}
								tabIndex={isDisabled ? -1 : 0}
								disabled={isDisabled}
								className={isCurrent && !isSelected ? "bg-secondary-purple" : ""}
								onClick={() => onYearSelect(year)}
							/>
						);
					})}
				</div>
				<Button
					leftIcon={ArrowLineLeftIcon}
					label="Back"
					title="Back to month selection"
					aria-label="Back to month selection"
					className="text-black-40 mt-auto"
					onClick={() => onTypeChange("month")}
				/>
			</div>
		</div>
	);
};
