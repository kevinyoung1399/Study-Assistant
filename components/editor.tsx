"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { exampleText } from "./exampleText";
import { useState } from "react";

export default function Editor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: exampleText,
  });

  const revealAnswer = () => {
    setAnswerRevealed(true);
  };

  const handleTestYourself = async (e: any) => {
    if (!editor) {
      return;
    }
    setAnswerRevealed(false);

    e.preventDefault();

    setShowButton(false);

    setLoading(true);
    const res = await fetch(`/api/ask-openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: editor.getText(),
      }),
    });
    const data = await res.json();
    setQuestion(data.question);
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div className="flex flex-row">
      <div className="container mx-0 my-4 py-4 px-4 border-2 border-green-400 rounded-lg">
        <EditorContent editor={editor} className="text-white" />
      </div>

      <div className="container mx-0 px-5 py-4 px-4">
        {showButton && (
          <button
            onClick={handleTestYourself}
            className="bg-green-500 hover:bg-slate-900 hover:border-2 hover:border-green-400 text-white font-bold py-2 px-4 rounded-full"
          >
            Test yourself
          </button>
        )}

        {loading && (
          <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-300">
            thinking of questions, please wait...
          </div>
        )}
        {!showButton && !loading && editor && (
          <>
            <div>
              <div className="mt-2 text-xl font-semibold tracking-tight text-gray-300">
                Question
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-green-400">
                {question}
              </div>
              {!answerRevealed && (
                <button
                  onClick={revealAnswer}
                  className="bg-green-500 mt-5 hover:bg-slate-900 hover:border-2 hover:border-green-400 text-white font-bold py-2 px-4 rounded-full"
                >
                  reveal answer
                </button>
              )}
              {answerRevealed && (
                <>
                  <div className="mt-2 text-xl font-semibold tracking-tight text-gray-300">
                    Answer
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-green-400">
                    {answer}
                  </div>
                  <button
                    onClick={handleTestYourself}
                    className="bg-green-500 mt-5 hover:bg-slate-900 hover:border-2 hover:border-green-400 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Test yourself again
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
