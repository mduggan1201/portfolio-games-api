const express = require('express');
const app = express()
const { getCategories, getReviewById, patchReviewById, getUsers, getReviews, getCommentsByReviewId, postComment, deleteComment, getAPI } = require('./controllers/controller');
const cors = require('cors')

app.use(cors());

app.use(express.json())

app.get('/api', getAPI)
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_Id', getReviewById)
app.get('/api/users', getUsers)
app.get('/api/reviews', getReviews)
app.get('/api/reviews/:review_Id/comments', getCommentsByReviewId)

app.patch('/api/reviews/:review_Id', patchReviewById)

app.post('/api/reviews/:review_Id/comments', postComment)

app.delete('/api/comments/:comment_id', deleteComment)



app.use((err,req,res,next) => {
  if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
  } else {
    res.status(500).send({err})
  }
})

app.use("*", (req,res) =>{
    res.status(404).send({msg:"Invalid Path"})
  })

module.exports = app;
