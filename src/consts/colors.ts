export const COLOR_SCHEME = {
	black: {
		5: "rgba(var(--color-black-5))",
		10: "rgba(var(--color-black-10))",
		20: "rgba(var(--color-black-20))",
		40: "rgba(var(--color-black-40))",
		80: "rgba(var(--color-black-80))",
		100: "rgba(var(--color-black-100))",
	},
	white: {
		5: "rgba(var(--color-white-5))",
		10: "rgba(var(--color-white-10))",
		20: "rgba(var(--color-white-20))",
		40: "rgba(var(--color-white-40))",
		80: "rgba(var(--color-white-80))",
		100: "rgba(var(--color-white-100))",
	},
	primary: {
		brand: {
			DEFAULT: "rgba(var(--color-primary-brand))",
			hover: "rgba(var(--color-primary-brand-hover))",
		},
		blue: "rgba(var(--color-primary-blue))",
		purple: {
			DEFAULT: "rgba(var(--color-primary-purple))",
			50: "rgba(var(--color-primary-purple-50))",
		},
		light: "rgba(var(--color-primary-light))",
		background: "rgba(var(--color-primary-background))",
	},
	secondary: {
		indigo: "rgba(var(--color-secondary-indigo))",
		purple: "rgba(var(--color-secondary-purple))",
		cyan: "rgba(var(--color-secondary-cyan))",
		blue: "rgba(var(--color-secondary-blue))",
		green: "rgba(var(--color-secondary-green))",
		mint: "rgba(var(--color-secondary-mint))",
		yellow: "rgba(var(--color-secondary-yellow))",
		orange: "rgba(var(--color-secondary-orange))",
		red: "rgba(var(--color-secondary-red))",
	},
} as const;
