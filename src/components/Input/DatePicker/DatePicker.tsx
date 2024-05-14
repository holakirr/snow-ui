import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../../Button";
import { ArrowLineLeftIcon, ArrowLineRightIcon } from "../../Icons";
import { Tag } from "../../Tag";
import { Text } from "../../Text";

type DatePickerProps = ComponentProps<"div"> & {};

const DateTag = ({ label }: { label: string }) => (
	<Tag label={label} textSize={14} className="py-0.5 px-1 bg-transparent" />
);

const Head = () => (
	<div className="w-full flex gap-2 justify-between border-b border-black-10 p-4">
		<div className="flex gap-3 items-center">
			<Text
				as="time"
				dateTime="10/22/2024"
				className="inline-flex items-center w-min"
				size={14}
			>
				<DateTag label="10" />
				/
				<DateTag label="02" />
				/
				<DateTag label="2024" />
			</Text>
			<Text as="span" size={14}>
				-
			</Text>
			<Text
				as="time"
				dateTime="10/22/2024"
				className="inline-flex items-center w-min"
				size={14}
			>
				<DateTag label="10" />
				/
				<DateTag label="02" />
				/
				<DateTag label="2024" />
			</Text>
		</div>
		<Text
			as="time"
			dateTime="04:08 AM"
			className="inline-flex items-center w-min"
			size={14}
		>
			<DateTag label="04" />
			<Text as="span" size={14}>
				:
			</Text>
			<DateTag label="08" />
			<DateTag label="AM" />
		</Text>
	</div>
);

const SubHead = () => (
	<div className="flex justify-between px-4 pt-4">
		<div className="flex gap-2 items-center">
			<Tag label="Today" />
			<Tag label="Last selection" />
		</div>
		<div className="flex items-center">
			<Button leftIcon={ArrowLineLeftIcon} size="md" />
			<Text as="span" size={12}>
				Feb
			</Text>
			<Button leftIcon={ArrowLineRightIcon} size="md" />
		</div>
	</div>
);

const TH = ({ children }: { children: string }) => (
	<th className="px-4 py-2">
		<Text as="span" size={12} className="text-black-40">
			{children}
		</Text>
	</th>
);

const TD = ({ day }: { day: string }) => (
	<td className="px-4 py-2 text-center">
		<Text as="span" size={12} className="text-black-100">
			{day}
		</Text>
	</td>
);

const Body = () => (
	<div className="p-4">
		<table className="w-full text-xs">
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
					<TD day="30" />
					<TD day="31" />
					<TD day="1" />
					<TD day="2" />
					<TD day="3" />
					<TD day="4" />
					<TD day="5" />
				</tr>
				<tr>
					<TD day="6" />
					<TD day="7" />
					<TD day="8" />
					<TD day="9" />
					<TD day="10" />
					<TD day="11" />
					<TD day="12" />
				</tr>
				<tr>
					<TD day="13" />
					<TD day="14" />
					<TD day="15" />
					<TD day="16" />
					<TD day="17" />
					<TD day="18" />
					<TD day="19" />
				</tr>
				<tr>
					<TD day="20" />
					<TD day="21" />
					<TD day="22" />
					<TD day="23" />
					<TD day="24" />
					<TD day="25" />
					<TD day="26" />
				</tr>
				<tr>
					<TD day="27" />
					<TD day="28" />
					<TD day="29" />
					<TD day="30" />
					<TD day="1" />
					<TD day="2" />
					<TD day="3" />
				</tr>
			</tbody>
		</table>
	</div>
);

const DatePicker = ({ className, ...props }: DatePickerProps) => (
	<div
		className={twMerge(
			"w-[360px] rounded-2xl border-1 border-black-10 flex flex-col backdrop-blur-[20px] bg-white-80",
			className,
		)}
		{...props}
	>
		<Head />
		<SubHead />
		<Body />
	</div>
);

DatePicker.displayName = "DatePicker";
export { DatePicker };
