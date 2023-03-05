const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors/index');

const getAllJobs = async (req,res)=>{
    const {user:{userId}} = req;
    const jobs = await Job.find({"createdBy":userId}).sort("createdAt");
    res.status(StatusCodes.OK).json({jobs,length:jobs.length});
}
const getOneJob = async (req,res)=>{
    const {user:{userId},params:{id:jobId}} = req;
    const job = await Job.findOne({"createdBy":userId,"_id":jobId});
    if(job){
     return res.status(StatusCodes.OK).json(job);  
    }
    throw new NotFoundError("Job not found for current user");
}
const postJob = async(req,res)=>{
    req.body.createdBy = req.user.userId;
    req.body.username = req.user.name;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json(job);
}
const deleteJob = async (req,res)=>{
    const {user:{userId},params:{id:jobId}} = req;
    const job = await Job.findOneAndDelete({"createdBy":userId,"_id":jobId});
    if(job){
     return res.status(StatusCodes.OK).json({job,msg:"Job deleted"});  
    }
    throw new NotFoundError("Job not found for current user");
}
const updateJob = async (req,res)=>{
    const {user:{userId},params:{id:jobId},body:{company,position}} = req;
    const job = await Job.findOneAndUpdate({"createdBy":userId,"_id":jobId},req.body,{new:true,runValidators:true});
    if(job){
     return res.status(StatusCodes.OK).json({job,msg:"Job Updated"});  
    }
    throw new NotFoundError("Job not found for current user");
}

module.exports= {
    getAllJobs,
    getOneJob,
    postJob,
    deleteJob,
    updateJob
}