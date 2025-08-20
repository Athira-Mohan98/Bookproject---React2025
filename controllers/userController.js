const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
//Logic for API CALLS

//1 Register
exports.register = async (req, res) => {
  //collect data from request body = destructuring
  const { username, email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      //error
      res.status(401).json("User already existing...");
    } else {
      const newUser = new users({
        username,
        email,
        password,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.login = async (req, res) => {
  //collect data from request body = destructuring
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      //Login success
      if (existingUser.password == password) {
        //token generation
        const token = jwt.sign(
          { userMail: existingUser.email },
          "superkey2025"
        );
        console.log(token);

        res.status(200).json({ existingUser, token }); //Login success
      } else {
        res.status(402).json("Password Missmatch");
      }
    } else {
      //error
      res.status(401).json("Something went wrong...");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.googleAuth = async (req, res) => {
  //collect data from request body = destructuring
  const { username, email, password, photo } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      //existing user
      //token generation
      const token = jwt.sign({ userMail: existingUser.email }, "superkey2025");
      console.log(token);

      res.status(200).json({ existingUser, token }); //Login success
    } else {
    //first time - google auth
      const newUser = new users({
        username,email,password, profile:photo,
      });
      await newUser.save();//save to mongodb
      //token gen
      const token = jwt.sign({ userMail: newUser.email }, "superkey2025");
      console.log(token);

      res.status(200).json({ existingUser:newUser, token }); //Login success
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getAllUsersAdminController = async (req, res) => {
  const email = req.payload.userMail
  try {
    const allExistinguser = await users.find({email:{$ne:email}})
    res.status(200).json(allExistinguser);
  } catch (error) {
  
    res.status(500).json({ error });
  }
};

exports.updateAdminDetails=async(req,res)=>{
  console.log("inside admin profile update");
  const { username, password, profile } = req.body;
  const pro = req.file ? req.file.filename : profile
  const email = req.payload.userMail
  console.log(username,password,pro,email);
  try {
    
    const adminDetails = await users.findOneAndUpdate({email},{username,email,password,profile:pro},{new:true})
    await adminDetails.save()
  res.status(200).json(adminDetails)
  }
   catch (err) {
   res.status(500).json("err"+err)
  }
  
}

exports.getAdminDetails=async(req,res)=>{
  
  const email = req.payload.userMail
  try {
    const adminDetails = await users.find({email,bio:"Admin"})
    if(!adminDetails){
          res.status(404).json({ message: "Not found" });

    }else{
    res.status(200).json(adminDetails);

    }
  } catch (err) {
  
    res.status(500).json( "error"+ err )
  }

}