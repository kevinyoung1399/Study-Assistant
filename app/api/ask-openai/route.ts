import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

/** 2 prompts had to be used, one for the question and 1 for the answer, as
 * asking GPT for a question/answer pair in a single prompt gave too poor
 * results in testing.
 */
export async function POST(req: Request) {
  const body = await req.json();
  const notes = body.notes;
  try {
    if (!body && !notes) {
      throw new Error("No notes provided in the request.");
    }
    const question_prompt = `Ask a question based on information from the following: '${notes}'`;

    const configuration = new Configuration({
      organization: "org-C4Yz5JwmomBQwTPPvD2e14sG",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const question_response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question_prompt,
    });

    const question = question_response.data.choices[0].text;

    const answer_prompt = `${question} Generate your answer to this question based on your understanding of the following: '${notes}'. Answer in a full sentence`;
    const answer_response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: answer_prompt,
    });

    const answer = answer_response.data.choices[0].text;

    return NextResponse.json({
      question: question,
      answer: answer,
    });
  } catch (error) {
    console.log(error);
  }
}
