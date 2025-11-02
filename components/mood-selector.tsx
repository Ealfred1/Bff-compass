"use client"

interface MoodSelectorProps {
  onSelect: (mood: number) => void
  selected?: number
}

const moods = [
  { value: 1, label: "Terrible", color: "text-red-600" },
  { value: 2, label: "Bad", color: "text-orange-600" },
  { value: 3, label: "Okay", color: "text-yellow-600" },
  { value: 4, label: "Good", color: "text-green-600" },
  { value: 5, label: "Great", color: "text-emerald-700" },
]

export function MoodSelector({ onSelect, selected }: MoodSelectorProps) {
  return (
    <div className="flex justify-between gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onSelect(mood.value)}
          className={`flex-1 py-4 px-2 rounded border transition-all ${
            selected === mood.value ? `border-primary bg-primary/10` : `border-border hover:border-primary/50 bg-card`
          }`}
        >
          <div className={`text-2xl mb-1 ${mood.color}`}>{["😢", "😞", "😐", "😊", "😄"][mood.value - 1]}</div>
          <p className="text-xs font-medium text-foreground">{mood.label}</p>
        </button>
      ))}
    </div>
  )
}
