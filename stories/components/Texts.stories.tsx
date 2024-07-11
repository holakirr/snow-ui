import type { Meta, StoryObj } from "@storybook/react";
import { TEXT_SIZES, Text, type TextSize } from "../../src";

type TextStyle = {
	size: TextSize;
	semibold: boolean;
};

const TextStyles: TextStyle[] = Object.values(TEXT_SIZES).flatMap((size) => [
	{ size, semibold: false },
	{ size, semibold: true },
]);

const meta = {
	title: "Foundations/Design System/Text styles",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Texts: Story = {
	render: () => (
		<div className="grid gap-2">
			{TextStyles.reverse().map((textStyle) => (
				<Text
					size={textStyle.size}
					semibold={textStyle.semibold}
					key={textStyle.semibold.toString() + textStyle.size?.toString()}
				>
					{textStyle.size} {textStyle.semibold ? "semibold" : "regular"}
				</Text>
			))}
		</div>
	),
};
