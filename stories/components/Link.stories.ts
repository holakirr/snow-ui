import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Link, ROLES } from "../../src";

const testLinkLabel = "Link";
const testLinkHref = "#";

const meta = {
	title: "Base Components/Link",
	component: Link,
	args: {
		children: testLinkLabel,
		href: testLinkHref,
	},
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const Link = canvas.getByRole(ROLES.link);

		expect(Link).toBeInTheDocument();
		expect(Link).toHaveAttribute("href", testLinkHref);
		expect(Link).toHaveTextContent(testLinkLabel);
	},
};

export const External: Story = {
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

export const CustomStyle: Story = {
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
