const questions = require('../questions/chaside.json');
const config = require('../configs/chaside.json');
const { getGroupedAnswers, arrayToObject } = require('../utils');
module.exports = (answers, res) => {
    const groups = getGroupedAnswers(arrayToObject(questions), answers);
    ["i","a"].forEach((second) => {
        let group = "c";
        let score = 0;
        ["c","h","a","s","i","d","e"].forEach((first) => {
            let currentScore = groups[`${first}${second}`]
            if(currentScore > score) {
                score = currentScore
                group = first
            }
        })
        groups[second] = config[group]
    })
    res.send({ success: true, data: groups });
}