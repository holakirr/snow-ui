import type { Meta, StoryObj } from "@storybook/react";
import { Text, TEXT_SIZES, type TextSize } from "../../src";

type TextStyle = {
	size: TextSize;
	semibold: boolean;
};

const TextStyles: TextStyle[] = [
	{ size: TEXT_SIZES[64], semibold: true },
	{ size: TEXT_SIZES[64], semibold: false },
	{ size: TEXT_SIZES[48], semibold: true },
	{ size: TEXT_SIZES[48], semibold: false },
	{ size: TEXT_SIZES[24], semibold: true },
	{ size: TEXT_SIZES[24], semibold: false },
	{ size: TEXT_SIZES[18], semibold: true },
	{ size: TEXT_SIZES[18], semibold: false },
	{ size: TEXT_SIZES[14], semibold: true },
	{ size: TEXT_SIZES[14], semibold: false },
	{ size: TEXT_SIZES[12], semibold: true },
	{ size: TEXT_SIZES[12], semibold: false },
];

const meta = {
	title: "Foundations/Design System/Text styles",
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Texts: Story = {
	render: () => (
		<div className="grid gap-2">
			{TextStyles.reverse().map((style) => (
				<Text
					size={style.size}
					semibold={style.semibold}
					key={style.semibold.toString() + style.size?.toString()}
				>
					{style.size} {style.semibold ? "semibold" : "regular"}
				</Text>
			))}
		</div>
	),
};
