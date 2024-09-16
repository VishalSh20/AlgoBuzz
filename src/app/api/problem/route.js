import { prisma } from "@/db/db.config.js";
import { Difficulty, Topic } from "@prisma/client";
import { NextResponse } from "next/server";

function convertToTopic(topicname){
    return Topic[topicname];
}

function convertToDifficulty(d){
    return Difficulty[d];
}

function generateSlug(title) {
    return title
      .toLowerCase() // Convert to lowercase
      .trim() // Trim whitespace from both ends
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export async function POST(req,res){
    const reqBody = await req.json();
    const {title,difficulty,Statement,constraints,topics} = reqBody;
    if([title,difficulty,Statement,constraints,topics].some(val=>(val===undefined)))
        return NextResponse.json({message:"All details are required"},{status:400})

    const slug = generateSlug(title);
    try {
        console.log(slug);
        const createdProblem = await prisma.problem.create({
            data:{
                title,slug,difficulty,Statement,constraints,topics:topics.map(t=>convertToTopic(t))
            }
        });
    
        return NextResponse.json({message:"problem added successfully",body:createdProblem},{status:200});
    
    } catch (error) {
        return NextResponse.json({message:`Error in adding problem - ${error.message}`},{status:500});
    }
}

export async function PUT(req){
    const id = parseInt(req.nextUrl.searchParams.get('id'));
    const reqBody = await req.json();
    const {title,difficulty,Statement,constraints,topics} = reqBody;
    if([title,difficulty,Statement,constraints,topics].some(val=>(val===undefined)))
        return NextResponse.json({message:"All details are required"},{status:400})

    const slug = generateSlug(title);
    console.log(slug);
    try {
        const newProblem = await prisma.problem.update({
            where:{
                id
            },
            data:{
                title,slug,difficulty,Statement,constraints,topics:topics.map(t=>convertToTopic(t))
            }
        });
    
        return NextResponse.json({message:"problem updated successfully",body:newProblem},{status:200});
    
    } catch (error) {
        return NextResponse.json({message:`Error in updating problem - ${error.message}`},{status:200});
    }
}

export async function GET(req){
    console.log(req.nextUrl.searchParams);
    const slug = req.nextUrl.searchParams.get('slug');
    const query = req.nextUrl.searchParams.get('query') || "";
    let topics = req.nextUrl.searchParams.getAll('topics');
    topics = topics.length>0 ? topics : Object.values(Topic);
    let difficulties = req.nextUrl.searchParams.getAll('difficulties');
    difficulties = difficulties.length>0 ? difficulties : ['EASY','MEDIUM','HARD'];
    console.log(difficulties,topics);

    try {
        if(slug){
            const problem = await prisma.problem.findUnique({
                where:{slug},
                include:{
                    solutions:true,
                    testcases:true,
                    examples:{
                        include:{
                            testcase:true
                        }
                    },
                }
            });

            if(problem)
            return NextResponse.json({message:"Problem fetched successfully",problem},{status:200}); 
            else{
             return NextResponse.json({message:"Problem does not exist"},{status:404});  
            }  
        }
        else{
            const problems = await prisma.problem.findMany({
                where:{
                    AND:[
                        {difficulty:{
                            in:difficulties.map(d=>convertToDifficulty(d))
                        }},
                        {topics:{
                            hasSome:topics
                        }},
                        {OR:[
                            {title:{
                                contains:query
                            }},
                            {Statement:{
                                contains:query
                            }},
                        ]},
                    ] 
                        
                },
                select:{
                    id:true,
                    title:true,
                    slug:true,
                    difficulty:true,
                    topics:true,
                }
                
            });
    
            return NextResponse.json({message:"Problems fetched successfully",problems:problems},{status:200});
        }
    } catch (error) {
        return NextResponse.json({error:`Error while fetching problems - \n ${error.message}`},{status:500});
    }

}