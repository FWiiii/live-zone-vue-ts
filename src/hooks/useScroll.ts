function useScroll(el: Ref<HTMLElement | undefined>, cb: () => void): void {
  if (el.value === null)
    return
  const fn = async () => {
    const { scrollTop, scrollHeight, clientHeight } = el.value!
    const d = scrollHeight - scrollTop - clientHeight
    console.log(d)

    if (d < 1 && d > -1)
      await cb()
  }
  onMounted(() => {
    el.value.addEventListener('scroll', fn)
  })
  onBeforeUnmount(() => {
    el.value.removeEventListener('scroll', fn)
  })
}

export default useScroll
