import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"


dotenv.config();
const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL, 
  methods: ['GET', 'POST'], 
  credentials: true 
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Connection error:", err));





app.use(bodyParser.urlencoded({extended: true}));
const port = process.env.PORT || 3000;

let dead = 0;
let injured = 0;
const numbers = []; 


// mongoose schema
const GuessSchema = new mongoose.Schema({
  computerGuess: Array,
  userGuess: Array,
  result: Array,
})

// create random number 
for (let i = 0; i < 4; i++){
  let computerGuess = Math.floor(Math.random() * 10);
  while (numbers.includes(computerGuess)){
    computerGuess = Math.floor(Math.random() * 10)
  }
  numbers.push(computerGuess)
}

// new database
const Guess = mongoose.model("guess", GuessSchema)

//with mongodb
app.post("/load", (req, res)=>{
  console.log("RAW BODY:", req.body);
  const {firstNum, secondNum, thirdNum, fourthNum } = req.body;

  Guess.findOne({computerGuess: numbers}).then((item)=>{
    if(item){
      item.userGuess.push([firstNum, secondNum, thirdNum, fourthNum]);
      return item.save()
    }
    else{
      const newGuess = new Guess({
      computerGuess: numbers,
      userGuess: [[firstNum, secondNum, thirdNum, fourthNum]],
      result: [],
    })
    console.log(newGuess.computerGuess)
    return newGuess.save()
    }
  })
  .then((latestGuess)=>{
    let lastGuess = latestGuess.userGuess[latestGuess.userGuess.length - 1];  
    for (let i = 0; i < latestGuess.computerGuess.length; i++ ){
      if (latestGuess.computerGuess.includes( +lastGuess[i])){
        if(latestGuess.computerGuess[i] === +lastGuess[i]){
          dead += 1
        }
        else{
          injured+= 1
        }
      }
    }
    latestGuess.result.push({dead, injured});
    return  latestGuess.save();
  })
  .then((latest)=>{
    const result = {
      userResult: latest.result,
      userGuesses: latest.userGuess,
    }
    console.log(result)
    res.json(result)
    dead = 0;
    injured = 0
  })

})

app.post("/reset", (req, res)=>{
  console.log("RAW BODY:", req.body);
  const {reset}  = req.body;
  console.log("Received boolean:", reset, typeof reset);
  res.json({ received: reset });
  
  if (reset){
    numbers.length = 0;
    for (let i = 0; i < 4; i++){
      let computerGuess = Math.floor(Math.random() * 10);
      while (numbers.includes(computerGuess)){
        computerGuess = Math.floor(Math.random() * 10)
      }
      numbers.push(computerGuess)
    }
    Guess.deleteMany({}).then(()=>{
      console.log("successfully deleted")
    })
  }
}) 

app.get("/submissions", async(req, res)=>{
  const guess = await Guess.findOne({ computerGuess: numbers });
  if (!guess) {
  return res.json({
    userResult: [],
    userGuess: []
  });
  }
  const result = {
    userResult: guess.result,
    userGuess: guess.userGuess,
  };
  res.json(result);
})

app.listen(port, (req, res) =>{
  console.log(`active at port ${port}`)
})