const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const multer = require('multer');
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/data/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: fileStorageEngine });

let isLogged = false;

const app = express();
app.engine('.hbs', hbs());
//or app.engine('.hbs', hbs({ extname: 'hbs', layoutsDir: './views/layouts', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/data/uploads')));
app.use(express.urlencoded({ extended: false })); //ASK: is this still needed?
//// app.use(express.json());

/* Specific endpoints */
app.use('/user*', (req, res, next) => {
  if(isLogged) next();
  else res.render('forbidden');
});


app.get(['/', '/home'], (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark' });
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: 'dark', name: req.params.name });
});

app.get('/contact', (req, res) => {
  res.render('contact', { layout: 'dark' });
});

/* ON FORM SUBMIT */
app.post('/contact/send-message', upload.single('image'), (req, res) => {
  console.log(req.file);
  try {
    const { author, sender, title, message } = req.body;
    const { filename, originalname } = req.file;

    if (author && sender && title && message && filename) {
      res.render('contact', { layout: 'dark', isSent: true, image: filename });
    }
  } catch (error) {
    res.render('contact', { layout: 'dark', isError: true });
  }
});

app.use((req, res) => {
  res.status(404).render('404');
  //or res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
