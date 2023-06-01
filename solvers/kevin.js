const { arrayToObject, getGroupedAnswers } = require('../utils');
const questions = require('../questions/kevin.json');
const config = require('../configs/kevin.json');

module.exports = (answers, res) => {
    const groups = getGroupedAnswers(arrayToObject(questions), answers);
    let result = config;
    const categories = ['hv', 'ht', 'i', 'p'];
    result.forEach((item) => {
        item.pass = true;
        item.score = 0;
        categories.forEach(category => {
            getScores(item[category], groups);
            item.pass = item.pass && item[category].pass;
            item.score += item[category].avg;
        });
    });
    result.sort((a, b) => { return a.score > b.score ? -1 : 1 });
    res.send({ success: true, data: result });
}

const getScores = (category, groups) => {
    category.score = 0;
    category.variables.forEach(variable => {
        category.score += groups[variable];
    })
    category.avg = category.score == 0 ? 0 : category.score / category.variables.length;
    category.pass = category.score >= category.min;
}