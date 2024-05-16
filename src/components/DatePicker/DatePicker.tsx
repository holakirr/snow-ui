import type { DatePickerChangeType } from "@types";
import dayjs, { type Dayjs } from "dayjs";
import { twMerge } from "tailwind-merge";
import { Button } from "../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../Icons";
import { Tag } from "../Tag";
import { Text } from "../Text";

type DatePickerProps = React.ComponentProps<"div"> & {
	dateTime: string;
	dateTimeTo?: string;
	changingType?: DatePickerChangeType;
	changingToOrFrom?: "to" | "from";
	withRange?: boolean;
	withTime?: boolean;
	lastSelection?: string;
	onSelectDate: (date: string) => string;
	onTypeChange: (type: DatePickerChangeType) => DatePickerChangeType;
	onToOrFromChange?: (toOrFrom: "to" | "from") => "to" | "from";
	onMonthChange: (month: number) => number;
};

const TypeTag = ({
	label,
	isChanging,
}: { label: string | number; isChanging?: boolean }) => (
	<Tag
		label={label}
		textSize={14}
		className={twMerge(
			"py-0.5 px-1 bg-transparent",
			isChanging && "bg-black-10",
		)}
	/>
);

const TH = ({ children }: { children: string }) => (
	<th className="px-4 py-2">
		<Text as="span" size={12} className="text-black-40">
			{children}
		</Text>
	</th>
);

const TD = ({
	selected,
	today,
	children,
}: { selected?: boolean; today?: boolean; children: string }) => (
	<td
		className={twMerge(
			"px-4 py-2 hover:bg-black-5 transition-all rounded-xl cursor-pointer text-black-100",
			selected && "text-white-100 bg-black-100",
			today && "bg-secondary-purple",
		)}
	>
		<Text as="span" size={12}>
			{children}
		</Text>
	</td>
);

const Body = () => (
	<div className="p-4">
		<table className="text-center">
			<thead>
				<tr>
					<TH>Su</TH>
					<TH>Mo</TH>
					<TH>Tu</TH>
					<TH>We</TH>
					<TH>Th</TH>
					<TH>Fr</TH>
					<TH>Sa</TH>
				</tr>
			</thead>
			<tbody>
				<tr>
					<TD>30</TD>
					<TD>31</TD>
					<TD>1</TD>
					<TD>2</TD>
					<TD>3</TD>
					<TD>4</TD>
					<TD>5</TD>
				</tr>
				<tr>
					<TD>6</TD>
					<TD>7</TD>
					<TD>8</TD>
					<TD>9</TD>
					<TD>10</TD>
					<TD>11</TD>
					<TD>12</TD>
				</tr>
				<tr>
					<TD>13</TD>
					<TD>14</TD>
					<TD>15</TD>
					<TD>16</TD>
					<TD>17</TD>
					<TD>18</TD>
					<TD>19</TD>
				</tr>
				<tr>
					<TD>20</TD>
					<TD>21</TD>
					<TD>22</TD>
					<TD>23</TD>
					<TD>24</TD>
					<TD>25</TD>
					<TD>26</TD>
				</tr>
				<tr>
					<TD>27</TD>
					<TD>28</TD>
					<TD>29</TD>
					<TD>30</TD>
					<TD>1</TD>
					<TD>2</TD>
					<TD>3</TD>
				</tr>
			</tbody>
		</table>
	</div>
);

const DateSelector = ({
	date,
	changingType,
	isActive,
}: {
	date: Dayjs;
	changingType?: DatePickerChangeType;
	isActive?: boolean;
}) => (
	<Text
		as="time"
		dateTime={date.format("DD/MM/YYYY")}
		className={twMerge(
			"inline-flex items-center w-min",
			!isActive && "opacity-20",
		)}
		size={14}
	>
		<TypeTag
			label={date.format("DD")}
			isChanging={changingType === "day" && isActive}
		/>
		<Text as="span" size={14} className="text-black-20">
			/
		</Text>
		<TypeTag
			label={date.format("MM")}
			isChanging={changingType === "month" && isActive}
		/>
		<Text as="span" size={14} className="text-black-20">
			/
		</Text>
		<TypeTag
			label={date.format("YYYY")}
			isChanging={changingType === "year" && isActive}
		/>
	</Text>
);

const TimeSelector = ({
	date,
	changingType,
}: {
	date: Dayjs;
	changingType?: DatePickerChangeType;
}) => (
	<Text
		as="time"
		dateTime={date.format("hh:mm A")}
		className="inline-flex items-center w-min"
		size={14}
	>
		<TypeTag label={date.format("hh")} isChanging={changingType === "hour"} />
		<Text as="span" size={14} className="text-black-20">
			:
		</Text>
		<TypeTag label={date.format("mm")} isChanging={changingType === "minute"} />
		<TypeTag label={date.format("A")} isChanging={changingType === "am/pm"} />
	</Text>
);

const DatePicker = ({
	className,
	dateTime,
	dateTimeTo,
	changingType,
	changingToOrFrom,
	withRange,
	withTime,
	lastSelection,
	onSelectDate,
	onTypeChange,
	onToOrFromChange,
	onMonthChange,
	...props
}: DatePickerProps) => {
	const date = dayjs(dateTime);

	return (
		<div
			className={twMerge(
				"w-[360px] rounded-2xl border-1 border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80 text-black-100",
				className,
			)}
			{...props}
		>
			<div className="w-full flex gap-2 justify-between border-b border-black-10 p-4">
				<div className="flex gap-3 items-center">
					<DateSelector
						date={date}
						changingType={changingType}
						isActive={changingToOrFrom === "from"}
					/>
					{withRange && (
						<>
							<Text as="span" size={14} className="text-black-20">
								-
							</Text>
							<DateSelector
								date={dayjs(dateTimeTo)}
								changingType={changingType}
								isActive={changingToOrFrom === "to"}
							/>
						</>
					)}
				</div>
				{withTime && <TimeSelector date={date} changingType={changingType} />}
			</div>
			<div className="flex justify-between px-4 pt-4">
				<div className="flex gap-2 items-center">
					<Tag label="Today" onClick={() => onSelectDate(dayjs().format())} />
					{lastSelection && (
						<Tag
							label="Last selection"
							onClick={() => onSelectDate(lastSelection)}
						/>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<Button
						leftIcon={ArrowLineLeftIcon}
						size="md"
						onClick={() => onMonthChange(date.month() - 1)}
					/>
					<Text as="span" size={12}>
						{date.format("MMM")}
					</Text>
					<Button
						leftIcon={ArrowLineRightIcon}
						size="md"
						onClick={() => onMonthChange(date.month() + 1)}
					/>
				</div>
			</div>
			<Body />
		</div>
	);
};

DatePicker.displayName = "DatePicker";
export { DatePicker };
