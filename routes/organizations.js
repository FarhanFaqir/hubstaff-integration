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

function groupByUserId(data) {
  const groupedData = {};
  for (const record of data) {
    // console.log(record);
    const userId = record.user_id;
    if (!groupedData[userId]) {
      groupedData[userId] = {
        tracked_hours: 0,
        tracked: 0,
        member_id: record.member_id,
        user_id: record.user_id
      };
    }

    groupedData[userId].tracked_hours += record.trackedHours;
    groupedData[userId].tracked += record.tracked;
  }

  return groupedData;
}


router.get('/activities', async function (req, res) {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);
    const isoStartDate = currentDate.toISOString();
    const isoEndDate = endDate.toISOString();

    const response1 = await api.request(`v2/organizations/105297/activities?time_slot[start]=${isoStartDate}&time_slot[stop]=${isoEndDate}&page_limit=500`, {
        method: 'GET',
        json: true
      });
    const response2 = await api.request(`v2/organizations/105298/activities?time_slot[start]=${isoStartDate}&time_slot[stop]=${isoEndDate}&page_limit=500`, {
        method: 'GET',
        json: true
      });
    let internalTeamData = JSON.parse(response1.body);
    const externalTeamData = JSON.parse(response2.body);
    internalTeamData.activities = internalTeamData.activities.concat(externalTeamData.activities);
 
    let updatedActivities = {};
    const userToMemberId = {
      329418: 8,
      1980844: 7,
      1614143: 4,
      2253498: 10
  };
    updatedActivities.activities = internalTeamData.activities.map(activity => {      
        const memberId = userToMemberId[activity.user_id] || null;
        const trackedHours = activity.tracked / 3600;
        return {
          ...activity,
          member_id: memberId,
          trackedHours: trackedHours,
        };
      });

    const groupedData = groupByUserId(updatedActivities.activities);

    // console.log(groupedData);

    res.send(groupedData)
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
