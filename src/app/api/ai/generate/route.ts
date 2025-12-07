import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface GenerateRequest {
  type: 'title' | 'subtitle' | 'excerpt' | 'full';
  content?: string;
  title?: string;
  prompt?: string;
}

interface FullPostSchema {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
}

const PROMPTS = {
  title: (content: string) => `Based on this blog post content, generate a single compelling, SEO-friendly title. Maximum 60 characters. Return ONLY the title, nothing else.

Content:
${content}`,

  subtitle: (content: string, title: string) => `Based on this blog post title and content, generate a single subtitle that adds context and hooks the reader. Maximum 120 characters. Return ONLY the subtitle, nothing else.

Title: ${title}

Content:
${content}`,

  excerpt: (content: string, title: string) => `Based on this blog post, write a compelling excerpt for the listing page that makes readers want to read more. Maximum 200 characters. Return ONLY the excerpt, nothing else.

Title: ${title}

Content:
${content}`,

  full: (userPrompt: string) => `You are a blog post generator. Based on the user's prompt, generate a complete blog post.

USER PROMPT: ${userPrompt}

You MUST respond with a valid JSON object matching this exact schema:
{
  "title": "SEO-friendly title, max 60 characters",
  "subtitle": "Engaging subtitle that adds context, max 120 characters",
  "excerpt": "Compelling preview text for listings, max 200 characters",
  "content": "Full HTML blog post content with proper formatting using <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <table>, <thead>, <tbody>, <tr>, <th>, <td> tags. Make it comprehensive, well-structured, and engaging. Include multiple sections with headers."
}

IMPORTANT:
- The content should be rich HTML, not plain text
- Use proper heading hierarchy (h2 for main sections, h3 for subsections)
- Include bullet points or numbered lists where appropriate
- Use HTML tables for comparison data, pricing tables, or feature matrices when the prompt contains tabular data
- Tables should have proper structure: <table>, <thead> with <th> headers, <tbody> with <tr>/<td> for data
- Make the content informative and valuable to readers
- Respond ONLY with the JSON object, no additional text`,
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: 'DeepSeek API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body: GenerateRequest = await request.json();
    const { type, content, title, prompt: userPrompt } = body;

    if (type === 'full') {
      if (!userPrompt) {
        return NextResponse.json(
          { error: 'Prompt is required for full post generation' },
          { status: 400 }
        );
      }

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: PROMPTS.full(userPrompt),
            },
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('DeepSeek API error:', error);
        return NextResponse.json(
          { error: 'Failed to generate content' },
          { status: 500 }
        );
      }

      const data = await response.json();
      let generatedText = data.choices?.[0]?.message?.content?.trim() || '';

      console.log('DeepSeek raw response:', generatedText);

      // Remove markdown code blocks if present
      if (generatedText.includes('```json')) {
        generatedText = generatedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (generatedText.includes('```')) {
        generatedText = generatedText.replace(/```\s*/g, '');
      }

      try {
        // Try to find JSON by looking for opening brace and parsing from there
        const startIndex = generatedText.indexOf('{');
        if (startIndex === -1) {
          throw new Error('No JSON found in response');
        }

        // Find the matching closing brace by counting braces
        let braceCount = 0;
        let endIndex = -1;
        for (let i = startIndex; i < generatedText.length; i++) {
          if (generatedText[i] === '{') braceCount++;
          if (generatedText[i] === '}') braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }

        if (endIndex === -1) {
          throw new Error('Incomplete JSON in response');
        }

        const jsonString = generatedText.substring(startIndex, endIndex);
        const parsed: FullPostSchema = JSON.parse(jsonString);

        console.log('Parsed post:', {
          title: parsed.title,
          subtitle: parsed.subtitle,
          excerpt: parsed.excerpt,
          contentLength: parsed.content?.length || 0,
        });

        return NextResponse.json({ post: parsed });
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', generatedText);
        console.error('Parse error:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse generated content' },
          { status: 500 }
        );
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    if ((type === 'subtitle' || type === 'excerpt') && !title) {
      return NextResponse.json(
        { error: 'Title is required for subtitle and excerpt generation' },
        { status: 400 }
      );
    }

    const plainContent = stripHtml(content);

    let prompt: string;
    switch (type) {
      case 'title':
        prompt = PROMPTS.title(plainContent);
        break;
      case 'subtitle':
        prompt = PROMPTS.subtitle(plainContent, title!);
        break;
      case 'excerpt':
        prompt = PROMPTS.excerpt(plainContent, title!);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be title, subtitle, excerpt, or full' },
          { status: 400 }
        );
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
