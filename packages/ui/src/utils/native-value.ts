/**
 * Sets an input's value the way the browser does when the user edits it: the
 * native setter, then a bubbling `input` event. React's `onChange` fires for
 * both controlled and uncontrolled inputs, and so does every listener of the
 * field (react-hook-form's `register`, a `<form onInput>`). A controlled
 * input whose owner ignores the change gets its value back from React.
 */
export const setNativeValue = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}
