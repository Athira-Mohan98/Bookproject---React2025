const Job = require("../models/jobModel"); 

exports.addJobs = async (req, res) => {
    console.log("Inside addjobController");
    const { title, location, jobType, salary, qualification, experience, description } = req.body;
    console.log(req.body);
    try {
        const existingJob = await Job.findOne({ title, location }); 

        if (existingJob) {
            res.status(401).json("Job already existing...");
        } else {
            const newJob = new Job({
                title, location, jobType, salary, qualification, experience, description
            });
            await newJob.save();
            res.status(200).json(newJob);
        }
    } catch (err) {
        res.status(500).json("Err " + err.message);
    }
};

exports.getAlljobs = async (req, res) => {
    try {
        const jobs = await Job.find();  
        res.status(200).json(jobs);    
    } catch (error) {
        console.error("Error getting jobs:", error);
        res.status(500).json({ message: "Failed to get jobs", error })
    }
};

exports.deletejobs = async (req, res) => {
    const { id } = req.params;
    try {
        await Job.findByIdAndDelete(id);  
        res.status(200).json("job deleted")
    } catch (error) {
        res.status(500).json({ error })
    }
};
