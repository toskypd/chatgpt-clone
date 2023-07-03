const express = require('express');
const app = express();
require('dotenv').config()
require('./config/connection')
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;
app.use(cors());
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


const apiRoutes = require('./routes/api')
app.use('/',apiRoutes)



app.use(express.static('public'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'), function (err) {
    if (err) {
      console.log('error')
      res.status(500).send(err)
    }
  })
});




app.listen(port, () =>
{
  console.log(`server running on ${port}`)
})