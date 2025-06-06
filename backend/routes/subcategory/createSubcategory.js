import { PrismaClient } from "@prisma/client";
import express from 'express';
import upload from "../../utils/multer";
const prisma=new PrismaClient();
const router=express.Router()

router.post('/',upload.single("image"),async(req,res)=>{
    const {}
})