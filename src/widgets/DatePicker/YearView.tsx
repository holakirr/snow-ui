import {
	Abbr,
	ArrowLineLeftIcon,
	ArrowLineRightIcon,
	Button,
	DatePickerTag,
} from "../../components";
import { ROLES, TEXT_SIZES } from "../../constants";
import type { DateLimitsType, DateTypeEnum } from "../../types";

type YearViewProps = {
	selected: Date;
	current: number;
	displayYear: number;
	dateLimits: DateLimitsType;
	lastSelection?: Date;
	onMonthSelect: (month: number) => void;
	onTypeChange: (type: DateTypeEnum) => void;
	onDisplayYearChange: (year: number) => void;
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
	onDisplayYearChange,
}: YearViewProps) => {
	const now = new Date();
	const [minLimit, maxLimit] = dateLimits.map(
		(date) => date && new Date(date.getFullYear(), date.getMonth()),
	);

	return (
		<div
			className="flex flex-col"
			role={ROLES.tabpanel}
			id="panel-month"
			aria-labelledby="tab-month"
		>
			<div className="flex justify-between px-4 pt-4" role={ROLES.navigation}>
				<div className="flex gap-2 items-center">
					<DatePickerTag
						label="This month"
						title={now.toLocaleDateString("en-GB")}
						className="bg-black-5"
						onClick={() => onDateSelect(now)}
					/>
					{lastSelection && (
						<DatePickerTag
							label="Last selection"
							title={lastSelection.toLocaleDateString("en-GB")}
							className="bg-black-5"
							onClick={() => onDateSelect(lastSelection)}
						/>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						title="Previous year"
						aria-label="Previous year"
						onClick={() => onDisplayYearChange(displayYear - 1)}
						className="p-1 rounded-lg"
					/>
					<Abbr
						tooltipProps={{
							label: `Display year is ${displayYear}`,
							className: "text-nowrap",
						}}
						title={`Display year is ${displayYear}`}
						size={TEXT_SIZES[12]}
						role={ROLES.status}
						className="flex items-center"
					>
						{displayYear}
					</Abbr>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						title="Next year"
						aria-label="Next year"
						onClick={() => onDisplayYearChange(displayYear + 1)}
						className="p-1 rounded-lg"
					/>
				</div>
			</div>
			<div className="p-4 min-h-[260px] flex flex-col justify-between items-end" role={ROLES.grid}>
				<div className="grid grid-cols-6 auto-rows-[38px] w-full">
					{Array.from({ length: 12 }, (_, i) => {
						const date = new Date(displayYear, i);
						const month = Intl.DateTimeFormat("en-US", {
							month: "short",
						}).format(date);
						const isDisabled = Boolean(
							(minLimit && date < minLimit) || (maxLimit && date > maxLimit),
						);
						const isSelected = selected.getFullYear() === displayYear && selected.getMonth() === i;
						const isCurrent = now.getFullYear() === displayYear && current === i;

						return (
							<Button
								key={month}
								label={month}
								textSize={TEXT_SIZES[12]}
								variant={isSelected ? "filled" : "borderless"}
								title={`Select ${month} ${displayYear}`}
								aria-label={`Select ${month} ${displayYear}`}
								aria-selected={isSelected}
								aria-current={isCurrent ? "date" : undefined}
								role={ROLES.cell}
								tabIndex={isDisabled ? -1 : 0}
								disabled={isDisabled}
								onClick={() => onMonthSelect(i)}
								className={isCurrent && !isSelected ? " bg-secondary-purple" : ""}
							/>
						);
					})}
				</div>
				<Button
					leftIcon={ArrowLineLeftIcon}
					label="Back"
					title="Back to day selection"
					aria-label="Back to day selection"
					className="text-black-40"
					onClick={() => onTypeChange("date")}
				/>
			</div>
		</div>
	);
};
