import { Card, CardContent } from "@/components/ui/card"

interface BadgeCardProps {
  name: string
  description: string
  icon: string
  earned: boolean
}

export function BadgeCard({ name, description, icon, earned }: BadgeCardProps) {
  return (
    <Card className={`border-border transition-opacity ${earned ? "" : "opacity-50"}`}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        {earned && <span className="text-xs font-medium text-primary">Earned</span>}
        {!earned && <span className="text-xs text-muted-foreground">Locked</span>}
      </CardContent>
    </Card>
  )
}
