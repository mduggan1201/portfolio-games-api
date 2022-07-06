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

exports.selectReviews = (sort_by = 'created_at', order = 'desc', category) => {

    const validSortOpitons = ['review_id','title','category','designer','owner','review_body','review_img_url','created_at','votes','comment_count']
    const validOrderOptions = ['asc','desc']
    const filterCategory = category.replace("_"," ")
    
    if(!validSortOpitons.includes(sort_by)){
        return Promise.reject( "Invalid Sort By Query" )
    }

    if(!validOrderOptions.includes(order)){
        return Promise.reject("Invalid Order By Query")
    }
    
    const queryValues =[];
    let queryStr = `SELECT reviews.*, CAST(COUNT(comment_Id) as int) as comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id`
    if(filterCategory !== undefined) {
        queryValues.push(filterCategory)
        queryStr += ` WHERE category in (%L)`
    }
    queryStr += ` GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order};`

    const reviewQuery = format(queryStr, queryValues)
    return db
    .query(reviewQuery)
    .then(({ rows }) => {
        const reviews = rows
        if(reviews.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No reviews found for category: ${filterCategory}`
            })
        }
        return reviews
    })
}


exports.selectCommentsByReviewId = (review_Id) => {
    if(!/^[0-9]*$/.test(review_Id)) {
        return Promise.reject({status: 400, msg: 'ID entered is not a number'})
    }
    return db
        .query(`SELECT comments.*
        FROM comments
        where review_id = $1;
        `, [review_Id])
        .then(({ rows }) => {
            const comments = rows
            if(comments.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `No comments found for review_id: ${review_Id}`
                })
            }
            return comments
        })
}

exports.insertComment = (review_Id, newComment) => {
    const {author, body } = newComment;
    if(!/^[0-9]*$/.test(review_Id)) {
        return Promise.reject({status: 400, msg: 'ID entered is not a number.'})
    }
    if(body.length === 0) {
        return Promise.reject({status: 400, msg: 'Comment body cannot be empty. No data has been added.'})
    }

    return db
    .query('SELECT review_id FROM reviews WHERE review_id = $1;', [review_Id])
    .then(({ rows }) => {
        const review = rows
        if(review.length === 0){
            return Promise.reject({
                status: 404,
                msg: `${review_Id} is not within the database. No data has been added.`
            })
        }
        return db
        .query('SELECT username FROM users WHERE username = $1;'
        , [author])
        .then(({ rows }) => {
            const username = rows
            if(username.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `${author} is not in the users database. No data has been added.`
                })
            }
            return db
            .query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;`,
            [author, body, review_Id])
            .then ((result) => result.rows)
        })
    })
}
