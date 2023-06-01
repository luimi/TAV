const questions = require('../questions/gardner.json');
const config = require('../configs/gardner.json');
const { getGroupedAnswers, arrayToObject } = require('../utils');
module.exports = (answers, res) => {
    const groups = getGroupedAnswers(arrayToObject(questions), answers);
    const result = [];
    config.inteligences.forEach((inteligence) => {
        let score = groups[inteligence.group];
        result.push({
            title: inteligence.title,
            score: score,
            fraction: `${score}/5`
        })
    });
    res.send({ success: true, data: result });
}