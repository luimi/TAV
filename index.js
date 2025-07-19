require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { validateType, validateAnswers } = require('./utils');
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'application/json' }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const tests = {
  gardner: {
    questions: require('./questions/gardner.json'),
    solver: require('./solvers/gardner')
  },
  //Creditos kevin salgado rubio
  kevin: {
    questions: require('./questions/kevin.json'),
    solver: require('./solvers/kevin')
  },
  chaside: {
    questions: require('./questions/chaside.json'),
    solver: require('./solvers/chaside')
  },
  kevinGemini: {
    questions: require('./questions/kevinGemini.json'),
    solver: require('./solvers/kevinGemini')
  },
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/docs/index.html'));
});

router.get('/sample', (req, res) => {
  res.sendFile(path.join(__dirname + '/sample/index.html'));
});

app.get('/', router);

app.get('/sample', router);

// app.get('/questions', (req, res) => {
//   if (!validateType(req.query.type, res, tests)) return;
//   res.status(200).send({ success: true, data: tests[req.query.type].questions });
// });

app.get('/questions', (req, res) => {
  const { type, lang } = req.query;

  if (!type) {
    return res.status(400).json({ success: false, message: "Missing 'type' parameter" });
  }

  if (!tests[type]) {
    return res.status(404).json({ success: false, message: "Test type not found" });
  }

  try {
    let questions;

    if (lang === 'en') {
      // Intentar cargar el archivo en inglés si existe
      const langPath = path.join(__dirname, 'questions', `${type}.en.json`);
      if (fs.existsSync(langPath)) {
        questions = require(langPath);
      } else {
        return res.status(404).json({
          success: false,
          message: `Questions not available in English for test '${type}'`
        });
      }
    } else {
      // Español por defecto
      questions = tests[type].questions;
    }

    return res.status(200).json({ success: true, data: questions });

  } catch (error) {
    console.error('Error loading questions:', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.post('/answer', (req, res) => {
  if (!validateType(req.query.type, res, tests)) return;
  if (!validateAnswers(req.query.type, req.body, res, tests)) return;
  let answers = JSON.parse(req.body);
  tests[req.query.type].solver(answers, res);
});



const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});