import { Button } from "../Button";

type YearViewProps = {
	selectedDate: Date;
	current: number;
	displayYear: number;
	dateLimits?: [Date, Date];
	onMonthSelect: (month: number) => void;
};

export const YearView = ({
	selectedDate,
	current,
	displayYear,
	dateLimits,
	onMonthSelect,
}: YearViewProps) => {
	const limits =
		dateLimits?.map((date) => new Date(date.getFullYear(), date.getMonth())) ??
		[];
	return (
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
					selectedDate.getFullYear() === displayYear &&
					selectedDate.getMonth() === i;

				return (
					<Button
						key={month}
						label={month}
						textSize={12}
						variant={isSelected ? "filled" : "borderless"}
						disabled={isDisabled}
						onClick={() => onMonthSelect(i)}
						className={
							i === current && isSelected ? " bg-secondary-purple" : ""
						}
					/>
				);
			})}
		</div>
	);
};
