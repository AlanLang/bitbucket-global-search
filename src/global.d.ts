declare let AJS: {
  dialog2: (key: string) => {
    show: () => void
    hide: () => void
    remove: () => void
  }
  $: (key: string) => {
    click: (e?: any) => void
    text: (text: string) => void
  }
}
