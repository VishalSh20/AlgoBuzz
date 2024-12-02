import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config";

export async function POST(req,_){
    try {
        const {language,editableCode,nonEditableCodes=[],editableCodePosition,problemId} = await req.json();
        if(!Array.isArray(nonEditableCodes))
            return NextResponse.json({error:"Non Editable(driver) code is missing or in wrong format"},{status:400});
        if([language,editableCode,editableCodePosition,problemId].some(field => field===undefined || field===null))
            return NextResponse.json({error:"All fields are required"},{status:400});
        if(isNaN(Number(problemId)))
            NextResponse.json({error:"Invalid Problem Id, an integer is expected"},{status:400});
        if(isNaN(Number(editableCodePosition)) || Number(editableCodePosition)<0 || Number(editableCodePosition)>=nonEditableCodes.length)
            NextResponse.json({error:"Invalid editable code position!!"},{status:400});
        if(["CPP","PYTHON","JAVA","JAVASCRIPT"].indexOf(language.toUpperCase()))
            NextResponse.json({error:"Language not valid"},{status:400});
    
        const data = {
            language:language.toUpperCase(),
            editableCode,
            nonEditableCodes,
            editableCodePosition,
            problemId
        };
    
        const template = await prisma.template.create({data:data});
        if(template)
            return NextResponse.json({message:"Template created successfully!!",template},{status:200});
        else
            return NextResponse.json({error:"Error while creating template in db"},{status:500});
    
    } catch (error) {
        console.error(error.message);
        return NextResponse.json({error:`Error in creating template - ${error.message}`},{status:500});
    }
}