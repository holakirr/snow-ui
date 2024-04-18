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
	TXTIcon,
	Text,
	TextAIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
} from "@components";
import { ICON_WEIGHTS } from "@consts";
import type { IconWeight } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { weightControl } from "./mocks";

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
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		weight: weightControl,
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: {
		size: 24,
		weight: "regular",
		className: "fill-primary-brand",
	},
	render: (args) => (
		<div className="grid w-max grid-cols-4 gap-5 text-sm">
			{Object.values(allIcons).map((Icon) => (
				<div
					className="grid gap-1 justify-center justify-items-center"
					key={Icon.displayName}
				>
					<Icon {...args} alt="Icon.displayName" />
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
							<Icon {...args} weight={weight} />
							<Text size={12} className="text-black-100 w-min">
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
		const icons = canvas.getAllByTitle(iconName);

		expect(icons).toHaveLength(Object.keys(ICON_WEIGHTS).length);
	},
});

export const AddIconStory: Story = {
	...Template(AddIcon.displayName as keyof typeof allIcons),
	args: {
		alt: AddIcon.displayName as string,
	},
};

export const AIIconStory: Story = {
	...Template(AIIcon.displayName as keyof typeof allIcons),
	args: {
		alt: AIIcon.displayName as string,
	},
};

export const ArrowFallIconStory: Story = {
	...Template(ArrowFallIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowFallIcon.displayName as string,
	},
};

export const ArrowLineDownIconStory: Story = {
	...Template(ArrowLineDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineDownIcon.displayName as string,
	},
};

export const ArrowLineLeftIconStory: Story = {
	...Template(ArrowLineLeftIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineLeftIcon.displayName as string,
	},
};

export const ArrowLineRightIconStory: Story = {
	...Template(ArrowLineRightIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineRightIcon.displayName as string,
	},
};

export const ArrowLineUpDownIconStory: Story = {
	...Template(ArrowLineUpDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineUpDownIcon.displayName as string,
	},
};

export const ArrowLineUpIconStory: Story = {
	...Template(ArrowLineUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowLineUpIcon.displayName as string,
	},
};

export const ArrowRightIconStory: Story = {
	...Template(ArrowRightIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowRightIcon.displayName as string,
	},
};

export const ArrowRiseIconStory: Story = {
	...Template(ArrowRiseIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowRiseIcon.displayName as string,
	},
};

export const ArrowsDownIconStory: Story = {
	...Template(ArrowsDownIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsDownIcon.displayName as string,
	},
};

export const ArrowsDownUpIconStory: Story = {
	...Template(ArrowsDownUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsDownUpIcon.displayName as string,
	},
};

export const ArrowsUpIconStory: Story = {
	...Template(ArrowsUpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ArrowsUpIcon.displayName as string,
	},
};

export const ClipboardIconStory: Story = {
	...Template(ClipboardIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ClipboardIcon.displayName as string,
	},
};

export const CloseIconStory: Story = {
	...Template(CloseIcon.displayName as keyof typeof allIcons),
	args: {
		alt: CloseIcon.displayName as string,
	},
};

export const CopyIconStory: Story = {
	...Template(CopyIcon.displayName as keyof typeof allIcons),
	args: {
		alt: CopyIcon.displayName as string,
	},
};

export const DefaultIconStory: Story = {
	...Template(DefaultIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DefaultIcon.displayName as string,
	},
};

export const DocXIconStory: Story = {
	...Template(DocXIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DocXIcon.displayName as string,
	},
};

export const DotIconStory: Story = {
	...Template(DotIcon.displayName as keyof typeof allIcons),
	args: {
		alt: DotIcon.displayName as string,
	},
};

export const DotsThreeOutlineHorizontalIconStory: Story = {
	...Template(
		DotsThreeOutlineHorizontalIcon.displayName as keyof typeof allIcons,
	),
	args: {
		alt: DotsThreeOutlineHorizontalIcon.displayName as string,
	},
};

export const ExplainIconStory: Story = {
	...Template(ExplainIcon.displayName as keyof typeof allIcons),
	args: {
		alt: ExplainIcon.displayName as string,
	},
};

export const FormIconStory: Story = {
	...Template(FormIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FormIcon.displayName as string,
	},
};

export const FourLeafCloverIconStory: Story = {
	...Template(FourLeafCloverIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FourLeafCloverIcon.displayName as string,
	},
};

export const FourPointedStarIconStory: Story = {
	...Template(FourPointedStarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: FourPointedStarIcon.displayName as string,
	},
};

export const GotoIconStory: Story = {
	...Template(GotoIcon.displayName as keyof typeof allIcons),
	args: {
		alt: GotoIcon.displayName as string,
	},
};

export const HelpIconStory: Story = {
	...Template(HelpIcon.displayName as keyof typeof allIcons),
	args: {
		alt: HelpIcon.displayName as string,
	},
};

export const HorizontalScreenIconStory: Story = {
	...Template(HorizontalScreenIcon.displayName as keyof typeof allIcons),
	args: {
		alt: HorizontalScreenIcon.displayName as string,
	},
};

export const LineIconStory: Story = {
	...Template(LineIcon.displayName as keyof typeof allIcons),
	args: {
		alt: LineIcon.displayName as string,
	},
};

export const LoadingBIconStory: Story = {
	...Template(LoadingBIcon.displayName as keyof typeof allIcons),
	args: {
		alt: LoadingBIcon.displayName as string,
	},
};

export const MaximizeIconStory: Story = {
	...Template(MaximizeIcon.displayName as keyof typeof allIcons),
	args: {
		alt: MaximizeIcon.displayName as string,
	},
};

export const MinimizeIconStory: Story = {
	...Template(MinimizeIcon.displayName as keyof typeof allIcons),
	args: {
		alt: MinimizeIcon.displayName as string,
	},
};

export const NotepadIconStory: Story = {
	...Template(NotepadIcon.displayName as keyof typeof allIcons),
	args: {
		alt: NotepadIcon.displayName as string,
	},
};

export const OneNoteIconStory: Story = {
	...Template(OneNoteIcon.displayName as keyof typeof allIcons),
	args: {
		alt: OneNoteIcon.displayName as string,
	},
};

export const PPTIconStory: Story = {
	...Template(PPTIcon.displayName as keyof typeof allIcons),
	args: {
		alt: PPTIcon.displayName as string,
	},
};

export const RectangleIconStory: Story = {
	...Template(RectangleIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RectangleIcon.displayName as string,
	},
};

export const RightbarIconStory: Story = {
	...Template(RightbarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RightbarIcon.displayName as string,
	},
};

export const RoundedCornerIconStory: Story = {
	...Template(RoundedCornerIcon.displayName as keyof typeof allIcons),
	args: {
		alt: RoundedCornerIcon.displayName as string,
	},
};

export const SearchIconStory: Story = {
	...Template(SearchIcon.displayName as keyof typeof allIcons),
	args: {
		alt: SearchIcon.displayName as string,
	},
};

export const SnowUIIconStory: Story = {
	...Template(SnowUIIcon.displayName as keyof typeof allIcons),
	args: {
		alt: SnowUIIcon.displayName as string,
	},
};

export const StarIconStory: Story = {
	...Template(StarIcon.displayName as keyof typeof allIcons),
	args: {
		alt: StarIcon.displayName as string,
	},
};

export const StopIconStory: Story = {
	...Template(StopIcon.displayName as keyof typeof allIcons),
	args: {
		alt: StopIcon.displayName as string,
	},
};

export const TextAIconStory: Story = {
	...Template(TextAIcon.displayName as keyof typeof allIcons),
	args: {
		alt: TextAIcon.displayName as string,
	},
};

export const TXTIconStory: Story = {
	...Template(TXTIcon.displayName as keyof typeof allIcons),
	args: {
		alt: TXTIcon.displayName as string,
	},
};

export const VariablesIconStory: Story = {
	...Template(VariablesIcon.displayName as keyof typeof allIcons),
	args: {
		alt: VariablesIcon.displayName as string,
	},
};

export const VerticalScreenIconStory: Story = {
	...Template(VerticalScreenIcon.displayName as keyof typeof allIcons),
	args: {
		alt: VerticalScreenIcon.displayName as string,
	},
};

export const WindowedIconStory: Story = {
	...Template(WindowedIcon.displayName as keyof typeof allIcons),
	args: {
		alt: WindowedIcon.displayName as string,
	},
};

export const XCircleIconStory: Story = {
	...Template(XCircleIcon.displayName as keyof typeof allIcons),
	args: {
		alt: XCircleIcon.displayName as string,
	},
};

export const XLSXIconStory: Story = {
	...Template(XLSXIcon.displayName as keyof typeof allIcons),
	args: {
		alt: XLSXIcon.displayName as string,
	},
};
