const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query('SELECT * FROM categories')
        .then((result) => result.rows)
}

exports.selectReviewById = (review_Id) => {

    if(!/^[0-9]*$/.test(review_Id)) {
        return Promise.reject({status: 400, msg: 'ID entered is not a number'})
    }
    return db
        .query(`
        SELECT reviews.*, CAST(COUNT(comment_Id) as int) as comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        where reviews.review_id = $1
        GROUP BY reviews.review_id;
        `, [review_Id])
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

exports.updateReviewByID = (review_Id, updateReview) => {
    if(!Object.keys(updateReview).includes('inc_votes')){
    return Promise.reject({status: 400, msg: 'Invalid Request Body. There has been no update.'})
    }

    const { inc_votes } = updateReview;

    if(!/^[0-9]*$/.test(review_Id)) {
        return Promise.reject({status: 400, msg: 'ID entered is not a number, There has been no update.'})
    }

    if(!/^[0-9]*$/.test(Math.abs(inc_votes))) {
        return Promise.reject({status: 400, msg: 'Incremental votes entered is not a number. There has been no update.'})
    }

    return db
        .query(
            'UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;',
            [inc_votes, review_Id]
        )
        .then (({ rows }) => {
            const updatedReview = rows[0]
            if(!updatedReview){
                return Promise.reject({
                    status: 404,
                    msg: `No review found for review_id: ${review_Id}. There has been no update.`
                })
            }
            return rows
        })

}

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
        .then((result) => result.rows)
}

exports.selectReviews = () => {
    return db.query(`
    SELECT reviews.*, CAST(COUNT(comment_Id) as int) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at desc;
    `)
        .then((result) => result.rows)
}
