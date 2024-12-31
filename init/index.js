const mongoose = require('mongoose');
const Listing = require("../models/Listing");
const newData = require("./data")



main()
.then(()=>{
    console.log("Db connected sucessfully");
})
.catch((err)=>{
    console.log(err);
})



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
} 



const init = async() => {
    await Listing.deleteMany({});
    const updatedData = newData.data.map((obj)=>({...obj,owner:"6773b2e7fe59d0ab5c7f4d96"})) 
   
    await Listing.insertMany(updatedData);
    console.log('Data added Successfully');
}

init()