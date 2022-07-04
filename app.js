const express = require('express');
const app = express()
const { getCategories } = require('./controllers/controller')

app.use(express.json())

app.get('/api/categories', getCategories)

app.use("*", (req,res) =>{
    res.status(404).send({msg:"Invalid Path"})
  })

module.exports = app;