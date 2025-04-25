import fetch from 'node-fetch';

export async function refineReviewWithAI(reviewText) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = `Improve the following book review for grammar, clarity, and tone.\n\nReview: "${reviewText}"\n\nRefined Review:`;
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that refines user-written book reviews for clarity, grammar, and tone.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 256,
    temperature: 0.7
  };
  // DEBUG LOGGING
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    console.log('OPENAI RAW RESPONSE:', text);
    if (!response.ok) {
      throw new Error('Failed to refine review with OpenAI: ' + text);
    }
    const data = JSON.parse(text);
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('OPENAI ERROR:', err);
    throw err;
  }
}
