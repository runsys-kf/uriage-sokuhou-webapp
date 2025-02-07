interface StoreStatsProps {
  stats: {
    totalSeats: number
    activeSeats: number
    activeRate: string
    stoppedSeats: number
    stoppedRate: string
    under18: number
  }
}

export default function StoreStats({ stats }: StoreStatsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-wrap gap-4 text-sm">
        <span>座席数：{stats.totalSeats}</span>
        <span>稼働数：{stats.activeSeats}</span>
        <span>稼働率：{stats.activeRate}</span>
        <span>（停止数：{stats.stoppedSeats}</span>
        <span>停止率：{stats.stoppedRate}）</span>
        <span>※18未満：{stats.under18}</span>
      </div>
    </div>
  )
}

