const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const kakao = require('./kakao');
const naver = require('./naver');
const kcisa = require('./kcisa');

app.use(cors({
    origin: 'https://performance-swart.vercel.app'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/kakao', kakao);
app.use('/naver', naver);
app.use('/kcisa', kcisa);

module.exports = app;
