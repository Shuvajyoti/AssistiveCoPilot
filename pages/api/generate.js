import { Configuration, OpenAIApi } from "openai";

const fs = require("fs");
//const buffer = fs.readFileSync("sampleMeetingTranscript.docx");
const buffer = fs.readFileSync("inputTranscript.txt");
const fileContent = buffer.toString();

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

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptSummary(),
      temperature: 0.5,
      max_tokens: 500
    });
    const completion2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptActionItems(),
      temperature: 0.5,
      max_tokens: 500
    });
    res.status(200).json({ result: `SUMMARY - ${completion.data.choices[0].text.slice(1)}`, result2: `${completion2.data.choices[0].text}`.slice(1)});
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

function generatePromptSummary() {
  return `Summarize the following text - ${fileContent}`;
}

function generatePromptActionItems() {
  return `Get action items from following text - ${fileContent}`;
}
