const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const router = express.Router();

async function runScheduledMessage() {
  try {
    // CONFIG PATH HERE
    const response = await exec('cd ../sagely-communications/ && grunt run-scheduleMessage');
    console.log('stdout:', response.stdout);
    console.log('stderr:', response.stderr);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const response = await runScheduledMessage();
  res.render('scheduledMessage', { response });
});

module.exports = router;