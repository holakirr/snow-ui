import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Link, ROLES } from "../../src";

const testLinkLabel = "Link";
const testLinkHref = "#";

const meta = {
	title: "Base Components/Link",
	component: Link,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		children: testLinkLabel,
		href: testLinkHref,
	},
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicLink: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const Link = canvas.getByRole(ROLES.link);

		expect(Link).toBeInTheDocument();
		expect(Link).toHaveAttribute("href", testLinkHref);
		expect(Link).toHaveTextContent(testLinkLabel);
	},
};

export const ExternalLink: Story = {
	args: {
		target: "_blank",
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const Link = canvas.getByRole(ROLES.link);
		expect(Link).toBeInTheDocument();
		expect(Link).toHaveAttribute("href", testLinkHref);
		expect(Link).toHaveTextContent(testLinkLabel);
		expect(Link).toHaveAttribute("target", "_blank");
	},
};

export const CustomStyleLink: Story = {
	args: {
		style: { color: "red" },
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const Link = canvas.getByRole(ROLES.link);
		expect(Link).toBeInTheDocument();
		expect(Link).toHaveAttribute("href", testLinkHref);
		expect(Link).toHaveTextContent(testLinkLabel);
		expect(Link).toHaveStyle("color: rgb(255, 0, 0)");
	},
};
