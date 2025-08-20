const Book  = require("../models/bookModel");
const stripe = require('stripe')(process.env.stripeKey)

exports.addBook= async (req,res)=>{
    console.log("Inside addBookController");
    const {title,author,noofpages,imageUrl,price,dprice, abstract,publisher,language,isbn,category} = req.body
    
    let UploadedImages=[]
    req.files.map((item)=>UploadedImages.push(item.filename))
    
    console.log(req.files);//array
    console.log(req.body);
    
    const email = req.payload?.userMail
    console.log(email);
    
    try {
      const existingBook = await Book.findOne({title, userMail:email})

if (existingBook){
  res.status(401).json("Book already existing...")
}else{

  const newBook = new Book({
       title,author,noofpages,imageUrl,price,dprice, abstract,publisher,language,isbn,category,UploadedImages,userMail:email

  })
  await newBook.save()
  res.status(200).json(newBook)
  }
    } catch (err) {
    res.status(500).json("Err"+err.message)
      
    }
    
      // res.status(200).json("AddBook request received...");
}

exports.getHomeBooks = async (req, res) => {
  try {
    const latestBooks = await Book.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(latestBooks);
  } catch (error) {
    console.error("Error getting books:", error); 
    res.status(500).json({ message: "Failed to get books", error });
  }
};


exports.getAllBooks = async (req, res) => {
  console.log("inside all books");
  console.log(req.query);
  
  const SearchKey = req.query.search 
  const email = req.query.userMail
  console.log("Inside getAllBooks, search:", SearchKey);

  try {
    const query = {
      title: {
        $regex: SearchKey,
        $options: "i"
      },
      userMail:{
        $ne:email
      }
    };

    const allBooks = await Book.find(query);
    res.status(200).json(allBooks);
  } catch (error) {
    console.error("Error getting all books:", error);
    res.status(500).json({ message: "Failed to get books", error });
  }
};



exports.getAbook=async(req,res)=>{
  console.log("Inside getAbook");
  const {id} = req.params
  console.log(id);
  
  try {
    const allBooks = await Book.findOne({_id:id})
    res.status(200).json(allBooks)
  }
   catch (error) {
res.status(500).json({ message: "Failed to get book", error });
  }
};

// ...................Admin.......................................

exports.getAllBookAdminController = async (req, res) => {
  try {
    const allExistingBooks = await Book.find()
    res.status(200).json(allExistingBooks);
  } catch (error) {
    console.error("Error getting books:", error); 
    res.status(500).json({ message: "Failed to get books", error });
  }
};


exports.approveBooksadminController=async(req,res)=>{
    const {_id,title,author,noofpages,imageUrl,price,dprice, abstract,publisher,language,isbn,category,UploadedImages,status,userMail,brought} = req.body
try {
  const existingBook = await Book.findByIdAndUpdate(
      {_id},
      {title,author,noofpages,imageUrl,price,dprice,abstract,publisher,language,isbn,category,UploadedImages,status:'approved',userMail,
brought},{ new: true } );

  await existingBook.save()
  res.status(200).json(existingBook)
} catch (error) {
  res.status(500).json(error)
}

}

exports.makePayment=async(req,res)=>{
  console.log("inside make payment");
  
const {bookDetails}= req.body
console.log(bookDetails);
const email = req.payload.userMail
console.log(email);

try {

  const existingBook = await Book.findByIdAndUpdate({_id:bookDetails._id}, {title:bookDetails.title,
    author:bookDetails.author,
    noofpages:bookDetails.noofpages,
    imageUrl:bookDetails.imageUrl,
    price:bookDetails.price,
    dprice:bookDetails.dprice,
    abstract:bookDetails.abstract,
    publisher:bookDetails.publisher,
    language:bookDetails.language,
    isbn:bookDetails.isbn,category:bookDetails.category,UploadedImages:bookDetails.UploadedImages,status:'sold',userMail:bookDetails.userMail,
brought:email},{ new: true } )
console.log(existingBook);


line_item = [{
  price_data:{
    currency:'usd',
    product_data:{
      name:bookDetails.title,
      description:`${bookDetails.author} || ${bookDetails.publisher}`,
      images:[bookDetails.imageUrl],
      metadata:{
        title:bookDetails.title,
    author:bookDetails.author,
    noofpages:bookDetails.noofpages,
    imageUrl:bookDetails.imageUrl,
    price:bookDetails.price,
    dprice:bookDetails.dprice,
    abstract:bookDetails.abstract,
    publisher:bookDetails.publisher,
    language:bookDetails.language,
    isbn:bookDetails.isbn,category:bookDetails.category,UploadedImages:bookDetails.UploadedImages,status:'sold',userMail:bookDetails.userMail,
brought:email
      }

    },
      //doller conversion
    unit_amount: Math.round(bookDetails.dprice*100)
  },
   quantity:1
}]

//create stripe checkout session
const session = await stripe.checkout.sessions.create({
//purchase using card
payment_method_types: ["card"],
//details of book
line_items: line_item,
//make payment
  mode: 'payment',
//if payment is successful then redirected to payment success page
  success_url: 'http://localhost:5173/payment-success',

//if payment is unsuccessful then redirected to payment error page
  cancel_url: 'http://localhost:5173/payment-error',
});
console.log(session);
res.status(200).json({sessionID:session.id,existingBook})

} catch (error) {
  res.status(500).json("error"+error)
}
}

