import type { Meta, StoryObj } from "@storybook/react";
import { Line } from ".";

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
			options: ["horizontal", "vertical"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		direction: "horizontal",
	},
	decorators: [
		(Story) => (
			<div
				style={{
					width: 400,
					height: 400,
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
};
