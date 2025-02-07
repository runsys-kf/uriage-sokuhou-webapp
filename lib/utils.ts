export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ja-JP").format(num)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, "0")}時間 ${String(mins).padStart(2, "0")}分`
}

