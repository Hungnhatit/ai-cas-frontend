import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { Criteria } from "@/types/interfaces/model"

interface CriteriaCardProps {
  criterion: Criteria
  index: number
}

export function CriteriaCard({ criterion, index }: CriteriaCardProps) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              {index}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-base leading-tight">{criterion.competency_tent}</h3>
              <Badge variant="secondary" className="flex-shrink-0">
                Criterion
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{criterion.mo_ta}</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 className="h-3 w-3" />
                ID: {criterion.criterion_ma_framework}
              </div>
              <div className="text-muted-foreground">
                Added {new Date(criterion.ngay_tao).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
