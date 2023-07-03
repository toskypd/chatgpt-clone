const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
let secretkey = process.env.SECRET_KEY;
const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");
const userModel = require("../models/user");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

module.exports = {

    register: async(req,res) => {
        try {
            let body = req.body;
            console.log(body, "body")
            const isExists = await userModel.findOne({ email: body.email });
            if (isExists) return res.send({ status: false, code: 201, message: "This email already exists ! Please Login" });
            const hash = await argon2.hash(body.password);
            body.password = hash;
            let token = jwt.sign({ email: body.email }, secretkey);
            body.token = token;
            const user = await userModel(body).save();
            let obj = { token: user.token, email: user.email, token: user.token }
            res.status(200).send({ status: true, code: 200, message: "User  registered successfully! Please Login.", result: obj });
        } catch (err) {
            console.log(err.message)
            res.send({ status: false, code: 201, message: err.message }) 
        }
    },

    login: async (req, res) => {
        try {
            let body = req.body;
            console.log(body, "body")
            const user = await userModel.findOne({ email: body.email });
            if (!user) return res.send({ status: false, code: 201, message: "Email is not registered with us. Please register ! " })
            const passMatch = await argon2.verify(user.password, body.password);
            if (!passMatch) return res.status(201).send({ status: false, code: 201, message: "Wrong Credentials" })
            var token = jwt.sign({ email: body.email }, secretkey);
            const user_info = await userModel.findOneAndUpdate({_id: user._id}, {$set: {token: token}}, {new: true})
            res.status(200).send({ status: true, code: 200, message: "Successfully Logged in", result: user_info });
        } catch (error) {
            console.log(error)
            res.status(500).send({ status: false, code: 500, message: "Server Error" })
        }
    },

    chat: async(req,res) =>  {
        try {
            console.log(req.query, "req");
            if(!req.query){
              req.query = "can i write something?"
            }
            const prompt = req.query.val;
            const maxTokens = 2500;
            const chunks = Math.ceil(prompt.length / maxTokens);
        
            let result = '';
        
            for (let i = 0; i < chunks; i++) {
              const startToken = i * maxTokens;
              const endToken = (i + 1) * maxTokens;
              const chunk = prompt.substring(startToken, endToken);
        
              const completion = await openai.createCompletion({
                model: "text-davinci-003",
                max_tokens: maxTokens,
                prompt: chunk,
              });
        
              result += completion.data.choices[0].text;
            }
        
            res.send({ status: true, code: 200, result });
          } catch (err) {
            console.log(err.message)
            res.send({ status: false, code: 201, message: err.message })
          }
    },
    voice: async(req,res) =>  {
        try {
          console.log(req.file, "files ");
            const file = req.file.filename;
            console.log(file)
          const transcript = await openai.createTranscription(
            fs.createReadStream(`./uploads/${file}`),
            "whisper-1",
            "json"
          );
         
          let obj = {text: transcript.data.text, file: file}
            res.send({ status: true, code: 200, result: obj });
          } catch (err) {
            console.log(err.message)
            res.send({ status: false, code: 201, message: err.message })
          }
    },
    image: async(req,res) =>  {
        try {
          console.log(req.query, "req")
          const imageGeneration = await openai.createImage({
            prompt: req.query.val,
            n: 2,
            size: "1024x1024",
          });
          console.log(imageGeneration)

            res.send({ status: true, code: 200, result:  imageGeneration.data });
          } catch (err) {
            console.log(err.message)
            res.send({ status: false, code: 201, message: err.message })
          }
    },


}