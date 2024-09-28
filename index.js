require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const path = require('path');
const {validateType, validateAnswers} = require('./utils');
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
  kevin: {
    questions: require('./questions/kevin.json'),
    solver: require('./solvers/kevin')
  },
  chaside: {
    questions: require('./questions/chaside.json'),
    solver: require('./solvers/chaside')
  }
};

router.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/docs/index.html'));
});

router.get('/sample', (req,res) => {
  res.sendFile(path.join(__dirname+'/sample/index.html'));
});

app.get('/', router);

app.get('/sample', router);

app.get('/questions', (req, res) => {
  if (!validateType(req.query.type, res, tests)) return;
  res.status(200).send({ success: true, data: tests[req.query.type].questions });
});

app.post('/answer', (req, res) => {
  if (!validateType(req.query.type, res, tests)) return;
  if (!validateAnswers(req.query.type, req.body, res, tests)) return;
  let answers = JSON.parse(req.body);
  tests[req.query.type].solver(answers, res);
});



app.listen(process.env.PORT);