const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Notes",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connection Succesfull");
}).catch((e)=>{
    console.log(e);
    console.log("No Connection");
})