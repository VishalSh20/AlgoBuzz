import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config";

export async function POST(req){
    const reqBody = await req.json();
    const {input,output,problemId} = reqBody;
    if([input,output,problemId].some(field => !field))
        return NextResponse.json({message:"All fields are required"},{status:400});

    try {
        const testcase = await prisma.testCase.create({
            data:{
                input,output,ProblemId:parseInt(problemId)
            }
        });
        
        return NextResponse.json({message:"Testcase added successfully",body:testcase},{status:201});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message:error.message || "Error while updating test case"},{status:500})
    }
    
}

export async function PUT(req){
    const id = parseInt(req.nextUrl.searchParams.get('id'));
    const reqBody = await req.json();
    const {input,output} = reqBody;
    if([input,output].some(field => !field))
        return NextResponse.json({message:"All fields are required"},{status:400});

    try {
        const testcase = await prisma.testCase.update({
            where:{
                id
            },
            data:{
                input,output
            }
        });
        
        return NextResponse.json({message:"Testcase updated successfully",body:testcase},{status:201});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message:error.message || "Error while updating test case"},{status:500})
    }
    
}

export async function DELETE(req){
    const id = parseInt(req.nextUrl.searchParams.get('id'));
    if(!id)
        return NextResponse.json({message:"Id is required"},{status:400});

    try {
        await prisma.testCase.delete({
            where:{id}
        });

        return NextResponse.json({message:"Testcase deleted successfully"},{status:200});
    } catch (error) {
        return NextResponse.json({message:error.message || "Error in deleting testcase"},{status:500});
    }
}