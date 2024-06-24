import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import type { ReactElement } from "react";
import {
	Avatar,
	AvatarGroup,
	Chip,
	ROLES,
	type StatusExpanded,
	TableB,
	type TableBProps,
} from "../../../src";
import { imageSrcMocks } from "../../mocks";

const getTestChipLabel = (status: StatusExpanded) => {
	switch (status) {
		case "success":
			return "Completed";
		case "error":
			return "Rejected";
		case "warning":
			return "Approved";
		case "default":
			return "In Progress";
		case "info":
			return "Pending";
	}
};

const getTestRow = (
	title: string,
	assignedTo: ReactElement[],
	timeSpend: string,
	status: StatusExpanded,
) => ({
	key: title,
	cells: [
		{
			key: title,
			render: title,
		},
		{
			key: `Assigned to ${title}`,
			render: (
				<AvatarGroup key={`Assigned to ${title}`} limit={2}>
					{assignedTo}
				</AvatarGroup>
			),
		},
		{ key: timeSpend, render: timeSpend },
		{
			key: status,
			render: (
				<Chip key={status} color="green" label={getTestChipLabel(status)} status={status} withDot />
			),
		},
	],
});

const testCaption = "Tasks";
const testHeadCols = ["Title", "Assigned to", "Time Spend", "Status"];
const testRows: TableBProps["dataSource"] = [
	getTestRow(
		"Coffee detail page",
		[<Avatar name="ByeWind" key="Coffee detail page - ByeWind" src={imageSrcMocks.chef} />],
		"3hr 20min",
		"default",
	),
	getTestRow(
		"Drinking bottle graphics",
		[
			<Avatar name="Scott" key="Drinking bottle graphics - Scott" src={imageSrcMocks.scott} />,
			<Avatar name="Jane Doe" key="Drinking bottle graphics - Jane Doe" src={imageSrcMocks.jane} />,
		],
		"12hr 21min",
		"success",
	),
	getTestRow(
		"App design and development",
		[
			<Avatar name="ByeWind" key="App design and development - ByeWind" src={imageSrcMocks.chef} />,
			<Avatar
				name="Jane Doe"
				key="App design and development - Jane Doe"
				src={imageSrcMocks.jane}
			/>,
			<Avatar
				name="John Doe"
				key="App design and development - John Doe"
				src={imageSrcMocks.john}
			/>,
			<Avatar name="Dave Bo" key="App design and development - Dave Bo" src={imageSrcMocks.dave} />,
			<Avatar
				name="Alex Catcher"
				key="App design and development - Alex Catcher"
				src={imageSrcMocks.alex}
			/>,
		],
		"78hr 5min",
		"info",
	),
	getTestRow(
		"Poster illustation design",
		[
			<Avatar name="Dave Bo" key="App design and development - Dave Bo" src={imageSrcMocks.dave} />,
			<Avatar
				name="Alex Catcher"
				key="App design and development - Alex Catcher"
				src={imageSrcMocks.alex}
			/>,
		],
		"26hr 58min",
		"warning",
	),
	getTestRow(
		"App UI design",
		[<Avatar name="ByeWind" key="ByeWind" src={imageSrcMocks.chef} />],
		"17hr 22min",
		"error",
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
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		// caption: testCaption,
		// columns: testHeadCols,
		dataSource: testRows,
	},
	render: (args) => <TableB {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTableB: Story = {
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const table = canvas.getByRole(ROLES.table);
		const tbody = within(table).getByRole(ROLES.tableRowGroup);
		const rows = within(tbody).getAllByRole(ROLES.tableRow);

		expect(table).toBeInTheDocument();
		expect(table).toHaveAttribute("aria-label", "Table");
		expect(tbody).toHaveAttribute("aria-label", "Body of table");
		expect(rows).toHaveLength(testRows.length);
	},
};

export const TableBWithHead: Story = {
	args: {
		columns: testHeadCols,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const table = canvas.getByRole(ROLES.table);
		const thead = canvas.getByRole(ROLES.tableRowGroup, { name: "Head of table" });
		const headRow = within(thead).getByRole(ROLES.tableRow);
		const headCols = within(headRow).getAllByRole(ROLES.tableColumnHeader);

		expect(table).toBeInTheDocument();
		expect(thead).toBeInTheDocument();
		expect(headRow).toBeInTheDocument();
		expect(headCols).toHaveLength(testHeadCols.length);
	},
};

export const TableBWithAllProps: Story = {
	args: {
		caption: testCaption,
		columns: testHeadCols,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const table = canvas.getByRole(ROLES.table);
		const caption = canvas.getByText(testCaption);
		const thead = canvas.getByRole(ROLES.tableRowGroup, { name: `Head of table ${testCaption}` });
		const headRow = within(thead).getByRole(ROLES.tableRow);
		const headCols = within(headRow).getAllByRole(ROLES.tableColumnHeader);
		const tbody = within(table).getByRole(ROLES.tableRowGroup, {
			name: `Body of table ${testCaption}`,
		});
		const rows = within(tbody).getAllByRole(ROLES.tableRow);

		expect(table).toBeInTheDocument();
		expect(caption).toBeInTheDocument();
		expect(thead).toBeInTheDocument();
		expect(headRow).toBeInTheDocument();
		expect(headCols).toHaveLength(testHeadCols.length);
		expect(tbody).toBeInTheDocument();
		expect(rows).toHaveLength(testRows.length);
	},
};
