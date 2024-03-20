import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { COLOR_SCHEME } from ".";

const meta = {
	title: "Foundations/Design System/Color Scheme",
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
	render: () => (
		<div>
			{Object.keys(COLOR_SCHEME).map((color) => (
				<div key={color} className="grid gap-8 grid-cols-2">
					<span className="text-4xl font-normal">
						{color[0].toUpperCase() + color.slice(1)}
					</span>
					<div className="grid gap-2">
						{Object.keys(COLOR_SCHEME[color]).map((shade) =>
							shade === "purple" && color === "primary" ? (
								<>
									<div
										key={shade[50]}
										className={"rounded-2xl text-center p-5"}
										style={{
											backgroundColor: COLOR_SCHEME[color][shade][50],
										}}
									>
										<span className="text-sm text-black-100">{shade} 50</span>
									</div>
									<div
										key={shade}
										className={"rounded-2xl text-center p-5"}
										style={{
											// biome-ignore lint/complexity/useLiteralKeys: <explanation>
											backgroundColor: COLOR_SCHEME[color][shade]["DEFAULT"],
										}}
									>
										<span className="text-sm text-black-100">{shade}</span>
									</div>
								</>
							) : (
								<div
									key={shade}
									className={"rounded-2xl text-center p-5"}
									style={{ backgroundColor: COLOR_SCHEME[color][shade] }}
								>
									<span className="text-sm text-black-100">{shade}</span>
								</div>
							),
						)}
					</div>
				</div>
			))}
		</div>
	),
};
