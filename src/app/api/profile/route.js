import { prisma } from "@/db/db.config";
import { NextResponse } from "next/server";

export async function GET(req,_) {
    try {
        const username = req.nextUrl.searchParams.get("username");
        if(!username)
            return NextResponse.json({error:"Username is Required"},{status:400});

        const user = await prisma.user.findUnique({
            where:{
                username
            }
        });

        const submissions = await prisma.submission.findMany({
            where: {
              userId: user.id
            },
            select: {
              id: true,
              language: true,
              status: true,
              createdAt: true,
              problem: {  
                select: {
                  title: true,
                  difficulty: true,
                  slug: true
                }
              }
            }
          });
          
          let problems = [];
          submissions.forEach(sub => {
            if(sub.status === "ACCEPTED")
                problems.push(sub.problem);
          })

        if(!user)
        return NextResponse.json({error:"User does not exist !!"},{status:404});
        else
        return NextResponse.json({message:"User Details fetched successfully",profile:{user:user,submissions:submissions,problems:problems}},{status:200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({error:error.message || "Error occured while fetching user"},{status:500});
    }
}