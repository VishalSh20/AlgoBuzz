// import { NextResponse } from "next/server";
// import { prisma } from "@/db/db.config";
// import {currentUser} from "@clerk/nextjs/server";
// import { language_id } from "@/constants";
// import axios from "axios";
// import { Status } from "@prisma/client";

// export async function POST(request) {
//     try {
//         const requestBody = await request.json(); 
//         const {problemId,code,language,status,memory=-1,time_taken=-1} = requestBody;

//         const user = await currentUser();
//         if(!user)
//             return NextResponse.json({error:"User not Authorised"},{status:401});

//                 const submissionInstance = await prisma.submission.create({
//                     data:{
//                         userId:user.id,
//                         problemId,
//                         code,
//                         language,
//                         status:Status[status.replace('(','').replace(' ','_').toUpperCase()],
//                         memory,
//                         time_taken
//                     }
//                 });
                
//                 return NextResponse.json({message:"Problem Submitted Successfully",body:{
//                     submissionInstance
//                 }},{status:200});

//     } catch (error) {
//         return NextResponse.json({error:error.message||error.data?.message || "Submission Failed"},{status:500});
//     }
  
// }

// export async function GET(request) {

//     try {
//         const user = await currentUser();
//         const problemId = request.nextUrl.searchParams.get('problemId');
//         const userOnly = request.nextUrl.searchParams.get('userId');
//         const status = request.nextUrl.searchParams.get('status');
//         const language = request.nextUrl.searchParams.get('language');
//         const limit = request.nextUrl.searchParams.get('limit') || 10;
//         const page = request.nextUrl.searchParams.get('page') || 1;
//         const skip = (page-1)*limit;

//         console.log("page",page);
//             const submissions = await prisma.submission.findMany({
//                 where:{
//                     ...(problemId && { problemId: parseInt(problemId) }), 
//                     ...(userOnly && { userId:user.id }),                            
//                     ...(status && { status: Status[status] }),       
//                     ...(language && { language:language }),
//                 },
//                 orderBy:{
//                     createdAt:'desc'
//                 },
//                 skip:skip,
//                 take:limit
//             });

//             const areSubmissionsAhead = ((await prisma.submission.count({})) - (skip+limit)) > 0; 

//             return NextResponse.json({message:"Submissions fetched successfully",body:{submissions:submissions,areSubmissionsAhead:areSubmissionsAhead}},{status:200});
//     } 
//     catch (error) {
//         return NextResponse.json({error:error.message || "Failed to fetch submissions"},{status:500});
//     }

// }
