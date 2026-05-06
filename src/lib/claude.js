import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a world-class viral content strategist with deep expertise in TikTok, Instagram Reels, YouTube Shorts, and X (Twitter) algorithms.
Analyze the provided content image and return ONLY valid JSON with no markdown, no preamble, no trailing text:
{
  "virality_score": int (0-100),
  "hook_score": int (0-100),
  "pacing_score": int (0-100),
  "thumbnail_score": int (0-100),
  "caption_score": int (0-100),
  "hook_formula": string (e.g. "Question Hook", "Shock Hook", "Story Hook", "Pattern Interrupt", "Curiosity Gap"),
  "hook_insight": string (2-3 sentences about the hook strength),
  "hook_rewrites": [string, string, string],
  "pacing_insight": string (2-3 sentences about visual pacing),
  "thumbnail_insight": string (2-3 sentences about thumbnail/visual appeal),
  "caption_insight": string (2-3 sentences about caption effectiveness),
  "wins": [string, string, string],
  "fixes": [string, string, string],
  "optimized_caption": string (rewritten, platform-optimized caption under 150 chars),
  "hashtags": [{"tag": string, "type": "trending|niche|evergreen"}, ... (12-15 total)],
  "audio_suggestions": [{"name": string, "genre": string, "vibe": string}, {"name": string, "genre": string, "vibe": string}, {"name": string, "genre": string, "vibe": string}],
  "competitors": [{"name": "Top 1% Creators", "score": 94}, {"name": "Viral Threshold", "score": 70}, {"name": "Niche Average", "score": 55}, {"name": "Platform Average", "score": 42}]
}`

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function analyzeContent({ base64Image, mediaType, caption = '', platform = 'TikTok', isRewrite = false }) {
  const userMessage = isRewrite
    ? `Platform: ${platform}\nCaption: "${caption}"\n\nThis content needs a full rewrite strategy. Be especially critical and provide highly specific, actionable scores and feedback. Analyze the visual content deeply.`
    : `Platform: ${platform}\nCaption: "${caption}"\n\nAnalyze this content for virality on ${platform}. Be precise and honest with scores.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: userMessage,
          },
        ],
      },
    ],
  })

  const text = response.content[0].text.trim()
  // Strip markdown if present
  const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(cleaned)
}
