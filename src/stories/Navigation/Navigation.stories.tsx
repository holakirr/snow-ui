import { Navigation } from "@components";
import { useNavigation } from "@hooks";
import { navigationMenuItems, onNavigationItemClick } from "@mocks";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, within } from "@storybook/test";
import type { MouseEventHandler } from "react";

const testClickHandler = fn((e) =>
	console.log(`clicked on ${e.currentTarget.id}`),
);
const testTitle = "Test";

const meta = {
	title: "Base Components/Navigation/Navigation",
	component: Navigation,
	parameters: {
		layout: "centered",
		controls: {
			exclude: ["children"],
		},
	},
	tags: ["autodocs"],
	argTypes: {
		onItemClick: onNavigationItemClick,
	},
	args: {
		items: navigationMenuItems,
		onItemClick: testClickHandler,
	},
	render: (args) => {
		const { items, onClickHandler } = useNavigation(args.items);
		const onItemClickHandler: MouseEventHandler<HTMLLIElement> = (e) => {
			args.onItemClick(e);
			onClickHandler(e);
		};

		return (
			<Navigation {...args} items={items} onItemClick={onItemClickHandler} />
		);
	},
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleNavigation: Story = {
	play: async (context) => {
		const canvas = within(context.canvasElement);
		const navigation = canvas.getByRole("navigation", {
			name: "Navigation undefined",
		});

		expect(navigation).toBeInTheDocument();
	},
};

export const NavigationWithTitle: Story = {
	args: {
		title: testTitle,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const navigation = canvas.getByRole("navigation", {
			name: `Navigation ${testTitle}`,
		});

		expect(navigation).toBeInTheDocument();
		expect(navigation).toHaveTextContent(testTitle);
	},
};
