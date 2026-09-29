/**
 * Stand-in for `figma`, the runtime module of the Code Connect templates,
 * which only exists inside Figma. Vitest resolves `figma` here
 * (vitest.config.ts) so the templates can load; `templates.test.ts` replaces
 * it with a fake selected instance (`vi.doMock('figma', …)`).
 */
const figma: unknown = new Proxy(
  {},
  {
    get: () => {
      throw new Error(
        'The `figma` module only exists in Figma: mock it with vi.doMock.',
      )
    },
  },
)

export default figma
