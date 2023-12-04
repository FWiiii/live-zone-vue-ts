export const loading = ref<boolean>(false)
export function changeLoadingStatus(status: boolean) {
  loading.value = status
}
