const SYSTEM_PROMPT = `You are a world-class viral content strategist with deep expertise in TikTok, Instagram Reels, YouTube Shorts, and X (Twitter) algorithms.
Analyze the provided content image and return ONLY valid JSON with no markdown, no preamble, no trailing text:
{
  "virality_score": int (0-100),
  "hook_score": int (0-100),
  "pacing_score": int (0-100),
  "thumbnail_score": int (0-100),
  "caption_score": int (0-100),
  "hook_formula": "Question Hook" or "Shock Hook" or "Story Hook" or "Pattern Interrupt" or "Curiosity Gap",
  "hook_insight": "2-3 sentences about the hook strength",
  "hook_rewrites": ["rewrite 1", "rewrite 2", "rewrite 3"],
  "pacing_insight": "2-3 sentences about visual pacing",
  "thumbnail_insight": "2-3 sentences about thumbnail/visual appeal",
  "caption_insight": "2-3 sentences about caption effectiveness",
  "wins": ["win 1", "win 2", "win 3"],
  "fixes": ["fix 1", "fix 2", "fix 3"],
  "optimized_caption": "rewritten platform-optimized caption under 150 chars",
  "hashtags": [{"tag": "hashtag", "type": "trending"}, {"tag": "hashtag2", "type": "niche"}, {"tag": "hashtag3", "type": "evergreen"}],
  "audio_suggestions": [{"name": "song name", "genre": "genre", "vibe": "Energetic"}, {"name": "song 2", "genre": "genre", "vibe": "Chill"}, {"name": "song 3", "genre": "genre", "vibe": "Hype"}],
  "competitors": [{"name": "Top 1% Creators", "score": 94}, {"name": "Viral Threshold", "score": 70}, {"name": "Niche Average", "score": 55}, {"name": "Platform Average", "score": 42}]
}
Return 12-15 hashtags total with a mix of trending, niche, and evergreen types.`

const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'

export async function analyzeContent({ base64Image, mediaType, caption = '', platform = 'TikTok', isRewrite = false }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  const userText = isRewrite
    ? `Platform: ${platform}\nCaption: "${caption}"\n\nThis content needs a full rewrite strategy. Be especially critical and provide highly specific, actionable scores and feedback. Analyze the visual content deeply.`
    : `Platform: ${platform}\nCaption: "${caption}"\n\nAnalyze this content for virality on ${platform}. Be precise and honest with scores. Return ONLY the JSON object, nothing else.`

  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mediaType};base64,${base64Image}`,
              },
            },
            {
              type: 'text',
              text: userText,
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Groq API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content?.trim() || ''

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(cleaned)
}
