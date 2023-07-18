import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

/** 2 prompts had to be used, one for the question and 1 for the answer, as
 * asking GPT for a question/answer pair in a single prompt gave too poor
 * results in testing.
 */
class OpenAIResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenAIResponseError";
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const notes = body.notes;
  try {
    if (!body && !notes) {
      throw new Error("No notes provided in the request.");
    }

    const systemPrompt = `You are an assistant and will be given a set of text. 
    You are tasked to generate a question and answer pair such that the question is related to the set of text, 
    and the answer to the question can be found in the text. You must output the question as the first item 
    in an array, and the answer to the question in the 2nd item of the array. The strings 'Question:', 'Answer:', 
    'Q:' or 'A' must not be present in any of the items in the output.`;

    const userPrompt = `Provide me with a question and answer pair from this text: '${notes}'`;

    const configuration = new Configuration({
      organization: "org-C4Yz5JwmomBQwTPPvD2e14sG",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    if (
      !completion.data.choices[0].message ||
      !completion.data.choices[0].message.content
    ) {
      throw new OpenAIResponseError(
        "Did not recieve a message response form OpenAI."
      );
    }

    console.log(completion.data.choices[0].message.content);

    const completionContent = completion.data.choices[0].message.content
      .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|");

    console.log(completionContent);

    if (completionContent.length <= 1) {
      throw new OpenAIResponseError(
        "Pair of senetences from Question/Answer were not generated from the response."
      );
    }

    const question = completionContent[0];
    const answer = completionContent.slice(1).join(" ");

    return NextResponse.json({
      question: question,
      answer: answer,
    });
  } catch (error) {
    console.log(error);
  }
}
