import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text, type TextSizes } from "../";

type TextStyle = {
	size: TextSizes;
	semibold: boolean;
};

const TextStyles: TextStyle[] = [
	{ size: 64, semibold: true },
	{ size: 64, semibold: false },
	{ size: 48, semibold: true },
	{ size: 48, semibold: false },
	{ size: 24, semibold: true },
	{ size: 24, semibold: false },
	{ size: 18, semibold: true },
	{ size: 18, semibold: false },
	{ size: 14, semibold: true },
	{ size: 14, semibold: false },
	{ size: 12, semibold: true },
	{ size: 12, semibold: false },
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

export const Colors: Story = {
	render: () => (
		<div className="grid gap-2">
			{TextStyles.map((style) => (
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
