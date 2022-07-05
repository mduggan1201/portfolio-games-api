const { selectCategories, selectReviewById, updateReviewByID, selectUsers } = require('../models/model')

exports.getCategories = (req,res) => {
    selectCategories().then((category) => {
        res.status(200).send({ category })
    })
    .catch(next)
}

exports.getReviewById = (req,res, next) => {
    const { review_Id }  = req.params 
    selectReviewById(review_Id).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next) 
}

exports.patchReviewById = (req, res, next) => {
    const { review_Id } = req.params;
    const updateReview = req.body;
    updateReviewByID(review_Id, updateReview).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
}

exports.getUsers = (req,res) => {
    selectUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch(next)
}
