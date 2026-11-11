const origin = 'https://registry.snow-ui.holakirr.com'
const itemName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

type Entry = { name: string; meta?: { commit?: string; version?: string } }

export async function verifyPublicRegistry(sha: string, version: string) {
  const get = async (name: string) => {
    const response = await fetch(`${origin}/r/${name}.json`, {
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    })
    if (
      !response.ok ||
      !response.headers.get('content-type')?.startsWith('application/json')
    )
      throw new Error(`Public registry HTTP ${response.status}: ${name}`)
    return response.json()
  }
  const catalog = (await get('registry')) as { items?: Entry[] }
  const items = catalog.items
  const matches = (item: Entry) =>
    item.meta?.commit === sha && item.meta.version === version
  if (
    !Array.isArray(items) ||
    !items.some((item) => item.name === 'button') ||
    new Set(items.map((item) => item.name)).size !== items.length ||
    !items.every((item) => itemName.test(item.name) && matches(item))
  ) {
    throw new Error('Public registry catalog does not match the site release')
  }
  const button = (await get('button')) as Entry
  if (button.name !== 'button' || !matches(button))
    throw new Error('Public registry Button does not match the site release')
}
