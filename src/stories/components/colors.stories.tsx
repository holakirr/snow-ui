import { Line } from "@components";
import { COLOR_SCHEME } from "@constants";
import type { Meta, StoryObj } from "@storybook/react";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";

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
		<div className="grid gap-2">
			{(Object.keys(COLOR_SCHEME) as (keyof typeof COLOR_SCHEME)[]).map((color) => (
				<Fragment key={color}>
					<div className="grid gap-8 grid-cols-2 items-center">
						<span className="text-4xl font-normal">{color[0].toUpperCase() + color.slice(1)}</span>
						<div className="grid gap-2">
							{Object.keys(
								COLOR_SCHEME[color] as (typeof COLOR_SCHEME)[keyof typeof COLOR_SCHEME],
							).map((shade) =>
								shade === "purple" && color === "primary" ? (
									<Fragment
										key={COLOR_SCHEME[color][shade][50] + COLOR_SCHEME[color][shade].DEFAULT}
									>
										<div className="flex items-center justify-end gap-2">
											<span className="text-sm text-black-100">{shade} 50</span>
											<div
												className={"rounded-2xl text-center p-10"}
												style={{
													backgroundColor: COLOR_SCHEME[color][shade][50],
												}}
											/>
										</div>
										<div className="flex items-center justify-end gap-2">
											<span className="text-sm text-black-100">{shade}</span>
											<div
												className={"rounded-2xl text-center p-10"}
												style={{
													backgroundColor: COLOR_SCHEME[color][shade].DEFAULT,
												}}
											/>
										</div>
									</Fragment>
								) : (
									<div className="flex items-center justify-end gap-2" key={color + shade}>
										<span className="text-sm text-black-100">{shade}</span>
										<div
											className={twMerge("rounded-2xl text-center p-10", `bg-${color}-${shade}`)}
											style={{
												// biome-ignore lint/suspicious/noExplicitAny: that's just a story
												backgroundColor: (COLOR_SCHEME[color] as any)[shade],
											}}
										/>
									</div>
								),
							)}
						</div>
					</div>
					<Line />
				</Fragment>
			))}
		</div>
	),
};
