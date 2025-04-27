// Import your necessary dependencies
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface openAIRequestProps {
  interests: string;
  unique?: string;
}

// This function is now internal, not exported
async function generateTask(props: openAIRequestProps) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-nano",
      store: true,
      messages: [
        {
          role: "system",
          content:
            "give me a list of five, one sentence tasks that can be completed today based on this users interests: " +
            props.interests,
        },
      ],
    });

    return completion;
  } catch (error: any) {
    throw error;
  }
}

// Export the POST handler for the API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await generateTask(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// You can also export a GET handler if needed
export async function GET(request: NextRequest) {
  try {
    // Extract user data from query params or other sources
    const searchParams = request.nextUrl.searchParams;
    const interests = searchParams.get("interests");
    if (!interests) throw new Error("Interests are required");

    const result = await generateTask({
      interests: interests,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
