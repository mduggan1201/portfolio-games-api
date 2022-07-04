const { selectCategories } = require('../models/model')

exports.getCategories = (req,res) => {
    selectCategories().then((category) => {
        res.status(200).send({ category })
    })
}