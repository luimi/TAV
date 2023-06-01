module.exports = {
    getGroupedAnswers: (questions, answers) => {
        let groups = {};
        answers.forEach(answers => {
            let question = questions[answers.id];
            switch (question.type) {
                case "1to5":
                    if (!groups[question.variable]) groups[question.variable] = 0;
                    groups[question.variable] += answers.response;
                    break;
                case "tf":
                    if (!groups[question.group]) groups[question.group] = 0;
                    if (answers.response) groups[question.group]++;
                    break;
                default: break;
            }
        });
        return groups;
    },
    arrayToObject: (questions) => {
        return questions.reduce((a, v) => {
            return { ...a, [v.id]: v };
        }, {});
    },
    validateType: (type, res, tests) => {
        if (!type) {
            res.status(400).send({ success: false, message: "Debe ingresar el tipo de prueba que va a relizar" });
            return false;
        }
        if (!tests[type]) {
            res.status(400).send({ success: false, message: "Tipo de prueba invalida" });
            return false;
        }
        return true;
    }, 
    validateAnswers: (type, body, res, tests) => {
        if (!body) {
            res.status(400).send({ success: false, message: "Debe enviar las respuestas en un arreglo de objetos" });
            return false;
        }
        let answers = null;
        try {
            answers = JSON.parse(body);
            let isArray = Array.isArray(answers);
            if (!isArray) {
                res.status(400).send({ success: false, message: "La respuesta enviada no es un arreglo de objetos valido" });
            }
        } catch (e) {
            res.status(400).send({ success: false, message: "La respuesta enviada no es un arreglo de objetos valido" });
            return false;
        }
        if (answers.length != tests[type].questions.length) {
            res.status(400).send({ success: false, message: "Cantidad de respuestas invalidas" });
            return false;
        }
        let schema = true;
        answers.forEach(answer => {
            if (!answer.id || answer.response == undefined || answer.response == null) schema = false;
        });
        if (!schema) {
            res.status(400).send({ success: false, message: "Formato de respuestas incorrecto" });
            return false;
        }
        return true;
    }
}