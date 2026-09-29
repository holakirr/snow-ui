import { describe, expect, it } from 'vitest'
import {
  isDerivedKey,
  projectionKey,
  rangeKey,
  seriesData,
  solidKey,
  stackedKey,
} from './series-data'

const data = [
  { x: 'A', a: 10, b: 5 },
  { x: 'B', a: 20, b: null },
  { x: 'C', a: 30, b: 15 },
]
const keys = ['a', 'b']

describe('seriesData', () => {
  it('passes the data through when there is nothing to derive', () => {
    const result = seriesData(data, { keys, config: {}, xKey: 'x' })
    expect(result.rows).toBe(data)
    expect(result.dataKeys).toEqual({
      a: { solid: 'a', fill: 'a' },
      b: { solid: 'b', fill: 'b' },
    })
  })

  it('stacks each series on the ones before it, keeping gaps', () => {
    const lines = seriesData(data, {
      keys,
      config: {},
      xKey: 'x',
      stacked: true,
    })
    expect(
      lines.rows.map((row) => [row[stackedKey('a')], row[stackedKey('b')]]),
    ).toEqual([
      [10, 15],
      [20, null],
      [30, 45],
    ])
    expect(lines.dataKeys.b).toEqual({ solid: stackedKey('b'), fill: 'b' })
    // Areas get [bottom, top].
    const areas = seriesData(data, {
      keys,
      config: {},
      xKey: 'x',
      stacked: true,
      range: true,
    })
    expect(areas.rows[2]?.[rangeKey('b')]).toEqual([30, 45])
    expect(areas.rows[2]?.[stackedKey('b')]).toBe(45)
    expect(areas.rows[1]?.[rangeKey('b')]).toBeNull()
    expect(areas.dataKeys.b).toEqual({
      solid: stackedKey('b'),
      fill: rangeKey('b'),
    })
    // The original values stay for the tooltip and the table.
    expect(areas.rows[2]?.b).toBe(15)
  })

  it('splits non-dashed series at the projection, both copies sharing the junction', () => {
    const result = seriesData(data, {
      keys,
      config: { b: { dashed: true } },
      xKey: 'x',
      projectionFrom: 'B',
      stacked: true,
    })
    expect(result.dataKeys).toEqual({
      a: { solid: solidKey('a'), projection: projectionKey('a'), fill: 'a' },
      b: { solid: stackedKey('b'), fill: 'b' },
    })
    expect(
      result.rows.map((row) => [row[solidKey('a')], row[projectionKey('a')]]),
    ).toEqual([
      [10, null],
      [20, 20],
      [null, 30],
    ])
  })

  it('ignores a projection category that is not in the data', () => {
    const result = seriesData(data, {
      keys,
      config: {},
      xKey: 'x',
      projectionFrom: 'Z',
    })
    expect(result.rows).toBe(data)
  })

  it('recognises its derived keys', () => {
    expect(isDerivedKey(stackedKey('a'))).toBe(true)
    expect(isDerivedKey('a')).toBe(false)
    expect(isDerivedKey(undefined)).toBe(false)
  })
})
