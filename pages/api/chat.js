import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, please use POST" });
  }

  try {
    const prompt = req.body.prompt;
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an adaptive French teacher. Based on the user's questions,responses, and level of French comprehension, adjust yourinstruction accordingly. Start with a basic level and increase complexity if the user seems capable. Give grammar tips, highlight important vocab, and educate the user on how to become better at French.",
        },
        { role: "user", content: prompt },
      ],
    });
    return res.status(200).json({
      message: "Success",
      response: gptResponse.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
