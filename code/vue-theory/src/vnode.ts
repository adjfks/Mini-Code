export default function (
  sel: string,
  data: object,
  children: object[] | undefined,
  text: string | number | undefined,
  elm: HTMLElement | undefined
) {
  return {
    sel,
    data,
    children,
    text,
    elm,
  }
}
