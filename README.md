# React Native Image Sender Example
An example of how to transfer the image to the server using [React Native](https://facebook.github.io/react-native/) and [React Native Image Picker](https://github.com/marcshilling/react-native-image-picker).

* [Image Sender Example](#image-server-example)
* [Server example](#server-example)

## Image Server Example
```javascript
var ImagePicker = require('react-native-image-picker');
var options = {
    title: 'Select Avatar',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
var URLSERVER = 'http://myserver/photo/upload';

export default class ReactNativeImageSenderExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: { uri: 'https://facebook.github.io/react/img/logo_og.png' }
        };
    }

    selectImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });

                this.sendPhoto({
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName,
                });
            }
        });
    }

    sendPhoto(photo) {
        var body = new FormData();
        var xhr = new XMLHttpRequest();

        body.append('upload', photo);

        xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 200) {
                console.log('Image sent');
            } else {
                console.warn('error');
            }
        };

        xhr.open('POST', URLSERVER);
        xhr.send(body);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <TouchableHighlight onPress={this.selectImage.bind(this)}>
                    <Text style={styles.instructions}>Select Image</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
```

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
