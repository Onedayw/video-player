const port = 80;
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const fsPromises = fs.promises;
const util = require('util');
const stat = util.promisify(fs.stat);
const alert = require('alert');

const directoryPath = path.join(__dirname, '/views/images/');

// make all the files in 'public' available
app.use(express.static(__dirname + '/views'));

console.log('App started');

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

async function getFiles(dir) {
  const subdirs = await fsPromises.readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const fullPath = path.resolve(dir, subdir);
    if ((await stat(fullPath)).isDirectory()) {
      return getFiles((fullPath));
    } else {
      if (subdir.endsWith(".mp4")) {
        const strings = subdir.split("|");
        return {
          timestamp: strings[0],
          title: strings[1].slice(0, -4),
          filename: subdir,
          list: dir.substring(dir.length - 5)
        };
      }
      return null;
    }
  }));
  return files.reduce((a, f) => a.concat(f), []).filter(n => n);
}

//You can use this to check if your server is working
app.get('/', (req, res, next) => {
  getFiles(directoryPath)
    .then(files => {
      let data1 = [];
      let data2 = [];
      let data3 = [];
      let data4 = [];
      let data5 = [];
      let data6 = [];
      let data7 = [];
      let data8 = [];

      files.forEach(file => {
        if (file.list == 'list1') {
          data1.push(file);
        } else if (file.list == 'list2') {
          data2.push(file);
        } else if (file.list == 'list3') {
          data3.push(file);
        } else if (file.list == 'list4') {
          data4.push(file);
        } else if (file.list == 'list5') {
          data5.push(file);
        } else if (file.list == 'list6') {
          data6.push(file);
        } else if (file.list == 'list7') {
          data7.push(file);
        } else if (file.list == 'list8') {
          data8.push(file);
        }
      });

      // Render HTML with data
      res.render('upload', {
        data1: data1.reverse(),
        data2: data2.reverse(),
        data3: data3.reverse(),
        data4: data4.reverse(),
        data5: data5.reverse(),
        data6: data6.reverse(),
        data7: data7.reverse(),
        data8: data8.reverse()
      });
    })
    .catch(e => console.error(e));
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, directoryPath + req.body.list_index);
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
