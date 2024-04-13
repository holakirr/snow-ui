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
	Avatar,
	ClipboardIcon,
	CloseIcon,
	CopyIcon,
	DefaultIcon,
	DocXIcon,
	DotIcon,
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
	TextAIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
} from "@components";
import type { Meta, StoryObj } from "@storybook/react";
import { imageSrcMocks, weightControl } from "@utils";

export const iconControl = {
	control: "radio",
	options: [
		"Nothing",
		ArrowLineDownIcon.displayName,
		DefaultIcon.displayName,
		FourLeafCloverIcon.displayName,
	],
	mapping: {
		ArrowLineDownIcon,
		DefaultIcon,
		FourLeafCloverIcon,
		Nothing: undefined,
	},
};

export const imageMocks = {
	woman: <img alt="woman" width={24} height={24} src={imageSrcMocks.woman} />,
	flowerIcon: <FourLeafCloverIcon size={16} alt="flower icon" />,
	avatar: <Avatar img={imageSrcMocks.man} username="" />,
};

export const imageControl = {
	control: "radio",
	options: ["woman", "flowerIcon", "avatar", "Nothing"],
	mapping: {
		...imageMocks,
		Nothing: null,
	},
};

const allIcons = [
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
	TextAIcon,
	VariablesIcon,
	VerticalScreenIcon,
	WindowedIcon,
	XCircleIcon,
	XLSXIcon,
];

const meta = {
	title: "Design resources/Icons/All Icons",
	component: () => <div />,
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
	render: ({ ...args }) => (
		<div className="grid w-max grid-cols-4 gap-5 text-sm">
			{allIcons.map((Icon) => (
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultIconStory: Story = {
	args: {},
};
