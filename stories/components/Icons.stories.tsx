import type { IconWeight } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
	AIIcon,
	AddIcon,
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
	ICON_WEIGHTS,
	LineIcon,
	LoadingBIcon,
	MaximizeIcon,
	MinimizeIcon,
	NotepadIcon,
	OneNoteIcon,
	PPTIcon,
	RectangleIcon,
	RightbarIcon,
	RoundedCornerIcon,
	SearchIcon,
	SnowUIIcon,
	StarIcon,
	StopIcon,
	TEXT_SIZES,
	TXTIcon,
	Text,
	TextAIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
} from "../../src";
import { weightControl } from "../mocks";

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
	LoadingBIcon,
	MaximizeIcon,
	MinimizeIcon,
	NotepadIcon,
	OneNoteIcon,
	PPTIcon,
	RectangleIcon,
	RightbarIcon,
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
	title: "Design resources/Icons/All Icons",
	argTypes: {
		weight: weightControl,
	},
	args: {
		size: 24,
		weight: "regular",
		className: "fill-primary-brand",
	},
	render: (args) => (
		<div className="grid w-max grid-cols-4 gap-5 text-sm">
			{Object.values(allIcons).map((Icon) => (
				<div className="grid gap-1 justify-center justify-items-center" key={Icon.displayName}>
					<Icon {...args} alt={`Icon ${Icon.displayName}`} />
					<span className="text-black-100">{Icon.displayName}</span>
				</div>
			))}
		</div>
	),
} satisfies Meta<typeof AddIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
	args: {
		size: 24,
		weight: "regular",
		className: "fill-primary-brand",
		alt: "Icons",
	},
};

const Template: (iconName: keyof typeof allIcons) => Story = (iconName) => ({
	args: {
		alt: "icon",
	},
	render: (args) => {
		const Icon = allIcons[iconName];
		return (
			Icon && (
				<div className="flex gap-8">
					{(Object.keys(ICON_WEIGHTS) as IconWeight[]).map((weight) => (
						<div className="flex flex-col gap-1 items-center" key={weight}>
							<Icon {...args} weight={weight} alt={`Icon ${iconName}, weight ${weight}`} />
							<Text size={TEXT_SIZES[12]} className="text-black-100 w-min">
								{weight}
							</Text>
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
	args: {
		alt: AddIcon.displayName as string,
	},
};

export const AIIconStory: Story = {
	name: "AIIcon",
	...Template(AIIcon.displayName as keyof typeof allIcons),
	args: {
		alt: AIIcon.displayName as string,
	},
};

export const ArrowFallIconStory: Story = {
	name: "ArrowFallIcon",
	...Template(ArrowFallIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowFallIcon.displayName as string,
	},
};

export const ArrowLineDownIconStory: Story = {
	name: "ArrowLineDownIcon",
	...Template(ArrowLineDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineDownIcon.displayName as string,
	},
};

export const ArrowLineLeftIconStory: Story = {
	name: "ArrowLineLeftIcon",
	...Template(ArrowLineLeftIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineLeftIcon.displayName as string,
	},
};

export const ArrowLineRightIconStory: Story = {
	name: "ArrowLineRightIcon",
	...Template(ArrowLineRightIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineRightIcon.displayName as string,
	},
};

export const ArrowLineUpDownIconStory: Story = {
	name: "ArrowLineUpDownIcon",
	...Template(ArrowLineUpDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineUpDownIcon.displayName as string,
	},
};

export const ArrowLineUpIconStory: Story = {
	name: "ArrowLineUpIcon",
	...Template(ArrowLineUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineUpIcon.displayName as string,
	},
};

export const ArrowRightIconStory: Story = {
	name: "ArrowRightIcon",
	...Template(ArrowRightIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowRightIcon.displayName as string,
	},
};

export const ArrowRiseIconStory: Story = {
	name: "ArrowRiseIcon",
	...Template(ArrowRiseIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowRiseIcon.displayName as string,
	},
};

export const ArrowsDownIconStory: Story = {
	name: "ArrowsDownIcon",
	...Template(ArrowsDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsDownIcon.displayName as string,
	},
};

export const ArrowsDownUpIconStory: Story = {
	name: "ArrowsDownUpIcon",
	...Template(ArrowsDownUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsDownUpIcon.displayName as string,
	},
};

export const ArrowsUpIconStory: Story = {
	name: "ArrowsUpIcon",
	...Template(ArrowsUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsUpIcon.displayName as string,
	},
};

export const ClipboardIconStory: Story = {
	name: "ClipboardIcon",
	...Template(ClipboardIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ClipboardIcon.displayName as string,
	},
};

export const CloseIconStory: Story = {
	name: "CloseIcon",
	...Template(CloseIcon.displayName as keyof typeof allIcons),
	args: {
		alt: CloseIcon.displayName as string,
	},
};

export const CopyIconStory: Story = {
	name: "CopyIcon",
	...Template(CopyIcon.displayName as keyof typeof allIcons),
	args: {
		alt: CopyIcon.displayName as string,
	},
};

export const DefaultIconStory: Story = {
	name: "DefaultIcon",
	...Template(DefaultIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DefaultIcon.displayName as string,
	},
};

export const DocXIconStory: Story = {
	name: "DocXIcon",
	...Template(DocXIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DocXIcon.displayName as string,
	},
};

export const DotIconStory: Story = {
	name: "DotIcon",
	...Template(DotIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DotIcon.displayName as string,
	},
};

export const DotsThreeOutlineHorizontalIconStory: Story = {
	name: "DotsThreeOutlineHorizontalIcon",
	...Template(DotsThreeOutlineHorizontalIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DotsThreeOutlineHorizontalIcon.displayName as string,
	},
};

export const ExplainIconStory: Story = {
	name: "ExplainIcon",
	...Template(ExplainIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ExplainIcon.displayName as string,
	},
};

export const FormIconStory: Story = {
	name: "FormIcon",
	...Template(FormIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FormIcon.displayName as string,
	},
};

export const FourLeafCloverIconStory: Story = {
	name: "FourLeafCloverIcon",
	...Template(FourLeafCloverIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FourLeafCloverIcon.displayName as string,
	},
};

export const FourPointedStarIconStory: Story = {
	name: "FourPointedStarIcon",
	...Template(FourPointedStarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FourPointedStarIcon.displayName as string,
	},
};

export const GotoIconStory: Story = {
	name: "GotoIcon",
	...Template(GotoIcon.displayName as keyof typeof allIcons),
	args: {
		alt: GotoIcon.displayName as string,
	},
};

export const HelpIconStory: Story = {
	name: "HelpIcon",
	...Template(HelpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: HelpIcon.displayName as string,
	},
};

export const HorizontalScreenIconStory: Story = {
	name: "HorizontalScreenIcon",
	...Template(HorizontalScreenIcon.displayName as keyof typeof allIcons),
	args: {
		alt: HorizontalScreenIcon.displayName as string,
	},
};

export const LineIconStory: Story = {
	name: "LineIcon",
	...Template(LineIcon.displayName as keyof typeof allIcons),
	args: {
		alt: LineIcon.displayName as string,
	},
};

export const LoadingBIconStory: Story = {
	name: "LoadingBIcon",
	...Template(LoadingBIcon.displayName as keyof typeof allIcons),
	args: {
		alt: LoadingBIcon.displayName as string,
	},
};

export const MaximizeIconStory: Story = {
	name: "MaximizeIcon",
	...Template(MaximizeIcon.displayName as keyof typeof allIcons),
	args: {
		alt: MaximizeIcon.displayName as string,
	},
};

export const MinimizeIconStory: Story = {
	name: "MinimizeIcon",
	...Template(MinimizeIcon.displayName as keyof typeof allIcons),
	args: {
		alt: MinimizeIcon.displayName as string,
	},
};

export const NotepadIconStory: Story = {
	name: "NotepadIcon",
	...Template(NotepadIcon.displayName as keyof typeof allIcons),
	args: {
		alt: NotepadIcon.displayName as string,
	},
};

export const OneNoteIconStory: Story = {
	name: "OneNoteIcon",
	...Template(OneNoteIcon.displayName as keyof typeof allIcons),
	args: {
		alt: OneNoteIcon.displayName as string,
	},
};

export const PPTIconStory: Story = {
	name: "PPTIcon",
	...Template(PPTIcon.displayName as keyof typeof allIcons),
	args: {
		alt: PPTIcon.displayName as string,
	},
};

export const RectangleIconStory: Story = {
	name: "RectangleIcon",
	...Template(RectangleIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RectangleIcon.displayName as string,
	},
};

export const RightbarIconStory: Story = {
	name: "RightbarIcon",
	...Template(RightbarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RightbarIcon.displayName as string,
	},
};

export const RoundedCornerIconStory: Story = {
	name: "RoundedCornerIcon",
	...Template(RoundedCornerIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RoundedCornerIcon.displayName as string,
	},
};

export const SearchIconStory: Story = {
	name: "SearchIcon",
	...Template(SearchIcon.displayName as keyof typeof allIcons),
	args: {
		alt: SearchIcon.displayName as string,
	},
};

export const SnowUIIconStory: Story = {
	name: "SnowUIIcon",
	...Template(SnowUIIcon.displayName as keyof typeof allIcons),
	args: {
		alt: SnowUIIcon.displayName as string,
	},
};

export const StarIconStory: Story = {
	name: "StarIcon",
	...Template(StarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: StarIcon.displayName as string,
	},
};

export const StopIconStory: Story = {
	name: "StopIcon",
	...Template(StopIcon.displayName as keyof typeof allIcons),
	args: {
		alt: StopIcon.displayName as string,
	},
};

export const TextAIconStory: Story = {
	name: "TextAIcon",
	...Template(TextAIcon.displayName as keyof typeof allIcons),
	args: {
		alt: TextAIcon.displayName as string,
	},
};

export const TXTIconStory: Story = {
	name: "TXTIcon",
	...Template(TXTIcon.displayName as keyof typeof allIcons),
	args: {
		alt: TXTIcon.displayName as string,
	},
};

export const VariablesIconStory: Story = {
	name: "VariablesIcon",
	...Template(VariablesIcon.displayName as keyof typeof allIcons),
	args: {
		alt: VariablesIcon.displayName as string,
	},
};

export const VerticalScreenIconStory: Story = {
	name: "VerticalScreenIcon",
	...Template(VerticalScreenIcon.displayName as keyof typeof allIcons),
	args: {
		alt: VerticalScreenIcon.displayName as string,
	},
};

export const WindowedIconStory: Story = {
	name: "WindowedIcon",
	...Template(WindowedIcon.displayName as keyof typeof allIcons),
	args: {
		alt: WindowedIcon.displayName as string,
	},
};

export const XCircleIconStory: Story = {
	name: "XCircleIcon",
	...Template(XCircleIcon.displayName as keyof typeof allIcons),
	args: {
		alt: XCircleIcon.displayName as string,
	},
};

export const XLSXIconStory: Story = {
	name: "XLSXIcon",
	...Template(XLSXIcon.displayName as keyof typeof allIcons),
	args: {
		alt: XLSXIcon.displayName as string,
	},
};
