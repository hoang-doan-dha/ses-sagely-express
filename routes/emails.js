const express = require('express');
const path = require('path');
const fs = require('fs');
const emlformat = require('eml-format');

const router = express.Router();

// config here
const rootPath = path.resolve('../ses-mock');

const folderPath = path.join(rootPath, 'output');

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
    const eml = fs.readFileSync(emailPath, 'utf-8');
    emlformat.read(eml, (err, data) => {
      if (err) {
        res.status(500).send(err);
      };
      // console.log(data); //List of files
      res.send(data.html);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error in reading a specified email');
  }
});

/* DELETE an email */
router.delete('/:folderName', function(req, res, next) {
  const folderName = req.params.folderName;
  const emailPath = path.join(folderPath, folderName);
  fs.stat(emailPath, function (err, stats) { 
    if (err) {
      console.error(err);
      res.status(500).send('Error in reading a specific email');
      return;
    }
    fs.rmdir(emailPath, { recursive: true }, function(err){
      if (err) {
        console.error(err);
        res.status(500).send('Error in deleting a specific email');
        return;
      };
      res.send('Delete the email successfully');
    });  
  });
});

module.exports = router;
