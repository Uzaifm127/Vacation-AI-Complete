import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { vacationSystemPrompt } from "@/lib/prompts";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { destination, endDate, reason, startDate } = await req.json();

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      system: vacationSystemPrompt,
      prompt: `Plan a vacation itinerary for me. Here are all the parameters:
      \n\n
      Destination: ${destination}
      \n
      Reason: ${reason}
      \n
      Start Date: ${startDate.toString().split("T")[0]}
      \n
      End Date: ${endDate.toString().split("T")[0]}
      `,
    });

    return NextResponse.json({
      plan: JSON.parse(response.text),
    });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 404 }
    );
  }
};
