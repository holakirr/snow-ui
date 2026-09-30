/**
 * The release that added a component, by registry item: its usage page says
 * "Added in @holakirr/snow-ui X.Y" above the install block (InstallTabs),
 * so a reader on an older version knows why the import fails. Components
 * from 5.0 and before have no entry. When a minor adds a component, add its
 * item here (the name is in packages/registry/manifest.json).
 */
export const addedIn: Readonly<Record<string, string>> = {
  alert: '5.1',
  'alert-dialog': '5.1',
  combobox: '5.1',
  'multi-select': '5.1',
  'date-picker': '5.1',
  'date-range-picker': '5.1',
  progress: '5.1',
  'progress-circle': '5.1',
  spinner: '5.1',
  'theme-scope': '5.1',
  chip: '5.1',
  'text-strip': '5.1',
  image: '5.1',
  'list-card': '5.1',
}
