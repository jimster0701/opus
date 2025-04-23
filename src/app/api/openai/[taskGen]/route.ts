import OpenAI from "openai";
import { User } from "~/types/user";

interface openAIRequestProps {
  user?: User;
  unique?: String;
}

export default function generateTask(props: openAIRequestProps) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = openai.chat.completions.create({
    model: "gpt-4o-nano",
    store: true,
    messages: [
      {
        role: "system",
        content:
          "give me a list of five, one sentence tasks that can be completed today based on this users interests: " +
          props.user?.interests,
      },
    ],
    //stream: true
  });

  completion.then((result) => console.log(result.choices[0]?.message));
}
