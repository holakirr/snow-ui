import { Typography } from "@holakirr/snow-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { ICON_SIZES, ICON_WEIGHTS } from "./constants";
import {
	AddIcon,
	AIIcon,
	ArrowFallIcon,
	ArrowLineDownIcon,
	ArrowLineLeftIcon,
	ArrowLineRightIcon,
	ArrowLineUpDownIcon,
	ArrowLineUpIcon,
	ArrowRightIcon,
	ArrowRiseIcon,
	ArrowsDownIcon,
	ArrowsDownUpIcon,
	ArrowsUpIcon,
	ClipboardIcon,
	CloseIcon,
	CopyIcon,
	DefaultIcon,
	DocXIcon,
	DotIcon,
	DotsThreeOutlineHorizontalIcon,
	ExplainIcon,
	FormIcon,
	FourLeafCloverIcon,
	FourPointedStarIcon,
	GotoIcon,
	HelpIcon,
	HorizontalScreenIcon,
	LineIcon,
	LoadingAIcon,
	LoadingBIcon,
	MaximizeIcon,
	MinimizeIcon,
	NotepadIcon,
	OneNoteIcon,
	PPTIcon,
	RectangleIcon,
	RightBarIcon,
	RoundedCornerIcon,
	SearchIcon,
	SnowUIIcon,
	StarIcon,
	StopIcon,
	TextAIcon,
	TXTIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
} from "./ssr";

const allIcons = {
	AddIcon,
	AIIcon,
	ArrowFallIcon,
	ArrowLineDownIcon,
	ArrowLineLeftIcon,
	ArrowLineRightIcon,
	ArrowLineUpDownIcon,
	ArrowLineUpIcon,
	ArrowRightIcon,
	ArrowRiseIcon,
	ArrowsDownIcon,
	ArrowsDownUpIcon,
	ArrowsUpIcon,
	ClipboardIcon,
	CloseIcon,
	CopyIcon,
	DefaultIcon,
	DocXIcon,
	DotIcon,
	DotsThreeOutlineHorizontalIcon,
	ExplainIcon,
	FormIcon,
	FourLeafCloverIcon,
	FourPointedStarIcon,
	GotoIcon,
	HelpIcon,
	HorizontalScreenIcon,
	LineIcon,
	LoadingAIcon,
	LoadingBIcon,
	MaximizeIcon,
	MinimizeIcon,
	NotepadIcon,
	OneNoteIcon,
	PPTIcon,
	RectangleIcon,
	RightBarIcon,
	RoundedCornerIcon,
	SearchIcon,
	SnowUIIcon,
	StarIcon,
	StopIcon,
	TextAIcon,
	TXTIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
};

const meta = {
	title: "Icons",
	argTypes: {
		weight: {
			control: "radio",
			options: Object.values(ICON_WEIGHTS),
			description: "The weight of the icon",
		},
		size: {
			control: "select",
			options: Object.keys(ICON_SIZES),
		},
	},
	args: {},
	render: (args) => (
		<div
			style={{
				width: "100%",
				display: "grid",
				gridTemplateColumns: "repeat(4, 1fr)",
				rowGap: "2.5rem",
			}}
		>
			{Object.values(allIcons).map((Icon) => (
				<div
					key={Icon.displayName}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<Icon {...args} alt={`Icon ${Icon.displayName}`} />
					<Typography className="text-black-100">{Icon.displayName}</Typography>
				</div>
			))}
		</div>
	),
} satisfies Meta<typeof AddIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
	args: {
		alt: "Icons",
	},
};

const Template: (iconName: keyof typeof allIcons) => Story = (iconName) => ({
	args: {
		alt: iconName,
	},
	render: (args) => {
		const Icon = allIcons[iconName];

		return (
			Icon && (
				<div className="flex gap-8">
					{Object.values(ICON_WEIGHTS).map((weight) => (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "column",
							}}
							key={weight}
						>
							<Icon {...args} weight={weight} alt={`Icon ${iconName}, weight ${weight}`} />
							<Typography className="text-black-100 w-min">{weight}</Typography>
						</div>
					))}
				</div>
			)
		);
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const icons = canvas.getAllByRole("img");

		expect(icons[0]).toHaveTextContent(`Icon ${iconName}, weight bold`);
		expect(icons).toHaveLength(Object.keys(ICON_WEIGHTS).length);
	},
});

export const AddIconStory: Story = {
	name: "AddIcon",
	...Template(AddIcon.displayName as keyof typeof allIcons),
	args: {},
};

export const AIIconStory: Story = {
	name: "AIIcon",
	...Template(AIIcon.displayName as keyof typeof allIcons),
};

export const ArrowFallIconStory: Story = {
	name: "ArrowFallIcon",
	...Template(ArrowFallIcon.displayName as keyof typeof allIcons),
};

export const ArrowLineDownIconStory: Story = {
	name: "ArrowLineDownIcon",
	...Template(ArrowLineDownIcon.displayName as keyof typeof allIcons),
};

export const ArrowLineLeftIconStory: Story = {
	name: "ArrowLineLeftIcon",
	...Template(ArrowLineLeftIcon.displayName as keyof typeof allIcons),
};

export const ArrowLineRightIconStory: Story = {
	name: "ArrowLineRightIcon",
	...Template(ArrowLineRightIcon.displayName as keyof typeof allIcons),
};

export const ArrowLineUpDownIconStory: Story = {
	name: "ArrowLineUpDownIcon",
	...Template(ArrowLineUpDownIcon.displayName as keyof typeof allIcons),
};

export const ArrowLineUpIconStory: Story = {
	name: "ArrowLineUpIcon",
	...Template(ArrowLineUpIcon.displayName as keyof typeof allIcons),
};

export const ArrowRightIconStory: Story = {
	name: "ArrowRightIcon",
	...Template(ArrowRightIcon.displayName as keyof typeof allIcons),
};

export const ArrowRiseIconStory: Story = {
	name: "ArrowRiseIcon",
	...Template(ArrowRiseIcon.displayName as keyof typeof allIcons),
};

export const ArrowsDownIconStory: Story = {
	name: "ArrowsDownIcon",
	...Template(ArrowsDownIcon.displayName as keyof typeof allIcons),
};

export const ArrowsDownUpIconStory: Story = {
	name: "ArrowsDownUpIcon",
	...Template(ArrowsDownUpIcon.displayName as keyof typeof allIcons),
};

export const ArrowsUpIconStory: Story = {
	name: "ArrowsUpIcon",
	...Template(ArrowsUpIcon.displayName as keyof typeof allIcons),
};

export const ClipboardIconStory: Story = {
	name: "ClipboardIcon",
	...Template(ClipboardIcon.displayName as keyof typeof allIcons),
};

export const CloseIconStory: Story = {
	name: "CloseIcon",
	...Template(CloseIcon.displayName as keyof typeof allIcons),
};

export const CopyIconStory: Story = {
	name: "CopyIcon",
	...Template(CopyIcon.displayName as keyof typeof allIcons),
};

export const DefaultIconStory: Story = {
	name: "DefaultIcon",
	...Template(DefaultIcon.displayName as keyof typeof allIcons),
};

export const DocXIconStory: Story = {
	name: "DocXIcon",
	...Template(DocXIcon.displayName as keyof typeof allIcons),
};

export const DotIconStory: Story = {
	name: "DotIcon",
	...Template(DotIcon.displayName as keyof typeof allIcons),
};

export const DotsThreeOutlineHorizontalIconStory: Story = {
	name: "DotsThreeOutlineHorizontalIcon",
	...Template(DotsThreeOutlineHorizontalIcon.displayName as keyof typeof allIcons),
};

export const ExplainIconStory: Story = {
	name: "ExplainIcon",
	...Template(ExplainIcon.displayName as keyof typeof allIcons),
};

export const FormIconStory: Story = {
	name: "FormIcon",
	...Template(FormIcon.displayName as keyof typeof allIcons),
};

export const FourLeafCloverIconStory: Story = {
	name: "FourLeafCloverIcon",
	...Template(FourLeafCloverIcon.displayName as keyof typeof allIcons),
};

export const FourPointedStarIconStory: Story = {
	name: "FourPointedStarIcon",
	...Template(FourPointedStarIcon.displayName as keyof typeof allIcons),
};

export const GotoIconStory: Story = {
	name: "GotoIcon",
	...Template(GotoIcon.displayName as keyof typeof allIcons),
};

export const HelpIconStory: Story = {
	name: "HelpIcon",
	...Template(HelpIcon.displayName as keyof typeof allIcons),
};

export const HorizontalScreenIconStory: Story = {
	name: "HorizontalScreenIcon",
	...Template(HorizontalScreenIcon.displayName as keyof typeof allIcons),
};

export const LineIconStory: Story = {
	name: "LineIcon",
	...Template(LineIcon.displayName as keyof typeof allIcons),
};

export const LoadingAIconStory: Story = {
	name: "LoadingAIcon",
	...Template(LoadingAIcon.displayName as keyof typeof allIcons),
};

export const LoadingBIconStory: Story = {
	name: "LoadingBIcon",
	...Template(LoadingBIcon.displayName as keyof typeof allIcons),
};

export const MaximizeIconStory: Story = {
	name: "MaximizeIcon",
	...Template(MaximizeIcon.displayName as keyof typeof allIcons),
};

export const MinimizeIconStory: Story = {
	name: "MinimizeIcon",
	...Template(MinimizeIcon.displayName as keyof typeof allIcons),
};

export const NotepadIconStory: Story = {
	name: "NotepadIcon",
	...Template(NotepadIcon.displayName as keyof typeof allIcons),
};

export const OneNoteIconStory: Story = {
	name: "OneNoteIcon",
	...Template(OneNoteIcon.displayName as keyof typeof allIcons),
};

export const PPTIconStory: Story = {
	name: "PPTIcon",
	...Template(PPTIcon.displayName as keyof typeof allIcons),
};

export const RectangleIconStory: Story = {
	name: "RectangleIcon",
	...Template(RectangleIcon.displayName as keyof typeof allIcons),
};

export const RightbarIconStory: Story = {
	name: "RightbarIcon",
	...Template(RightBarIcon.displayName as keyof typeof allIcons),
};

export const RoundedCornerIconStory: Story = {
	name: "RoundedCornerIcon",
	...Template(RoundedCornerIcon.displayName as keyof typeof allIcons),
};

export const SearchIconStory: Story = {
	name: "SearchIcon",
	...Template(SearchIcon.displayName as keyof typeof allIcons),
};

export const SnowUIIconStory: Story = {
	name: "SnowUIIcon",
	...Template(SnowUIIcon.displayName as keyof typeof allIcons),
};

export const StarIconStory: Story = {
	name: "StarIcon",
	...Template(StarIcon.displayName as keyof typeof allIcons),
};

export const StopIconStory: Story = {
	name: "StopIcon",
	...Template(StopIcon.displayName as keyof typeof allIcons),
};

export const TextAIconStory: Story = {
	name: "TextAIcon",
	...Template(TextAIcon.displayName as keyof typeof allIcons),
};

export const TXTIconStory: Story = {
	name: "TXTIcon",
	...Template(TXTIcon.displayName as keyof typeof allIcons),
};

export const VariablesIconStory: Story = {
	name: "VariablesIcon",
	...Template(VariablesIcon.displayName as keyof typeof allIcons),
};

export const VerticalScreenIconStory: Story = {
	name: "VerticalScreenIcon",
	...Template(VerticalScreenIcon.displayName as keyof typeof allIcons),
};

export const WindowedIconStory: Story = {
	name: "WindowedIcon",
	...Template(WindowedIcon.displayName as keyof typeof allIcons),
};

export const XCircleIconStory: Story = {
	name: "XCircleIcon",
	...Template(XCircleIcon.displayName as keyof typeof allIcons),
};

export const XLSXIconStory: Story = {
	name: "XLSXIcon",
	...Template(XLSXIcon.displayName as keyof typeof allIcons),
};
