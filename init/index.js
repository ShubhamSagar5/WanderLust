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
    await Listing.insertMany(newData.data);
    console.log('Data added Successfully');
}

init()