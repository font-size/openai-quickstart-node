import { Configuration, OpenAIApi } from "openai";
import logger from '../../log';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.question || '';
  const beforeMessage = req.body.beforeMessage || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter words",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(question, beforeMessage),
      max_tokens: 512,
      top_p: 1,
      frequency_penalty:0.0,
      presence_penalty:0.6,
      stop:[" Human:", " AI:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });

    const nowTime = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    const chatMessage = {
      nowTime,
      // beforeMessage,
      question: `${question}`,
      answer: `${completion.data.choices[0].text}`
    }
    logger.info(chatMessage);

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question, beforeMessage) {
  const capitalizedAnimal =
  question[0].toUpperCase() + question.slice(1).toLowerCase();
  return `${beforeMessage}
Human: ${capitalizedAnimal}
AI:`
}
