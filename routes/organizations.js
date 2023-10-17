const express = require('express');
const api = require('../utils/api');
const router = express.Router();

/* GET organizations listing. */
router.get('/', async function (req, res, next) {
    const response = await api.request('v2/organizations',{
        method: 'GET',
        json: true,
    });
    const body = JSON.parse(response.body);
    res.send(body.organizations)
    // res.render('organizations', {
    //     title: 'Organization list',
    //     organizations: body.organizations || []
    // });
});


router.get('/activities', async function (req, res, next) {
    const response = await api.request('v2/organizations/105297/activities?time_slot[start]=2023-06-25T08:09:26.597143Z&time_slot[stop]=2023-06-30T08:09:26.597143Z', {
        method: 'GET',
        json: true
      });
    const body = JSON.parse(response.body);
    res.send(body)
});

router.get('/users', async function (req, res, next) {

    const response = await api.request('v2/users/329418', {
        method: 'GET',
        json: true
    });

    const body = JSON.parse(response.body);
    res.send(body);
});









module.exports = router;
