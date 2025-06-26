import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config";

export async function POST(req){
    const reqBody = await req.json();
    const {inputText,outputText,explanation,input,output,problemId} = reqBody;
    console.log(inputText,outputText,explanation,input,output,problemId);
    if([inputText,outputText,explanation,input,output,problemId].some(field => field===undefined || field===null))
        return NextResponse.json({message:"All fields are required"},{status:400});

    try {
        const example = await prisma.example.create({
            data:{
                inputText,outputText,explanation,input,output,problemId:parseInt(problemId)
            }
        });
    
        return NextResponse.json({message:"Example added successfully",body:example},{status:201});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message:error.message || "Error while updating example test case"},{status:500})
    }
    
}

export async function PUT(req){
    const id = parseInt(req.nextUrl.searchParams.get('id'));
    const reqBody = await req.json();
    const {inputText,outputText,explanation} = reqBody;
    if([inputText,outputText,explanation].some(field => !field))
        return NextResponse.json({message:"All fields are required"},{status:400});

    try {
        const example = await prisma.example.update({
            where:{
                id
            },
            data:{
                inputText,outputText,explanation
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
        await prisma.example.delete({
            where:{id}
        });

        return NextResponse.json({message:"Testcase deleted successfully"},{status:200});
    } catch (error) {
        return NextResponse.json({message:error.message || "Error in deleting testcase"},{status:500});
    }
}