const express=require("express");
const mongoose=require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost:27017/prodsAPI").then(()=>{
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);
})

const prodSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number
})
const Product = new mongoose.model("Product",prodSchema);

const app=express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());


//create
app.post("/api/v1/product/new",async (req,res)=>{
    const prod = await Product.create(req.body);
    res.status(200).json({
        success : true,
        prod
    })
})

//read
app.get("/api/v1/products",async (req,res)=>{
    const prods = await Product.find();
    res.json({
        success:true,
        prods
    })
})

//update
app.put("/api/v1/product/:id",async (req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        return res.status(404).json({
            success:false,
            message : "product not found"
        })
    }
    await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,runValidators:true,useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        message:"product pdated"
    })
})


//delete
app.delete("/api/v1/product/:id",async (req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        return res.status(404).json({
            success:false,
            message : "product not found"
        })
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        success:true,
        message:"product deleted"
    })
})

app.listen(3000,()=>{
    console.log("server is running at port 3000");
})