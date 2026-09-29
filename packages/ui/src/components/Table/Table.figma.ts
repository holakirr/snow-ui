// url=https://www.figma.com/design/ZiRnYjr5N29yTkcIXihZUx/?node-id=25596-130955
// source=https://github.com/holakirr/snow-ui/blob/main/packages/ui/src/components/Table/Table.tsx
// component=Table
import figma from 'figma'
import { uiImport } from '../../code-connect/helpers'

// The kit has no Table component set: "Table is not a complete component,
// but consists of many instances" (the Figma Table page, which this URL
// points to). Code Connect only publishes to components, so re-point the URL
// to the table component you use (e.g. the "Table title" header cell) before
// publishing; see CONTRIBUTING.md, "Figma Code Connect".

export default {
  example: figma.tsx`<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortDirection="asc" onSort={sortByName}>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Row</TableCell>
      <TableCell>Complete</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  imports: [
    uiImport(
      'Table',
      'TableBody',
      'TableCell',
      'TableHead',
      'TableHeader',
      'TableRow',
    ),
  ],
  id: 'Table',
  metadata: { nestable: false },
}
