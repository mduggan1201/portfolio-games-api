const { selectCategories, selectReviewById, updateReviewByID, selectUsers, selectReviews, selectCommentsByReviewId, insertComment, removeCommentById } = require('../models/model')

exports.getCategories = (req,res, next) => {
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

exports.getUsers = (req,res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({ users })
    })
    .catch(next)
}

exports.getReviews = (req,res,next) => {
    const validQueryParams = ['sort_by', 'order', 'category']
    const QueryParams = Object.keys(req.query)

    for(let i = 0; i < QueryParams.length; i++){
        if(!validQueryParams.includes(QueryParams[i])){
            return Promise.reject( "Invalid Query Parameters")
            .catch(next)
        }
    }
    const { sort_by, order, category }  = req.query
    selectReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({ reviews })
    })
    .catch(next)
}

exports.getCommentsByReviewId = (req,res,next) => {
    const { review_Id }  = req.params 
    selectCommentsByReviewId(review_Id).then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const { review_Id }  = req.params 
    const newComment = req.body
    insertComment(review_Id, newComment).then((comment) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const removeComment = req.params
    removeCommentById(removeComment).then((comment) => {
        res.status(204).send({ comment })
    })
    .catch(next)
}
