import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { TEXT_SIZES, Text } from "../../src";
import { testText } from "../mocks";

const testLongText =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const meta: Meta<typeof Text> = {
	title: "Base Components/Text",
	component: Text,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: Object.keys(TEXT_SIZES),
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
		children: testText,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		as: "h1",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const text = canvas.getByRole("heading");

		expect(text).toBeInTheDocument();
		expect(text).toHaveTextContent(testText);
	},
};

export const LongText: Story = {
	args: {
		children: testLongText,
		role: "paragraph",
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: "300px" }}>
				<Story />
			</div>
		),
	],
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const text = canvas.getByRole("paragraph");

		expect(text).toBeInTheDocument();
		expect(text).toHaveTextContent(testLongText);
	},
};
