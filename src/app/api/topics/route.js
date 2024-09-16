import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config.js";
import {Topic} from '@prisma/client'

export async function GET(request){
    try {
        const topics = Object.values(Topic);
        return NextResponse.json({topics},{status:200});
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500});
    }
} 
