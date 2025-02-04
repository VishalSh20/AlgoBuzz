import { prisma } from "@/db/db.config.js";
import { withRetry } from "@/utils/prismaRetry.utils";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { page = 1, limit = 10 } = new URL(req.url).searchParams;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch total number of users
    const totalUsers = await withRetry(async()=>await prisma.user.count());
    const totalPages = Math.ceil(totalUsers / limitNumber);

    // Fetch users sorted by problemsSolved in descending order
    const users = await withRetry(async() => await prisma.user.findMany({
      orderBy: {
        problemsSolved: 'desc'
      },
      skip: skip,
      take: limitNumber,
      select: {
        id: true,
        name: true,
        username: true,
        imageurl: true,
        problemsSolved: true
      }
    }));

    return NextResponse.json({
      users,
      totalPages,
      currentPage: pageNumber
    },{status: 200});
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch leaderboard'+error.message, 
    },{status: 500});
  }
}