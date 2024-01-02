const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
app.use(express.json());
app.use(express.urlencoded({extended:false}));


require("./db/conn");
const userRegister = require("./models/userRegistration");
const notes = require("./models/Notes");

app.set("view engine","hbs");

app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.render("index");
})
app.listen(port,()=>{
    console.log(`Server is running at port no ${port}`);
})




app.get('/createNotes', function(req, res) {
    res.render('createnotes');
});
app.get('/retrieveNotes', function(req, res) {
    res.render('retrievenotes');
});
app.get('/updateNotes', function(req, res) {
    res.render('updatenotes');
});
app.get('/deleteNotes', function(req, res) {
    res.render('deletenotes');
});


var mobileNo  = "";

app.post("/createNotes", async (req, res) => {
    try {
        if (req.body.mobileno && req.body.password) {
            // Authentication logic
            const mobileno = req.body.mobileno;
            const password = req.body.password;

            const userDetails = await userRegister.findOne({ userMobileNo: mobileno });
            if (userDetails && userDetails.userPassword === password) {
                mobileNo = mobileno;
                console.log(mobileNo);
                res.status(201).render("createnotes");
            } else {
                res.send("Password does not match");
            }
        } else if (req.body.title && req.body.content) {
            // Note creation logic
            const currentDate = new Date();
            const creationTime = currentDate.toLocaleString();
            const newNote = new notes({
                userMobileNo: mobileNo,
                title: req.body.title,
                content: req.body.content,
                createdAt: creationTime,
                updatedAt: creationTime
            });

            const temp = await newNote.save();
            res.status(201).render("createnotes");
        } else {
            res.status(400).send("Invalid request format");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/updateNotes', async (req, res) => {
    try {
        const existingNote = await notes.findOne({ title: req.body.title });
        if(existingNote){
            const filter = { title: req.body.title };
            const update = {
                $set: {
                    content: req.body.content,
                    updatedAt: new Date().toLocaleString()
                }
            };
            const result = await notes.updateOne(filter, update);
            res.status(201).render("updatenotes");
        }
        else{
            res.send("Note is not present");
        }
    } catch (error) {
      console.error(error);
    }
  });

  app.post('/deleteNotes', async (req, res) => {
    try {
        const existingNote = await notes.findOne({ title: req.body.title });
        if(existingNote){
            const deletionCondition = { title: req.body.title};
            const result = await notes.deleteOne(deletionCondition);
            res.status(201).render("deletenotes");
        }
        else{
            res.send("Note is not present");
        }
    } catch (error) {
      console.error(error);
    }
  });

app.post('/index', async (req, res) => {
    try {
        const existingUser = await userRegister.findOne({ userMobileNo: req.body.userMobile });

        if (existingUser) {
            // If the mobile number is already registered
            res.send("User already registered");
        } else {
            const userPass = req.body.userPassword;
            const userConfirmPass = req.body.userConfirmPassword;

            if (userPass === userConfirmPass) {
                const registerUser = new userRegister({
                    userMobileNo: req.body.userMobile,
                    userPassword: req.body.userPassword,
                    userConfirmPassword: req.body.userConfirmPassword
                });

                const registered = await registerUser.save();
                res.status(201).render("index");
            } else {
                res.send("Passwords are not matching");
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


app.use(session({
    secret: 'siddhesh@858',
    resave: false,
    saveUninitialized: true
  }));

app.get('/api/NoteHistory',async(req,res)=>{
    try{
        const response = await notes.find({userMobileNo : mobileNo});
        res.json({response});
    }catch(err){
        console.log(err);
    }
})
 
