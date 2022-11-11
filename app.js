const port = 80;
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const alert = require('alert');
// const util = require('util');
// const unlinkAsync = util.promisify(fs.unlink);

const directoryPath = path.join(__dirname, '/views/images/');

// make all the files in 'public' available
app.use(express.static(__dirname + '/views'));

console.log('App started');

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

//You can use this to check if your server is working
app.get('/', (req, res) => {
  fs.readdir(directoryPath, function(err, files) {
    let data = [];

    if (err) {
      res.writeHead(404);
      res.write('File not found');
      return console.log('Unable to scan directory: ' + err);
    } else {
      files.forEach(function(file) {
        if (file.endsWith(".mp4")) {
          const strings = file.split("|");
          data.push({
            timestamp: strings[0],
            title: strings[1].slice(0, -4),
            filename: file
          });
        }
      })
    }

    // Render HTML with data
    res.render('upload', {
      data: data
    });
  });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, directoryPath);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '|' + req.body.video_title + '.mp4');
  }
});

const maxSize = 20 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: function(req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /mp4/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype || extname) {
      return cb(null, true);
    }

    cb('File upload only supports the following filetypes - ' + filetypes, false);
  }
}).single('uploaded_file');

app.post('/fileUpload', function(req, res, next) {
  // Error MiddleWare for multer file upload, so if any
  // error occurs, the image would not be uploaded!
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // ERROR occurred (here it can be occurred due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.send(err);
    } else if (err) {
      next(err);
    } else {
      // SUCCESS, video successfully uploaded
      //res.send('Success, video uploaded!');
      alert('Success, video uploaded!');
      res.redirect('/');
    }
  })
});

app.post('/fileDelete', multer().none(), function(req, res, next) {
  let resultHandler = function(err) {
    if (err) {
      console.log('unlink failed', err);
    } else {
      console.log('file deleted');
      alert('Success, video deleted!');
      res.redirect('/');
    }
  };
  let filepath = directoryPath + req.body.delete_filename;

  fs.unlink(filepath, resultHandler);
});

app.listen(port, function(error) {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is listening on port ' + port);
  }
});
