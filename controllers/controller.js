const { selectCategories, selectReviewById, updateReviewByID } = require('../models/model')

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

exports.patchReviewById = (req, res, next) => {
    const { review_Id } = req.params;
    const updateReview = req.body;

    updateReviewByID(review_Id, updateReview).then((review) => {
        res.status(200).send({ review })
    })
    .catch(next)
}