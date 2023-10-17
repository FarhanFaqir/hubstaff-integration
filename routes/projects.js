const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {
    const response = await api.request('v2/organizations/105298/projects',{
        method: 'GET',
        json: true,
    });
    const body = JSON.parse(response.body);
    res.send(body)
});

module.exports = router;
