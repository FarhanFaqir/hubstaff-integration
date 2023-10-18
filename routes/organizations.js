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
    // res.send(body.organizations)
    res.render('organizations', {
        title: 'Organization list',
        organizations: body.organizations || []
    });
});


router.get('/activities', async function (req, res, next) {
    const response = await api.request(`v2/organizations/105297/activities?time_slot[start]=${req.query.startTime}&time_slot[stop]=${req.query.endTime}`, {
        method: 'GET',
        json: true
      });
    const body = JSON.parse(response.body);
    res.send(body)
});

router.get('/timesheets', async function (req, res, next) {
    const response = await api.request('v2/organizations/105298/timesheets?date[start]=2023-10-17T08:00:00Z&date[stop]=2023-10-18T16:00:00Z&status=open', {
        method: 'GET',
        json: true
      });
    const body = JSON.parse(response.body);
    res.send(body)
});

router.get('/tasks', async function (req, res, next) {
    const response = await api.request(`v2/organizations/${req.query.task}/tasks`, {
        method: 'GET',
        json: true
      });
    const body = JSON.parse(response.body);
    res.send(body)
});

router.get('/users', async function (req, res, next) {
    const response = await api.request(`v2/users/${req.query.userId}`, {
        method: 'GET',
        json: true
    });

    const body = JSON.parse(response.body);
    res.send(body);
});









module.exports = router;
