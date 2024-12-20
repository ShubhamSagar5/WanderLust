const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')


main()
.then(()=>{
    console.log('Database connect successfully')
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
} 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))





app.get("/",(req,res)=>{
    res.send("Hi i am root")
})

app.listen(8080,()=>{
    console.log('Server is listen on port number 8080')
})
