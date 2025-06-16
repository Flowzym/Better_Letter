const MISTRAL_API_KEY = 'OxzXVw0IZxKEtS567E110UlKazPNjol5';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export interface GenerateLetterRequest {
  cvContent: string;
  jobDescription: string;
  basePrompt: string;
  styles?: string[];
  stylePrompts?: {
    [key: string]: string;
  };
}

async function callMistralAPI(prompt: string): Promise<string> {
  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mistral API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateCoverLetter(request: GenerateLetterRequest): Promise<string> {
  let prompt = request.basePrompt;

  // Add style instructions if styles are selected
  if (request.styles && request.styles.length > 0 && request.stylePrompts) {
    const styleDescriptions = request.styles
      .map(style => request.stylePrompts?.[style] || style)
      .join(', ');
    
    prompt += `\n\nDas Bewerbungsschreiben soll in einem ${styleDescriptions} verfasst werden.`;
  }

  // Add CV and job description
  prompt += `\n\nLEBENSLAUF/PROFIL:\n${request.cvContent}`;
  prompt += `\n\nSTELLENANZEIGE:\n${request.jobDescription}`;

  try {
    return await callMistralAPI(prompt);
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw new Error('Fehler bei der Verbindung zur KI. Bitte versuchen Sie es erneut.');
  }
}

export async function editCoverLetter(currentContent: string, instruction: string): Promise<string> {
  const prompt = `${instruction}\n\n${currentContent}`;

  try {
    return await callMistralAPI(prompt);
  } catch (error) {
    console.error('Error editing cover letter:', error);
    throw new Error('Fehler bei der Verbindung zur KI. Bitte versuchen Sie es erneut.');
  }
}