/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image
} from 'react-native';

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

export default class ReactNativeImageSenderExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: { uri: 'https://facebook.github.io/react/img/logo_og.png' }
        };
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

                var photo = {
                    uri: response.uri,
                    type: response.type,
                    name: response.fileName,
                };

                var body = new FormData();
                body.append('upload', photo);
                body.append('title', 'A beautiful photo!');

                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = (e) => {
                    if (xhr.readyState !== 4) {
                        return;
                    }

                    if (xhr.status === 200) {
                        alert('ok');
                    } else {
                        console.warn('error');
                    }
                };

                xhr.open('POST', 'http://192.168.1.175:2203/58a32e6198ed262784c1f245/photo/upload');
                xhr.send(body);
                alert('end');
            }
        });
    }

    postPhoto(data) {
        fetch('http://192.168.1.175:2203/58a32e6198ed262784c1f245/photo/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: new FormData(data)
        })
            .then((response) => response.json())
            .then((responseJson) => alert(responseJson.status))
            .catch((error) => {
                console.error(error);
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    uploadAvatar: {
        width: 200,
        height: 200,
        borderRadius: 100
    }
});

AppRegistry.registerComponent('ReactNativeImageSenderExample', () => ReactNativeImageSenderExample);
