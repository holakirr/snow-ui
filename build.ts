import { type BuildOptions, build } from 'esbuild'
import { readdirSync, statSync } from 'node:fs'
import { type CompilerOptions, createProgram, ModuleKind } from 'typescript'

async function buildLib(path: string) {
  const paths = readdirSync(path)
  const dist = `dist/${path}`

  const cjsConfig: BuildOptions = {
    bundle: false,
    format: 'cjs',
    target: 'es2020',
    outdir: dist.replace('src', 'cjs'),
    minify: true,
  }

  const esmConfig: BuildOptions = {
    ...cjsConfig,
    outdir: dist.replace('src', 'esm'),
    format: 'esm',
  }

  for (const fileName of paths) {
    const pathName = `${path}/${fileName}`

    const pathStat = statSync(pathName)

    if (pathStat.isDirectory()) {
      if (fileName.includes('test')) {
        continue
      }

      await buildLib(pathName)
    } else if (pathStat.isFile()) {
      if (
        fileName.includes('test') ||
        fileName.includes('stories') ||
        fileName.includes('.d.') ||
        fileName.includes('tsconfig.') ||
        fileName.includes('.css') ||
        fileName.startsWith('.DS_Store')
      ) {
        continue
      }

      await build({
        ...cjsConfig,
        entryPoints: [pathName],
      })
      await build({
        ...esmConfig,
        entryPoints: [pathName],
      })

      console.log(`Built ${pathName}`)
    }
  }
}

async function generateIndexDts() {
  // Функция для генерации главного index.d.ts для каждого формата
  const generateDtsForFormat = (format: 'cjs' | 'esm') => {
    const outDir = format === 'cjs' ? 'dist/cjs' : 'dist/esm'
    const moduleKind =
      format === 'cjs' ? ModuleKind.CommonJS : ModuleKind.ESNext

    const compilerOptions: CompilerOptions = {
      target: 7, // ES2020
      module: moduleKind,
      moduleResolution: 2, // Node
      declaration: true,
      emitDeclarationOnly: true,
      outDir,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      skipLibCheck: true,
      strict: true,
      baseUrl: '.',
      paths: {
        '*': ['src/*'],
      },
    }

    console.log(`Generating ${format} TypeScript declarations...`)
    const program = createProgram(['src/index.ts'], compilerOptions)
    const emitResult = program.emit()

    if (emitResult.emitSkipped || emitResult.diagnostics.length > 0) {
      console.error(`Failed to generate ${format} declarations`)
      emitResult.diagnostics.forEach((diagnostic) => {
        console.error(`Error: ${diagnostic.messageText}`)
      })
    } else {
      console.log(`✓ Generated ${format} declarations successfully`)
    }
  }

  // Генерируем декларации для обоих форматов
  generateDtsForFormat('cjs')
  generateDtsForFormat('esm')
}

async function main() {
  await buildLib('src')
  await generateIndexDts()
}

main()
