export const focusById = (id: string) => {
  const el = document.getElementById(id) as HTMLElement | null
  el?.focus()
}
