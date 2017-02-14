# React Native Image Sender Example
An example of how to transfer the image to the server using [React Native](https://facebook.github.io/react-native/) and [React Native Image Picker](https://github.com/marcshilling/react-native-image-picker).

* [Server example](#server-example)

## Server example
```javascript
'use strict';

var fs = require('fs');
var formidable = require('formidable');

var express = require('express');
var application = express();

application.use(express.static('./public'));

application.use(require('body-parser').json());
application.use(require('body-parser').urlencoded({extended: true}));

application.set('port', process.env.PORT || 2203);

application.post('/photo/upload', updatePhoto);

function updatePhoto (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/usersPhotos';

    form.on('file', function (field, file) {
        fs.rename(file.path, form.uploadDir + file.name);
    });

    form.on('error', function (err) {
        console.log("an error has occured with form upload");
        console.log(err);
        request.resume();
    });

    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(500);
        console.log(req.headers);
        console.log('fields: ');
        console.log(fields);
        console.log('files: ');
        console.log(files);
        res.send({
            status: 'OK'
        });
    });
};

application.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send({
        status: 'INVALID_URL'
    });
});

application.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500);
    res.type('text/plain');
    res.send({
        status: 'SERVER_ERROR'
    });
});

application.listen(application.get('port'), function () {
    console.log('Server start on '
        + application.get('port')
        + '. Ctrl + C for exit.');
});
```
