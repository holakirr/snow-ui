import { Line } from "@components";
import { ROLES, SEPARATOR_DIRECTIONS } from "@constants";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";

const testWrapperSide = 200;

const meta = {
	title: "Base Components/Line",
	component: Line,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		direction: {
			control: "radio",
			options: Object.values(SEPARATOR_DIRECTIONS),
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		direction: SEPARATOR_DIRECTIONS.horizontal,
	},
	decorators: [
		(Story) => (
			<div
				style={{
					width: testWrapperSide,
					height: testWrapperSide,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Line>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicLine: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const line = canvas.getByRole(ROLES.line);

		expect(line).toBeInTheDocument();
		expect(line).toHaveStyle({ height: "1px" });
		expect(line).toHaveStyle({ width: `${testWrapperSide}px` });
	},
};

export const VerticalLine: Story = {
	args: {
		direction: SEPARATOR_DIRECTIONS.vertical,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const line = canvas.getByRole(ROLES.line);

		expect(line).toHaveStyle({ width: "1px" });
		expect(line).toHaveStyle({ height: `${testWrapperSide}px` });
	},
};
