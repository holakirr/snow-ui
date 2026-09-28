import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ICON_SIZES, ICON_WEIGHTS } from './constants'
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
} from './ssr'

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
}

const meta = {
  title: 'Icons',
  argTypes: {
    weight: {
      control: 'radio',
      options: Object.values(ICON_WEIGHTS),
      description: 'The weight of the icon',
    },
    size: {
      control: 'select',
      options: Object.keys(ICON_SIZES),
    },
  },
  args: {},
  render: (args) => (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: '2.5rem',
      }}
    >
      {Object.entries(allIcons).map(([name, Icon]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Icon {...args} alt={`Icon ${name}`} />
          <span className="text-sm text-neutral-900">{name}</span>
        </div>
      ))}
    </div>
  ),
} satisfies Meta<typeof AddIcon>

export default meta
type Story = StoryObj<typeof meta>

export const AllIcons: Story = {
  args: {
    alt: 'Icons',
  },
}

const Template: (iconName: keyof typeof allIcons) => Story = (iconName) => ({
  args: {
    alt: iconName,
  },
  render: (args) => {
    const Icon = allIcons[iconName]

    return (
      Icon && (
        <div className="flex gap-8">
          {Object.values(ICON_WEIGHTS).map((weight) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              key={weight}
            >
              <Icon
                {...args}
                weight={weight}
                alt={`Icon ${iconName}, weight ${weight}`}
              />
              <span className="w-min text-sm text-neutral-900">{weight}</span>
            </div>
          ))}
        </div>
      )
    )
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const icons = canvas.getAllByRole('img')

    expect(icons[0]).toHaveTextContent(`Icon ${iconName}, weight bold`)
    expect(icons).toHaveLength(Object.keys(ICON_WEIGHTS).length)
  },
})

export const AddIconStory: Story = {
  name: 'AddIcon',
  ...Template('AddIcon'),
  args: {},
}

export const AIIconStory: Story = {
  name: 'AIIcon',
  ...Template('AIIcon'),
}

export const ArrowFallIconStory: Story = {
  name: 'ArrowFallIcon',
  ...Template('ArrowFallIcon'),
}

export const ArrowLineDownIconStory: Story = {
  name: 'ArrowLineDownIcon',
  ...Template('ArrowLineDownIcon'),
}

export const ArrowLineLeftIconStory: Story = {
  name: 'ArrowLineLeftIcon',
  ...Template('ArrowLineLeftIcon'),
}

export const ArrowLineRightIconStory: Story = {
  name: 'ArrowLineRightIcon',
  ...Template('ArrowLineRightIcon'),
}

export const ArrowLineUpDownIconStory: Story = {
  name: 'ArrowLineUpDownIcon',
  ...Template('ArrowLineUpDownIcon'),
}

export const ArrowLineUpIconStory: Story = {
  name: 'ArrowLineUpIcon',
  ...Template('ArrowLineUpIcon'),
}

export const ArrowRightIconStory: Story = {
  name: 'ArrowRightIcon',
  ...Template('ArrowRightIcon'),
}

export const ArrowRiseIconStory: Story = {
  name: 'ArrowRiseIcon',
  ...Template('ArrowRiseIcon'),
}

export const ArrowsDownIconStory: Story = {
  name: 'ArrowsDownIcon',
  ...Template('ArrowsDownIcon'),
}

export const ArrowsDownUpIconStory: Story = {
  name: 'ArrowsDownUpIcon',
  ...Template('ArrowsDownUpIcon'),
}

export const ArrowsUpIconStory: Story = {
  name: 'ArrowsUpIcon',
  ...Template('ArrowsUpIcon'),
}

export const ClipboardIconStory: Story = {
  name: 'ClipboardIcon',
  ...Template('ClipboardIcon'),
}

export const CloseIconStory: Story = {
  name: 'CloseIcon',
  ...Template('CloseIcon'),
}

export const CopyIconStory: Story = {
  name: 'CopyIcon',
  ...Template('CopyIcon'),
}

export const DefaultIconStory: Story = {
  name: 'DefaultIcon',
  ...Template('DefaultIcon'),
}

export const DocXIconStory: Story = {
  name: 'DocXIcon',
  ...Template('DocXIcon'),
}

export const DotIconStory: Story = {
  name: 'DotIcon',
  ...Template('DotIcon'),
}

export const DotsThreeOutlineHorizontalIconStory: Story = {
  name: 'DotsThreeOutlineHorizontalIcon',
  ...Template('DotsThreeOutlineHorizontalIcon'),
}

export const ExplainIconStory: Story = {
  name: 'ExplainIcon',
  ...Template('ExplainIcon'),
}

export const FormIconStory: Story = {
  name: 'FormIcon',
  ...Template('FormIcon'),
}

export const FourLeafCloverIconStory: Story = {
  name: 'FourLeafCloverIcon',
  ...Template('FourLeafCloverIcon'),
}

export const FourPointedStarIconStory: Story = {
  name: 'FourPointedStarIcon',
  ...Template('FourPointedStarIcon'),
}

export const GotoIconStory: Story = {
  name: 'GotoIcon',
  ...Template('GotoIcon'),
}

export const HelpIconStory: Story = {
  name: 'HelpIcon',
  ...Template('HelpIcon'),
}

export const HorizontalScreenIconStory: Story = {
  name: 'HorizontalScreenIcon',
  ...Template('HorizontalScreenIcon'),
}

export const LineIconStory: Story = {
  name: 'LineIcon',
  ...Template('LineIcon'),
}

export const LoadingAIconStory: Story = {
  name: 'LoadingAIcon',
  ...Template('LoadingAIcon'),
}

export const LoadingBIconStory: Story = {
  name: 'LoadingBIcon',
  ...Template('LoadingBIcon'),
}

export const MaximizeIconStory: Story = {
  name: 'MaximizeIcon',
  ...Template('MaximizeIcon'),
}

export const MinimizeIconStory: Story = {
  name: 'MinimizeIcon',
  ...Template('MinimizeIcon'),
}

export const NotepadIconStory: Story = {
  name: 'NotepadIcon',
  ...Template('NotepadIcon'),
}

export const OneNoteIconStory: Story = {
  name: 'OneNoteIcon',
  ...Template('OneNoteIcon'),
}

export const PPTIconStory: Story = {
  name: 'PPTIcon',
  ...Template('PPTIcon'),
}

export const RectangleIconStory: Story = {
  name: 'RectangleIcon',
  ...Template('RectangleIcon'),
}

export const RightbarIconStory: Story = {
  name: 'RightbarIcon',
  ...Template('RightBarIcon'),
}

export const RoundedCornerIconStory: Story = {
  name: 'RoundedCornerIcon',
  ...Template('RoundedCornerIcon'),
}

export const SearchIconStory: Story = {
  name: 'SearchIcon',
  ...Template('SearchIcon'),
}

export const SnowUIIconStory: Story = {
  name: 'SnowUIIcon',
  ...Template('SnowUIIcon'),
}

export const StarIconStory: Story = {
  name: 'StarIcon',
  ...Template('StarIcon'),
}

export const StopIconStory: Story = {
  name: 'StopIcon',
  ...Template('StopIcon'),
}

export const TextAIconStory: Story = {
  name: 'TextAIcon',
  ...Template('TextAIcon'),
}

export const TXTIconStory: Story = {
  name: 'TXTIcon',
  ...Template('TXTIcon'),
}

export const VariablesIconStory: Story = {
  name: 'VariablesIcon',
  ...Template('VariablesIcon'),
}

export const VerticalScreenIconStory: Story = {
  name: 'VerticalScreenIcon',
  ...Template('VerticalScreenIcon'),
}

export const WindowedIconStory: Story = {
  name: 'WindowedIcon',
  ...Template('WindowedIcon'),
}

export const XCircleIconStory: Story = {
  name: 'XCircleIcon',
  ...Template('XCircleIcon'),
}

export const XLSXIconStory: Story = {
  name: 'XLSXIcon',
  ...Template('XLSXIcon'),
}
