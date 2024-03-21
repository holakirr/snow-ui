import type { Meta, StoryObj } from "@storybook/react";
import { Text } from ".";

const meta = {
	title: "Base Components/Components/Text",
	component: Text,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: [64, 48, 24, 18, 14, 12],
			description: "The size of the text",
		},
		semibold: {
			control: "boolean",
			description: "Whether the text is semibold",
		},
		align: {
			control: "radio",
			options: ["left", "center", "right"],
			description: "The alignment of the text",
		},
		italic: {
			control: "boolean",
			description: "Whether the text is italic",
		},
		underline: {
			control: "boolean",
			description: "Whether the text is underlined",
		},
	},
	args: {
		as: "p",
		size: 12,
		semibold: false,
		align: "left",
		italic: false,
		underline: false,
		children: "Hello, World!",
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: 400, minWidth: 200, display: "flex" }}>
				<Story />
			</div>
		),
	],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		as: "h1",
		children: "Hello, World!",
	},
};

export const LongText: Story = {
	args: {
		children:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: "300px" }}>
				<Story />
			</div>
		),
	],
};
