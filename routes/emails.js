const express = require('express');
const path = require('path');
const fs = require('fs');
const emlformat = require('eml-format');

const router = express.Router();

const rootPath = path.resolve('./');
console.log('rootPath', rootPath);

const folderPath = path.join(rootPath, 'output');
console.log("🚀 ~ file: emails.js ~ line 10 ~ folderPath", folderPath)

/* GET emails listing. */
router.get('/', function(req, res, next) {
  try {
    const files = fs.readdirSync(folderPath);
    const fileObjects = files.map(file => {
      const emailPath = path.join(folderPath, file, 'content.eml');
      let ret = {
        filename: file.replace('.html', ''),
        stat: fs.statSync(emailPath)
      }
      return ret;
    });
    console.log("🚀 ~ file: emails.js ~ line 25 ~ router.get ~ fileObjects", fileObjects)
    res.render('emails', { files: fileObjects });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error in reading all files of emails');
  }
});

/* GET an email */
router.get('/:folderName', function(req, res, next) {
  try {
    const folderName = req.params.folderName;
    const emailPath = path.join(folderPath, folderName, 'content.eml');
    console.log("🚀 ~ file: emails.js ~ line 31 ~ router.get ~ emailPath", emailPath)
    const eml = fs.readFileSync(emailPath, 'utf-8');
    emlformat.read(eml, (err, data) => {
      if (err) {
        res.status(500).send(err);
      };
      // console.log(data); //List of files
      console.log("Done!");
      res.send(data.html);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error in reading a specified email');
  }
});

module.exports = router;
