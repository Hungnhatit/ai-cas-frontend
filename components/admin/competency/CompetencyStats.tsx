import { Criteria } from "@/types/interfaces/model"

interface CompetencyStatsProps {
  criteria: Criteria[]
}

export function CompetencyStats({ criteria }: CompetencyStatsProps) {
  const avgCriteriaLength = Math.round(
    criteria.reduce((sum, c) => sum + (c.mo_ta?.length || 0), 0) / criteria.length,
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Total Criteria</p>
        <p className="text-2xl font-bold">{criteria.length}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Avg Description</p>
        <p className="text-2xl font-bold">{avgCriteriaLength}</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Coverage</p>
        <p className="text-2xl font-bold">100%</p>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Status</p>
        <p className="text-2xl font-bold">Active</p>
      </div>
    </div>
  )
}
