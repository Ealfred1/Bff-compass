interface MessageBubbleProps {
  content: string
  isSent: boolean
  senderName: string
  timestamp: string
}

export function MessageBubble({ content, isSent, senderName, timestamp }: MessageBubbleProps) {
  const date = new Date(timestamp)
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded border ${
          isSent ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"
        }`}
      >
        {!isSent && <p className="text-xs font-medium mb-1 opacity-70">{senderName}</p>}
        <p className="text-sm break-words">{content}</p>
        <p className={`text-xs mt-1 ${isSent ? "opacity-70" : "text-muted-foreground"}`}>{formattedTime}</p>
      </div>
    </div>
  )
}
