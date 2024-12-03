import { prisma } from "@/db/db.config";
import { NextResponse } from "next/server";

export async function GET(req, _) {
  const MAX_RETRIES = 3; // Number of retry attempts
  let retryCount = 0;

  // Retry Wrapper Function
  async function withRetry(fn) {
    while (retryCount < MAX_RETRIES) {
      try {
        return await fn(); // Attempt the function
      } catch (error) {
        retryCount++;
        console.error(`Attempt ${retryCount} failed:`, error.message);
        if (retryCount === MAX_RETRIES) throw error; // Throw final error after retries
      }
    }
  }

  try {
    const username = req.nextUrl.searchParams.get("username");
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user with retries
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { username },
      })
    );

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist!!" },
        { status: 404 }
      );
    }

    // Fetch submissions with retries
    const submissions = await withRetry(() =>
      prisma.submission.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          language: true,
          status: true,
          createdAt: true,
          code: true,
          problem: {
            select: {
              title: true,
              difficulty: true,
              slug: true,
            },
          },
        },
      })
    );

    // Process problems to filter unique titles with "ACCEPTED" status
    let problems = [];
    let uniqueProblemTitles = new Set();
    submissions.forEach((sub) => {
      if (sub.status === "ACCEPTED") {
        if (!uniqueProblemTitles.has(sub.problem.title)) {
          problems.push(sub.problem);
        }
        uniqueProblemTitles.add(sub.problem.title);
      }
    });

    return NextResponse.json(
      {
        message: "User details fetched successfully",
        profile: { user, submissions, problems },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Final error after retries:", error);
    return NextResponse.json(
      { error: error.message || "Error occurred while fetching user" },
      { status: 500 }
    );
  }
}
