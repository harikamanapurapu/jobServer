const mongoose=require("mongoose")

const addjobSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
    },
    logoUrl:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    },
    monthlysalary:{
        type:Number,
        required:true,
    },
    jobType:{
        type:String,
        enum: ['Internship', 'Fulltime'],
        required:true,
    },
    remoteoroffice:{
        type:String,
        enum: ['Remote', 'Office'],
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    jobDescription:{
        type:String,
        required:true,
    },
    aboutCompany:{
        type:String,
        required:true,
    },
    skills:{
        type:String,
        required:true,
    },
    info:{
        type:String,
        required:true,
    }

})

const addjob=mongoose.model('addjob',addjobSchema)
module.exports=addjob