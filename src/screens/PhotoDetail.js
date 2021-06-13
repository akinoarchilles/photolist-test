import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Navigation } from "react-native-navigation";
import { pushScreen } from "../navigation";

const { width, height } = Dimensions.get('screen')

export default class extends Component {
    static options(passProps) {
        let titleText = passProps.Photo?.title.length > 15 ? passProps.Photo.title.substring(0, 15) + '...' : passProps.Photo.title
        return {
            topBar: {
                title: {
                    text: titleText
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

    onFavourite = () => {
        const { onFavourite } = this.props
        let { Photo } = this.state
        this.setState({ Photo })
        onFavourite && onFavourite(Photo)
    }

    render() {
        const { Photo } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Image source={{ uri: Photo.media.m }} style={{ width: '100%', height: 300, resizeMode: 'cover' }} />
                <View style={styles.cardBody}>
                    <Text style={styles.author}>{Photo.author}</Text>
                    <Text style={[styles.title, styles.item]}>{Photo.title}</Text>
                    <Text style={[styles.published, styles.item]}>{Photo.published}</Text>
                    <Text style={[styles.link, styles.item]} onPress={() => this.webView()}>View this photo on Flickr</Text>
                    <TouchableOpacity onPress={() => this.onFavourite() } style={styles.item}>
                        <Image source={Photo.isFavourite ? require('../assets/love_red.png') : require('../assets/love_grey.png')} style={{ width: 20, height: 20, resizeMode: 'cover', overflow: 'visible', padding: 3 }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        elevation: 5, 
        shadowRadius: 5,
        shadowOffset: {
            height: 2
        },
        shadowColor: 'black',
        shadowOpacity: .5,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
    },
    cardBody: {
        padding: 10
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    item: {
        marginVertical: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: 'normal'
    },
    published: {
        fontSize: 11,
        color: 'grey',
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline'
    }
})