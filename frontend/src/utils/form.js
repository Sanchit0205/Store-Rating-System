export function readForm(form) {
  return Object.fromEntries(new FormData(form).entries())
}
