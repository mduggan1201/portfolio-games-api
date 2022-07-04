const express = require('express');
const app = express()
const { getCategories, getReviewById } = require('./controllers/controller');

app.use(express.json())

app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_Id', getReviewById)

app.use((err,req,res,next) => {
  if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
  } else {
    res.status(500).send({msg: 'Internal Server Error'})
  }
})

app.use("*", (req,res) =>{
    res.status(404).send({msg:"Invalid Path"})
  })

module.exports = app;