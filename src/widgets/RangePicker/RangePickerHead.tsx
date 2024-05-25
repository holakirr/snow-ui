import { Text } from "@components";
import type { DateTypeEnum } from "@types";
import { DateSelector } from "./DateSelector";
import { TimeSelector } from "./TimeSelector";

type DatePickerHeadProps = {
	date: Date;
	rangeEnd?: Date;
	changingType: DateTypeEnum;
	changingFromOrTo: "to" | "from";
	withTime?: boolean;
	onTypeChange: (type: DateTypeEnum) => void;
	onFromOrToChange?: (toOrFrom: "to" | "from") => void;
};

export const DatePickerHead = ({
	date,
	rangeEnd,
	changingType,
	changingFromOrTo,
	withTime,
	onTypeChange,
	onFromOrToChange,
}: DatePickerHeadProps) => (
	<div className="w-full flex gap-2 justify-between border-b border-black-10 p-4">
		<div className="flex gap-3 items-center">
			<DateSelector
				date={date}
				changingType={changingType}
				isActive={changingFromOrTo === "from"}
				onItemClick={(type) => {
					onFromOrToChange?.("from");
					onTypeChange(type);
				}}
			/>
			{rangeEnd && (
				<>
					<Text as="span" size={14} className="text-black-20">
						-
					</Text>
					<DateSelector
						date={rangeEnd}
						changingType={changingType}
						isActive={changingFromOrTo === "to"}
						onItemClick={(type) => {
							onFromOrToChange?.("to");
							onTypeChange(type);
						}}
					/>
				</>
			)}
		</div>
		{withTime && (
			<TimeSelector
				date={changingFromOrTo === "to" && rangeEnd ? rangeEnd : date}
				isActive={changingType === "hours" || changingType === "minutes"}
				onClick={() => onTypeChange("hours")}
			/>
		)}
	</div>
);
