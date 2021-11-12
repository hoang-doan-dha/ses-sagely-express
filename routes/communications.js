const express = require('express');
const util = require('util');
const { response } = require('../app');
const exec = util.promisify(require('child_process').exec);

const router = express.Router();

const AVAILABLE_CLI_LIST = [
  'cognitoCustomMessage',
  'eventSchedule',
  'eventReminder',
  'familyEmailSend',
  'notifyFamilyMessage',
  'notifyResidentMessage',
  'scheduleMessage',
];

async function runCommandLine(commandLine) {
  let cli = 'cd ../sagely-communications/ && grunt run-';
  if (!commandLine) return new Error('The command line is empty.');
  if (!AVAILABLE_CLI_LIST.includes(commandLine)) return new Error('The command line is not supported right now. Please try another one.');
  try {
    const endCLI = cli.concat(commandLine);
    const response = await exec(endCLI);
    console.log('stdout:', response.stdout);
    console.log('stderr:', response.stderr);
    return response;
  } catch (error) {
    console.log("🚀 ~ file: communications.js ~ line 29 ~ runCommandLine ~ error", error)
    return error;
  }
}

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.render('communications');
});

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const response = await runCommandLine(req.body.command);
  res.render('communications', { response, command: req.body.command });
});

module.exports = router;