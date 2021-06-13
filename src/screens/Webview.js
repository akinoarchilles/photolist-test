import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Navigation } from "react-native-navigation";
import { pushScreen } from "../navigation";
import WebView from "react-native-webview";

const { width, height } = Dimensions.get('screen')

export default class extends Component {
    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: 'Flickr Web'
                },
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            Photo: props.Photo
        }
        Navigation.events().bindComponent(this)
    }

    webView() {
        const { Photo } = this.state
        pushScreen(this.props.componentId, 'Webview', {
            url: Photo.link
        })
    }

    render() {
        const { url } = this.props
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: url }}
                    scalesPageToFit={true}>
                </WebView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
})