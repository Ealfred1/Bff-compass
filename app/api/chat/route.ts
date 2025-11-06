import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Fetch user context
    const context = await getUserContext(supabase, user.id)

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context)

    // Prepare messages for AI
    const messages: ChatMessage[] = [
      { role: "assistant", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message },
    ]

    // Call OpenAI API (or fallback to a context-aware response)
    const response = await getAIResponse(messages, context)

    return NextResponse.json({ response })
  } catch (error: unknown) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

async function getUserContext(supabase: any, userId: string) {
  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, bio")
    .eq("id", userId)
    .single()

  // Get buddy group info
  const { data: groupMembership } = await supabase
    .from("buddy_group_members")
    .select(
      `
      role,
      buddy_groups(
        id,
        group_name,
        matching_criteria,
        created_at
      )
    `,
    )
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  let groupMembers: any[] = []
  if (groupMembership?.buddy_groups) {
    const { data: members } = await supabase
      .from("buddy_group_members")
      .select(
        `
        role,
        profiles(
          display_name,
          username,
          bio
        )
      `,
      )
      .eq("group_id", groupMembership.buddy_groups.id)

    groupMembers = members || []
  }

  // Get upcoming events
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, event_date, location, event_url")
    .eq("is_active", true)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(10)

  // Get user's earned badges
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select(
      `
      badges(
        id,
        name,
        description,
        icon
      )
    `,
    )
    .eq("user_id", userId)

  // Get all available badges
  const { data: allBadges } = await supabase.from("badges").select("id, name, description, criteria_type").limit(20)

  // Get user's assessments
  const { data: lonelinessAssessment } = await supabase
    .from("loneliness_assessments")
    .select("loneliness_category, total_score")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: leisureAssessment } = await supabase
    .from("leisure_assessments")
    .select("top_categories")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    profile,
    groupMembership,
    groupMembers,
    events: events || [],
    earnedBadges: earnedBadges?.map((eb: any) => eb.badges) || [],
    allBadges: allBadges || [],
    lonelinessCategory: lonelinessAssessment?.loneliness_category,
    leisureCategories: leisureAssessment?.top_categories || [],
  }
}

function buildSystemPrompt(context: any): string {
  const groupInfo = context.groupMembership?.buddy_groups
    ? `You are in a buddy group called "${context.groupMembership.buddy_groups.group_name || "Your Buddy Group"}". 
Your role: ${context.groupMembership.role}
Group members: ${context.groupMembers.map((m: any) => m.profiles?.display_name || "Unknown").join(", ")}
Matching criteria: ${JSON.stringify(context.groupMembership.buddy_groups.matching_criteria)}`
    : "You are not currently in a buddy group. You can find one by going to the Matches page."

  const eventsInfo =
    context.events.length > 0
      ? `Upcoming events:\n${context.events
          .map(
            (e: any) =>
              `- ${e.title}${e.event_date ? ` (${new Date(e.event_date).toLocaleDateString()})` : ""}${e.location ? ` at ${e.location}` : ""}${e.description ? `: ${e.description}` : ""}`,
          )
          .join("\n")}`
      : "No upcoming events at the moment."

  const badgesInfo = `Available badges (${context.allBadges.length} total):
${context.allBadges
  .map((b: any) => `- ${b.name}: ${b.description} (Earn by: ${b.criteria_type || "various activities"})`)
  .join("\n")}

Your earned badges: ${context.earnedBadges.length > 0 ? context.earnedBadges.map((b: any) => b.name).join(", ") : "None yet"}`

  return `You are a helpful AI assistant for BFF COMPASS, a social wellness platform that helps users combat loneliness through buddy groups, events, and achievements.

USER CONTEXT:
- Name: ${context.profile?.display_name || "User"}
- Username: ${context.profile?.username || "unknown"}
- Wellness Level: ${context.lonelinessCategory || "Not assessed"}
- Interests: ${context.leisureCategories.join(", ") || "Not assessed"}

${groupInfo}

${eventsInfo}

${badgesInfo}

CAPABILITIES:
1. **Events**: Answer questions about upcoming events, event details, locations, dates, and how to attend
2. **Connections**: Help users find people with similar interests, explain how matching works, and guide them to the Connections page
3. **Badges**: Explain how to earn badges, what badges are available, and show progress
4. **Buddy Group**: Answer questions about the user's current buddy group, members, matching criteria, and how to connect with them

GUIDELINES:
- Be friendly, supportive, and encouraging
- Provide specific, actionable information based on the user's context
- If asked about events, mention specific upcoming events from the list
- If asked about badges, explain the criteria and encourage the user
- If asked about connections, guide them to find similar users
- If asked about their buddy group, provide details about members and matching
- Keep responses concise but helpful
- Use emojis sparingly and appropriately
- If you don't know something, suggest where they can find the information

Remember: The goal is to help users feel connected and supported!`
}

async function getAIResponse(messages: ChatMessage[], context?: any): Promise<string> {
  // Check if OpenAI API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!openaiApiKey) {
    // Fallback: Context-aware rule-based responses
    const systemMessage = messages.find((m) => m.role === "assistant" && m.content.includes("USER CONTEXT"))
    return getFallbackResponse(
      messages[messages.length - 1].content,
      systemMessage ? { systemMessage: systemMessage.content } : context,
    )
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API error:", error)
      // Get context from system message if available
      const systemMessage = messages.find((m) => m.role === "assistant" && m.content.includes("USER CONTEXT"))
      return getFallbackResponse(messages[messages.length - 1].content, systemMessage ? { systemMessage: systemMessage.content } : undefined)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again."
  } catch (error) {
    console.error("OpenAI API request failed:", error)
    const systemMessage = messages.find((m) => m.role === "assistant" && m.content.includes("USER CONTEXT"))
    return getFallbackResponse(messages[messages.length - 1].content, systemMessage ? { systemMessage: systemMessage.content } : undefined)
  }
}

function getFallbackResponse(userMessage: string, context?: any): string {
  const lowerMessage = userMessage.toLowerCase()

  // Extract context info if available
  let eventsList = ""
  let groupInfo = ""
  let badgesInfo = ""

  if (context?.systemMessage) {
    const systemMsg = context.systemMessage
    // Extract events from context
    const eventsMatch = systemMsg.match(/Upcoming events:([\s\S]*?)(?=\n\n|$)/)
    if (eventsMatch) {
      eventsList = eventsMatch[1].trim()
    }

    // Extract group info
    const groupMatch = systemMsg.match(/You are in a buddy group([\s\S]*?)(?=\n\n|$)/)
    if (groupMatch) {
      groupInfo = groupMatch[0].trim()
    }

    // Extract badges info
    const badgesMatch = systemMsg.match(/Available badges([\s\S]*?)(?=\n\n|$)/)
    if (badgesMatch) {
      badgesInfo = badgesMatch[0].trim()
    }
  }

  if (lowerMessage.includes("event")) {
    if (eventsList) {
      return `Here are the upcoming events:\n\n${eventsList}\n\nYou can find more details and RSVP on the Events page in your dashboard!`
    }
    return "You can find upcoming events on the Events page! Check the Events page in your dashboard for full details, dates, and locations. You can also RSVP to events there!"
  }

  if (lowerMessage.includes("badge") || lowerMessage.includes("achievement")) {
    let response = "Badges are earned by completing various activities on the platform! You can earn badges by:\n\n• Attending events\n• Sending messages\n• Checking in with your mood\n• Making connections\n• Completing weekly streaks\n• Completing surveys\n\n"
    if (badgesInfo) {
      response += `${badgesInfo}\n\n`
    }
    response += "Check the Badges page to see all available badges and your progress!"
    return response
  }

  if (lowerMessage.includes("connect") || lowerMessage.includes("buddy") || lowerMessage.includes("group")) {
    if (groupInfo) {
      return `${groupInfo}\n\nYou can chat with your group members by going to the Messages page or clicking "Group Chat" on your buddy group card. You can also discover more people with similar interests on the Connections page!`
    }
    return "You can find and connect with people who share your interests! Your buddy group is matched based on your loneliness assessment and leisure interests. Check the Connections page to see your current group members and discover other users with similar interests. You can also go to the Matches page to find or create a new buddy group!"
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("what can you")) {
    return "I can help you with:\n\n• **Events**: Ask about upcoming events, dates, and locations\n• **Connections**: Learn about finding people with similar interests\n• **Badges**: Discover how to earn achievements\n• **Buddy Group**: Get info about your current group and members\n\nWhat would you like to know more about?"
  }

  if (lowerMessage.includes("who") && (lowerMessage.includes("group") || lowerMessage.includes("member"))) {
    if (groupInfo) {
      return `${groupInfo}\n\nYou can chat with your group members by going to the Messages page!`
    }
    return "You're not currently in a buddy group. You can find one by going to the Matches page and clicking 'Find My Buddy Group'!"
  }

  if (lowerMessage.includes("how") && lowerMessage.includes("earn")) {
    return "You can earn badges by:\n\n• **Attending events**: RSVP and attend events to earn event badges\n• **Sending messages**: Chat with your buddy group members\n• **Mood check-ins**: Track your mood regularly\n• **Making connections**: Join buddy groups and connect with others\n• **Weekly streaks**: Maintain consistent activity\n• **Completing surveys**: Finish your assessments\n\nCheck the Badges page to see all available badges and track your progress!"
  }

  return "I'm here to help! You can ask me about:\n\n• Events on the platform\n• Finding connections and buddy groups\n• How to earn badges\n• Your current buddy group\n\nWhat would you like to know?"
}

