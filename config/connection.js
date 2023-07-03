const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

var options = {
    user: process.env.DBUSER,
    pass: process.env.DBPASSWORD
}


mongoose.connect(`mongodb://${process.env.DB_URL}:27017/CHATGPT`,options).then(()=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Database could not be connected");
});


// mongoose.connect(`mongodb://127.0.0.1:27017/CHATGPT`).then(()=>{
//     console.log("Database connected successfully");
// }).catch((err)=>{
//     console.log("Database could not be connected");
// });
