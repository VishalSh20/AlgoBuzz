import { prisma } from "@/db/db.config.js";
import { Language } from "@prisma/client";
import { NextResponse } from "next/server";

function convertToLanguage(lang) {
  return Language[lang];
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { code, language, timeComplexity, spaceComplexity, problemId } = body;

    if (!code || !language || !timeComplexity || !spaceComplexity || !problemId) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newSolution = await prisma.solution.create({
      data: {
        code,
        language: convertToLanguage(language),
        timeComplexity,
        spaceComplexity,
        problemId
      },
    });

    return NextResponse.json(
      { message: "Solution added successfully", body: newSolution },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error in creating solution - ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const problemId = parseInt(req.nextUrl.searchParams.get("problemId"));
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 5;
    const primary = req.nextUrl.searchParams.get("primary") === "true";

    if (!problemId || isNaN(problemId)) {
      return NextResponse.json({ message: "Valid problemId is required" }, { status: 400 });
    }

    if (primary) {
      const primarySolution = await prisma.solution.findFirst({
        where: {
          problemId: problemId,
        },
        orderBy: {
          id: "asc" // Gets the first solution (primary)
        },
      });

      console.log(primarySolution);

      if (!primarySolution) {
        return NextResponse.json({ message: "No primary solution found" }, { status: 404 });
      }

      return NextResponse.json({ 
        message: "Primary solution fetched", 
        body: primarySolution 
      }, { status: 200 });
    } else {
      // Calculate skip based on page and limit
      const skip = (page - 1) * limit;

      // Get solutions with pagination
      const [solutions, totalCount] = await Promise.all([
        prisma.solution.findMany({
          where: {
            problemId: problemId,
          },
          skip,
          take: limit,
          orderBy: {
            id: "asc",
          },
        }),
        prisma.solution.count({
          where: {
            problemId: problemId,
          },
        })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({ 
        message: "Solutions fetched", 
        body: solutions,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Error in fetching solutions - ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = parseInt(req.nextUrl.searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ message: "Solution ID is required" }, { status: 400 });
    }

    await prisma.solution.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Solution deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting solution - ${error.message}` },
      { status: 500 }
    );
  }
}
