import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
	Avatar,
	AvatarGroup,
	Caption,
	Chip,
	type StatusExpanded,
	TBody,
	TD,
	TH,
	TR,
	TableB,
} from "../../../src";
import { imageSrcMocks } from "../../mocks";

const getTestChipLabel = (status: StatusExpanded) => {
	switch (status) {
		case "success":
			return "In Progress";
		case "error":
			return "Delayed";
		case "warning":
			return "Pending";
		default:
			return "Completed";
	}
};

const getTestRow = (
	title: string,
	assignedTo: ReactElement[],
	timeSpend: string,
	status: StatusExpanded,
) => [
	title,
	<AvatarGroup key={`Assigned to ${title}`}>{assignedTo}</AvatarGroup>,
	timeSpend,
	<Chip key={status} color="green" label={getTestChipLabel(status)} status={status} withDot />,
];

const testCaption = "Tasks";
const testHeadCols = ["Title", "Assigned to", "Time Spend", "Status"];
const testRows = [
	getTestRow(
		"Coffee detail page",
		[<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.man} />],
		"3hr 20min",
		"success",
	),
	getTestRow(
		"Drinking bottle graphics",
		[
			<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.chef} />,
			<Avatar name="John Doe" key="John Doe" src={imageSrcMocks.woman} />,
		],
		"12hr 21min",
		"error",
	),
	getTestRow(
		"Create a new design for mobile",
		[<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.man} />],
		"78hr 5min",
		"warning",
	),
	getTestRow(
		"Poster illustation design",
		[<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.chef} />],
		"26hr 58min",
		"success",
	),
	getTestRow(
		"App UI design",
		[<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.chef} />],
		"17hr 22min",
		"success",
	),
];

const meta: Meta<typeof TableB> = {
	title: "Widgets/Data/TableB",
	component: TableB,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {},
	render: (args) => (
		<TableB {...args}>
			<Caption>{testCaption}</Caption>
			<TBody>
				<TR>
					{testHeadCols.map((col, i) => (
						<TH key={col} className={i === 0 ? "ps-0 text-left" : ""}>
							{col}
						</TH>
					))}
				</TR>
				{testRows.map((row, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<TR key={i}>
						{row.map((cell, j) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<TD key={i} className={j === 0 ? "ps-0" : ""}>
								{cell}
							</TD>
						))}
					</TR>
				))}
			</TBody>
		</TableB>
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTableB: Story = {
	args: {},
	play: async ({ canvasElement }) => {},
};
