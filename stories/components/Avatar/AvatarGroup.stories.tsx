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
		controls: {
			exclude: ["children"],
		},
	},
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
		const avatarGroup = canvas.getByRole(ROLES.region);
		const avatars = canvas.getAllByRole(ROLES.figure);

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
		const avatarGroup = canvas.getByRole(ROLES.region);
		const avatars = canvas.getAllByRole(ROLES.figure);

		expect(avatarGroup).toBeInTheDocument();
		expect(avatars).toHaveLength(testLimit + 1);
	},
};

export const InGrid: Story = {
	args: {
		direction: "grid",
	},
};
