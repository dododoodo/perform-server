// server  > api  > kakao.js
const express = require('express');
const axios = require('axios');
const naver = express.Router();


naver.get('/', async function (req, res) {
    const {access_token} = req.query;

    const profile = await axios.get('https://openapi.naver.com/v1/nid/me',{
        headers:{"Authorization":`Bearer ${access_token}`}
    })
    res.json(profile.data)
})

module.exports = naver;

