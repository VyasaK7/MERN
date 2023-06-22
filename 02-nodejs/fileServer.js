const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const filesDirectory = path.join(__dirname, 'files');
app.use(express.static(filesDirectory));

app.get('/files', (req, res) => {
  fs.readdir(filesDirectory, (err, files) => {
    if (err) {
      console.error('Error reading files:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.status(200).json(files);
  });
});

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(filesDirectory, filename);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found');
      } else {
        console.error('Error reading file:', err);
        res.status(500).send('Internal Server Error');
      }
      return;
    }

    res.status(200).send(content);
  });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
