import { Button } from "../Button";

type QuarterViewProps = {
	displayYear: number;
	selected: number;
	current: number;
	dateLimits?: [Date, Date];
	onYearSelect: (year: number) => void;
};

export const QuarterView = ({
	displayYear,
	selected,
	current,
	dateLimits,
	onYearSelect,
}: QuarterViewProps) => {
	const yearLimits = dateLimits
		? dateLimits.map((date) => date.getFullYear())
		: [];

	return (
		<div className="grid grid-cols-5 w-full auto-rows-[38px]">
			{Array.from({ length: 25 }, (_, i) => {
				const year = displayYear - 12 + i;
				const isDisabled =
					yearLimits.length === 2 &&
					(year < yearLimits[0] || year > yearLimits[1]);
				return (
					<Button
						key={year}
						label={year}
						variant={year === selected ? "filled" : "borderless"}
						onClick={() => onYearSelect(year)}
						disabled={isDisabled}
						textSize={12}
						className={
							year === current && year !== selected ? "bg-secondary-purple" : ""
						}
					/>
				);
			})}
		</div>
	);
};
