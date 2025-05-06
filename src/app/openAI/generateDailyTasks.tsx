import { OpenAI } from "openai";
import { useMemo, useState } from "react";
import { type Interest } from "~/types/interest";
import { trpc } from "~/utils/trpc";

interface generateDailyTasksProps {
  userId: string;
}

export default async function GenerateDailyTasks(
  props: generateDailyTasksProps
) {
  console.log(process.env.OPENAI_API_KEY);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let interests: Interest[] = [];

  const getInterests = await trpc.user.getUserInterests.useQuery({
    userId: props.userId,
  });

  interests = (getInterests.data as Interest[]) ?? [];

  if (interests.length != 0) {
    const systemPrompt = `
  You are a creative task master here to generate tasks for users based on their interests. 
  The tasks should be interesting, fun, achievable in a day, and varied.
  You are free to dive into nieche or esoteric sub sections of interests to keep it interesting.
  Your response must follow this structure
  {
    name: "the tasks title"
    icon: "an emoji representing the task"
    interests: [id ,...]
    description: "Simple sentence about the task, try to balance for different skill levels"
  }
  `;

    const userPrompt = `Could you generate 3 tasks based on a few of the following interests:\n\n${interests
      .map((i) => `id: ${i.id}, name: ${i.name} `)
      .join("\n")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response content from OpenAI");
    console.log(response);
    try {
      const tasks = JSON.parse(content);
      return tasks;
    } catch (error) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error(`Could not parse tasks from OpenAI: ${error}`);
    }
  }
}
