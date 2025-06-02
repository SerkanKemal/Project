const { spawn } = require('child_process');
const path = require('path');

// Старт на Python API-то
const python = spawn('python', ['python-ocr-api/ocr_api.py']);

python.stdout.on('data', (data) => {
  console.log(`Python OCR: ${data}`);
  if (data.toString().includes('Running on http://')) {
    // Изчакваме малко и стартираме JS клиента
    setTimeout(() => {
      require('./js-client/index');
    }, 2000); // изчакване OCR сървъра да се вдигне
  }
});

python.stderr.on('data', (data) => {
  console.error(`Python error: ${data}`);
});


const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

app.post('/ocr', async (req, res) => {
  const form = new FormData();
  form.append('image', fs.createReadStream('uploads/image.png'));

  try {
    const response = await axios.post('http://localhost:5000/ocr', form, {
      headers: form.getHeaders()
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'OCR failed' });
  }
});
