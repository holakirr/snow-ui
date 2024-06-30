import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Line, ROLES, SEPARATOR_DIRECTIONS } from "../../src";

const testWrapperSide = 200;

const meta: Meta<typeof Line> = {
	title: "Base Components/Line",
	component: Line,
	argTypes: {
		direction: {
			control: "radio",
			options: Object.values(SEPARATOR_DIRECTIONS),
		},
	},
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const line = canvas.getByRole(ROLES.separator);

		expect(line).toBeInTheDocument();
		expect(line).toHaveStyle({ height: "1px" });
		expect(line).toHaveStyle({ width: `${testWrapperSide}px` });
	},
};

export const Vertical: Story = {
	args: {
		direction: SEPARATOR_DIRECTIONS.vertical,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const line = canvas.getByRole(ROLES.separator);

		expect(line).toHaveStyle({ width: "1px" });
		expect(line).toHaveStyle({ height: `${testWrapperSide}px` });
	},
};
