import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Avatar, AvatarGroup, ROLES } from "../../../src";
import { imageSrcMocks } from "../../mocks";

const testLimit = 2;
const mockAvatars: React.ReactNode[] = [
	<Avatar name="Aaron Ferguson" key="Aaron" />,
	<Avatar name="Bob Marley" key="Bob" src={imageSrcMocks.chef} />,
	<Avatar name="Keanu Reeves" key="Keanu Reeves" src={imageSrcMocks.man} />,
	<Avatar name="Charlize Theron" key="Charlize Theron" src={imageSrcMocks.woman} />,
];

const meta = {
	title: "Base Components/Avatar/Avatar Group",
	component: AvatarGroup,
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
	args: {
		children: mockAvatars,
	},
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		children: mockAvatars.slice(0, 3),
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatarGroup = canvas.getByRole(ROLES.avatarGroup);
		const avatars = canvas.getAllByRole(ROLES.avatar);

		expect(avatarGroup).toBeInTheDocument();
		expect(avatars).toHaveLength(3);
	},
};

export const WithLimit: Story = {
	args: {
		limit: testLimit,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const avatarGroup = canvas.getByRole(ROLES.avatarGroup);
		const avatars = canvas.getAllByRole(ROLES.avatar);

		expect(avatarGroup).toBeInTheDocument();
		expect(avatars).toHaveLength(testLimit + 1);
	},
};

export const InGrid: Story = {
	args: {
		direction: "grid",
	},
};
