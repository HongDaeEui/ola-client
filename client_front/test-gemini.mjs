import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

process.env.GOOGLE_GENERATIVE_AI_API_KEY="AQ.Ab8RN6LgACrRKr25DQSKQnDFUYJQXjH1CydqAPdMJOFPpzaaKA";

async function main() {
  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'hello',
    });
    console.log('Success:', text);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
