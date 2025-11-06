interface MessageBubbleProps {
  content: string
  isSent: boolean
  senderName: string
  senderUsername?: string
  senderAvatar?: string | null
  timestamp: string
}

function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  // Generate a consistent color based on the name
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function MessageBubble({
  content,
  isSent,
  senderName,
  senderUsername,
  senderAvatar,
  timestamp,
}: MessageBubbleProps) {
  const date = new Date(timestamp)
  const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const initials = getInitials(senderName)
  const avatarColor = getAvatarColor(senderName)

  return (
    <div className={`flex gap-3 ${isSent ? "justify-end" : "justify-start"} items-end`}>
      {!isSent && (
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-md`}
            >
              {initials}
            </div>
          )}
        </div>
      )}
      <div className={`flex flex-col ${isSent ? "items-end" : "items-start"} max-w-xs`}>
        {!isSent && (
          <div className="flex items-center gap-1 mb-1 px-1">
            <p className="text-xs font-semibold text-neutral-700">{senderName}</p>
            {senderUsername && senderUsername !== senderName && (
              <p className="text-xs text-neutral-500">@{senderUsername}</p>
            )}
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isSent
              ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md"
              : "bg-white text-neutral-900 border border-neutral-200/50 rounded-bl-md"
          }`}
        >
          <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{content}</p>
          <p className={`text-xs mt-1.5 ${isSent ? "text-white/70" : "text-neutral-500"}`}>{formattedTime}</p>
        </div>
      </div>
      {isSent && (
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-md`}
            >
              {initials}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
