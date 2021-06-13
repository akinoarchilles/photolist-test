import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { TouchableOpacity, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { pushScreen } from "../navigation";

export default class extends Component {
    static options() {
		return {
			topBar: {
				title: {
                    text: 'Favorites'
                },
			}
		}
	}

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            Photos: []
        }
    }
    
    componentDidMount() {
        AsyncStorage.getItem('Favorites', (_, Favorites) => {
            Favorites = JSON.parse(Favorites)
            this.setState({ Photos: Favorites })
        })
    }

    renderItem = ({item, index}) => {
        let onItemPress = () => {
            pushScreen(this.props.componentId, 'PhotoDetail', {
                Photo: item,
                onFavourite: onFavourite
            })
        }

        let onFavourite = () => {
            let { onFavourite } = this.props
            let { Photos } = this.state
            let idx = Photos.findIndex(e => e.link == item.link)
            if(idx > -1) { //found
                Photos[idx].isFavourite = !Photos[idx].isFavourite
            }
            this.setState({ Photos })
            onFavourite && onFavourite(item)
        }
        return (
            <Card key={index} item={item} onPress={onItemPress} onFavourite={onFavourite}/>
        )
    }

    emptyPhoto() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No favorites yet</Text>
            </View>
        )
    }

    render() {
        const { Photos } = this.state
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1}}
                    data={Photos}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.link + item.published + Math.random(0,9999999)}
                    ListEmptyComponent={this.emptyPhoto()}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
        )
    }
}

const Card = ({item, onPress, onFavourite}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <Image source={{ uri: item.media.m }} style={{ width: '100%', height: 300, resizeMode: 'cover', borderRadius: 10 }}/>
                <View style={styles.cardBody}>
                    <Text style={styles.author}>{item.author}</Text>
                    <Text style={[styles.title, styles.item]}>{item.title}</Text>
                    <Text style={[styles.published, styles.item]}>{item.published}</Text>
                    <TouchableOpacity onPress={onFavourite} style={ styles.item }>
                        <Image source={item.isFavourite ? require('../assets/love_red.png') : require('../assets/love_grey.png')} style={{ width: 20, height: 20, resizeMode: 'cover', overflow: 'visible' }}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
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
})