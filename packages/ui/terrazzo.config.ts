import { defineConfig } from '@terrazzo/cli'
import snowUI from './scripts/terrazzo-plugin-snow-ui.ts'

// `bun run tokens`: the DTCG tokens in tokens/ (the resolver lists the files
// and the light/dark modes) → the generated files in src/. See
// CONTRIBUTING.md#design-tokens.
export default defineConfig({
  tokens: ['./tokens/snow-ui.resolver.json'],
  outDir: './src/',
  // Keep the order of the token files (it is the order of the CSS output).
  alphabetize: false,
  plugins: [
    snowUI({
      css: 'styles/tokens.generated.css',
      ts: 'foundations/tokens.generated.ts',
      scales: 'utils/token-scales.generated.ts',
    }),
  ],
})
