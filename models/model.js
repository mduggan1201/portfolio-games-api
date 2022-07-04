const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then((result) => result.rows)
}

exports.selectReviewById = (review_Id) => {
    return db
        .query('SELECT * FROM reviews where review_id = $1;', [review_Id])
        .then(({ rows }) => {
            const review = rows[0]
            if(!review){
                return Promise.reject({
                    status: 404,
                    msg: `No review found for review_id: ${review_Id}`
                })
            }
            return review
        })
}