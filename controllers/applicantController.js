const applicants = require("../models/ApplicantModel"); 

exports.addApplication = async (req, res) => {
    console.log("Inside addApplicant Controller");
    const { fullname, JobTitle, qualification, email, Phone, coverletter} = req.body;
    console.log(req.body);
    const resume = req.file.filename
    try {
        const existingApplication = await applicants.findOne({ JobTitle, email }); 
console.log(existingApplication);

        if (existingApplication) {
            res.status(401).json("Job already applied...");
        } else {
            const newApplication = new applicants({
                fullname, JobTitle, qualification, email, Phone, coverletter,resume
            });
            await newApplication.save();
            res.status(200).json(newApplication);
        }
    } catch (err) {
        res.status(500).json("Err " + err.message);
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const getApplication = await applicants.find();  
        res.status(200).json(getApplication);    
    } catch (error) {
        console.error("Error getting jobs:", error);
        res.status(500).json({ message: "Failed to get jobs", error })
    }
};