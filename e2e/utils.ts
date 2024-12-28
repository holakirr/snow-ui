import { STORYBOOK_THEME_PARAM, STORYBOOK_URL } from './constants'

interface GetStoryUrlProps {
  theme: 'light' | 'dark'
  type: 'components'
  component: string
  variant: string
}

// @example http://localhost:53741/iframe.html?globals=theme:light&args=&id=components-button--all-sizes
export const getStoryUrl = ({
  theme,
  type,
  component,
  variant,
}: GetStoryUrlProps) =>
  `${STORYBOOK_URL}?${STORYBOOK_THEME_PARAM}=theme:${theme}&args=&id=${type}-${component}--${variant}`
