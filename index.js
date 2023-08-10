
const express=require("express")
const bodyParser=require("body-parser")
const dotenv=require("dotenv")
dotenv.config();
const mongoose=require("mongoose")
const cors=require('cors')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('/public'))

//get method
app.get('/',(req,res)=>{
    res.send("everything is fine")
})

const JobAppUser= mongoose.model( 'JobAppUser',{
  name:String,
  email:String,
  mobile:Number,
  password:String,
})

app.post('/signup', async (req,res)=>{

  try{
      const {name,email,mobile,password}=req.body

      const existingUser=await JobAppUser.findOne({email})

      if(existingUser){
          res.send("User already exists,please Sign in")
          return;
      }
      const encryptedPassword= await bcrypt.hash(password,10)
      const jobseeker= {name,email,mobile,password:encryptedPassword}
      await JobAppUser.create(jobseeker)
      const jwtToken=jwt.sign(jobseeker,process.env.JWT_SECRET,{expiresIn:"1h"})
      res.send({status:"success",jwtToken})
  }
  catch(error){
      console.log(error)
      res.send(error)

  }
  
})

app.post('/login', async (req,res)=>{

  try{
      const {email,password}=req.body

      const userInDb=await JobAppUser.findOne({email})

      if(!userInDb){
          res.send("User doesnot exist..Please sign up")
          return;
      }
      const didPasswordMatch= await bcrypt.compare(password,userInDb.password)
      if(didPasswordMatch){
          const jwtToken=jwt.sign({...userInDb},process.env.JWT_SECRET,{expiresIn:"1h"})
          res.send({message:"Login succesful",jwtToken})
      }
      else{
          res.send("Invalid password")
      }
  }
  catch(error){
      console.log(error)
      res.send(error)
  }
  
})




const addjobSchema= mongoose.Schema({
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

app.post('/addjob',async (req,res)=>{
  console.log("Recieved addjob request",req.body)
  const {companyName,logoUrl,position,monthlysalary,jobType,remoteoroffice,location,jobDescription,aboutCompany,skills,info}=req.body
  const Newjob={companyName,logoUrl,position,monthlysalary,jobType,remoteoroffice,location,jobDescription,aboutCompany,skills,info}
  addjob.create(Newjob).then(()=>{
    res.send("job added succesfully")
  })
  .catch((error)=>res.send(error))
})

app.get('/viewjobs', async (req, res) => {
  try{
    const job= await addjob.find({})
    res.status(200).json(job);
  }
  catch(err) {
      console.error('Error fetching job details:', err);
      res.status(500).json({ error: 'Error fetching job details' });
    } 
});

// app.get('/api/jobs', async (req, res) => {
//   try {
//     const jobs = await addjob.find({});
//     res.status(200).json(jobs);
//   } catch (err) {
//     console.error('Error fetching job details:', err);
//     res.status(500).json({ error: 'Error fetching job details' });
//   }
// })

app.patch('/Editjob/:jobId', async (req, res) => {
  const jobId = req.params.jobId;
  const { companyName,logoUrl,position,monthlysalary,jobType,remoteoroffice,location,jobDescription,aboutCompany,skills,info} = req.body;

  try {
      // Find the product by its ID in the database
      const jobinDb = await addjob.findById(jobId);
      console.log('Received job ID:', jobId);
      // Check if the product with the given ID exists
      if (!jobinDb) {
          return res.status(404).send('job not found');
      }
      // Update the product fields with the new data
      jobinDb.companyName = companyName;
      jobinDb.position = position;
      jobinDb.monthlysalary = monthlysalary;
      jobinDb.logoUrl = logoUrl;
      jobinDb.jobType = jobType;
      jobinDb.remoteoroffice=remoteoroffice;
      jobinDb.location=location;
      jobinDb.jobDescription=jobDescription;
      jobinDb.aboutCompany=aboutCompany;
      jobinDb.skills=skills;
      jobinDb.info=info;
      // Save the updated product to the database
      await jobinDb.save();
      res.send('job updated successfully');
  } catch (error) {
      console.log(error);
      res.status(500).send('Error occurred while updating the job');
  }
});

app.get('/viewjobs/:jobId', async (req, res) => {
    try {
      const job = await addjob.findById(req.params.jobId);
      res.json(job);
    } catch (error) {
      res.status(404).json({ error: 'Job not found' });
    }
  });




app.listen(process.env.PORT,()=>{
    mongoose.connect(process.env.MONGODB_URL)
        .then(()=>console.log(`server running on http://localhost:${process.env.PORT}`))
        .catch(err=>console.log(err))
})

