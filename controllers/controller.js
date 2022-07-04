const req = require('express/lib/request')
const { selectCategories, selectReviewById } = require('../models/model')

exports.getCategories = (req,res) => {
    selectCategories().then((category) => {
        res.status(200).send({ category })
    })
}

exports.getReviewById = (req,res, next) => {
    const { review_Id }  = req.params 
    selectReviewById(review_Id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
    
}