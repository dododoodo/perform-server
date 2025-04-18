require('dotenv').config(); // .env 로딩

const express = require('express');
const kakao = express.Router();
const axios = require('axios');
const { MongoClient } = require('mongodb');

// MongoDB 설정
const uri = "mongodb+srv://nsa10050:rlaehdus0823@gotoashow.9ufcsbx.mongodb.net/?retryWrites=true&w=majority&appName=gotoashow";
const client = new MongoClient(uri);

let collection;

async function dataCtrl() {
    await client.connect();
    const db = client.db('gotoashow');
    collection = db.collection('member');
    console.log("MongoDB 연결 완료");
}

initDB();

async function initDB() {
    await dataCtrl();
}

kakao.get('/', async function (req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        const clientId = process.env.KAKAO_CLIENT_ID;
        const redirectUri = process.env.CLIENT_REDIRECT_URI;

        let tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            params: {
                grant_type: "authorization_code",
                client_id: clientId,
                redirect_uri: redirectUri,
                code
            }
        });

        const access_token = tokenResponse.data.access_token;

        let userResponse = await axios.post("https://kapi.kakao.com/v2/user/me", null, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        });

        let userData = userResponse.data;

        let existingUser = await collection.findOne({ id: userData.id });

        if (!existingUser) {
            await collection.insertOne({
                id: userData.id,
                name: userData.properties.nickname
            });
        }

        res.json({
            access_token,
            properties: userData.properties
        });

    } catch (error) {
        console.error("카카오 로그인 처리 중 오류 발생:", error.response?.data || error.message);
        res.status(500).json({
            error: '카카오 로그인 처리 중 오류 발생',
            details: error.response?.data || error.message
        });
    }
});

module.exports = kakao;
