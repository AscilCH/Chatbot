// api/openai.js

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // This comes from Vercel's environment variables
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { userInput, selectedLanguage } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a helpful assistant that responds in ${selectedLanguage}.` },
        { role: 'user', content: userInput }
      ]
    });

    const message = response.data.choices[0].message.content;
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: "API call failed." });
  }
}
