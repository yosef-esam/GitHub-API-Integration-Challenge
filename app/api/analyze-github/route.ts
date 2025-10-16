import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    // 1️⃣ Fetch GitHub data
    const githubRes = await fetch(`https://api.github.com/users/${username}`);
    if (!githubRes.ok) {
      return NextResponse.json(
        { error: "GitHub user not found" },
        { status: 404 }
      );
    }

    const profile = await githubRes.json();

    // Optionally, fetch repos too:
    const reposRes = await fetch(profile.repos_url);
    const repos = await reposRes.json();

    // 2️⃣ Prepare text for AI
    const profileText = `
      Name: ${profile.name}
      Bio: ${profile.bio}
      Public Repos: ${profile.public_repos}
      Followers: ${profile.followers}
      Following: ${profile.following}

      Top Repositories:
      ${repos
        .slice(0, 5)
        .map((r: any) => `- ${r.name}: ${r.description || "No description"}`)
        .join("\n")}
    `;

    // 3️⃣ Ask AI to summarize and analyze
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4-turbo
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that summarizes and analyzes GitHub developer profiles.",
        },
        {
          role: "user",
          content: `Analyze this GitHub profile and summarize the developer's skills, activity, and strengths:\n\n${profileText}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
