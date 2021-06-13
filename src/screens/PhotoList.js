import React, { Component } from "react";
import { TouchableOpacity, FlatList, View, Image, Text, RefreshControl, Button, StyleSheet, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Navigation } from "react-native-navigation";
import { getApi } from "../api";
import { pushScreen } from "../navigation";
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class extends Component {
    static options() {
		return {
			topBar: {
				title: {
                    text: 'Flickr Photo App'
                },
                rightButtons: [
                    {
                        id: 'fav',
                        icon: require('../assets/love_red.png'),
                        color: 'red'
                    }
                ],
                backButton: {
                    visible: false
                }
			}
		}
	}

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            Photos: [],
            searchTag: '',
            oldSearchTag: '',
            refreshing: false
        }
        this._searchInput = null
        Navigation.events().bindComponent(this)
    }

    navigationButtonPressed({buttonId}) {
        if(buttonId === 'fav') {
            pushScreen(this.props.componentId, 'Favorites', {
                onFavourite: this.onFavourite
            })
        }
    }

    searchResult = (tag='', paging=false) => {
        if(!paging) this.setState({ Photos: [] })
        this.setState({ isLoading: true })
        getApi(tag, (response) => {
            if(response) {
                //pre-process data to avoid redundant render process
                let Photos = response.items
                Photos.map(e => {
                    e.author = e.author.split('"')[1]
                    e.published = moment(e.published).format('DD MMMM YYYY HH:mm')
                    return e
                })
                if(paging) {
                    let statePhotos = this.state.Photos
                    Array.prototype.push.apply(statePhotos, Photos)
                    Photos = statePhotos
                }
                this.setState({ Photos: Photos, oldSearchTag: tag })
            }
            this.setState({ isLoading: false, oldSearchTag: tag })
        })
    }

    componentDidMount() {
        this.searchResult()
    }

    onRefresh() {
        this.setState({ searchTag: '' })
        this.searchResult()
    }

    emptyPhoto() {
        let onPress = () => {
            this.setState({ searchTag: '' }, () => {
                this._searchInput.focus()
            })
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flexWrap: 'wrap', textAlign: 'center' }}>No photos with tag "{this.state.oldSearchTag}"</Text>
                <Button title={'Try Again'} children={'Try Again'} onPress={() => onPress()}/>
            </View>
        )
    }

    onFavourite = (item) => {
        let { Photos } = this.state
        var idx = Photos.findIndex(e => e.link == item.link)
        if(idx > -1) { //found
            Photos[idx].isFavourite = !Photos[idx].isFavourite
        }
        this.setState({ Photos }, () => {
            const { Photos } = this.state
            AsyncStorage.getItem('Favorites', (_, Favorites) => {
                if(Favorites) {
                    Favorites = JSON.parse(Favorites)
                    if(item.isFavourite) Favorites.push(item)
                    else{
                        let index = Favorites.findIndex(e => e.link == item.link)
                        if(index > -1) { //found
                            Favorites.splice(index,1)
                        }
                    }
                    AsyncStorage.setItem('Favorites', JSON.stringify(Favorites))
                }
                else {
                    Favorites = []
                    Favorites.push(item)
                    AsyncStorage.setItem('Favorites', JSON.stringify(Favorites))
                }
            })
        })
    }

    renderItem = ({item, index}) => {
        let onItemPress = () => {
            pushScreen(this.props.componentId, 'PhotoDetail', {
                Photo: item,
                onFavourite: this.onFavourite
            })
        }
        return (
            <Card key={index} item={item} onPress={onItemPress} onFavourite={() => this.onFavourite(item)}/>
        )
    }

    onEndReached = ({ distanceFromEnd }) => {
        if(distanceFromEnd < 100) return
        this.searchResult('', true)
    }

    render() {
        const { isLoading, Photos, searchTag, refreshing } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.searchBox}>
                    <View style={styles.row}>
                        <View style={{ flex: 9 }}>
                            <TextInput 
                                ref={(ref) => this._searchInput = ref}
                                value={searchTag}
                                onChangeText={(value) => this.setState({ searchTag: value })}
                                onSubmitEditing={() => this.searchResult(searchTag)}
                                placeholder={'Search by Tag'}
                                placeholderTextColor={'grey'}
                                style={{ color: 'black' }}/>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => this.searchResult(searchTag)}>
                            <Image source={require('../assets/search.png')} style={{ width: 20, height: 20, resizeMode: 'cover', padding: 3 }}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center'}}>
                    {
                        isLoading && Photos.length <= 0 ? (
                            <ActivityIndicator size={'large'} color="lightblue"/>
                        ) : (
                            <FlatList
                                style={{ flex: 1 }}
                                data={Photos}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.link + Math.random(0,99999999)}
                                refreshControl={
                                    <RefreshControl
                                        progressViewOffset={30}
                                        refreshing={refreshing}
                                        onRefresh={() => this.onRefresh()}
                                    />
                                }
                                ListFooterComponent={isLoading && Photos.length > 0 ? <ActivityIndicator size={'large'} color="lightblue"/> : <Text style={{ textAlign: 'center' }}>Showing {Photos.length} items</Text>}
                                onEndReached={this.onEndReached}
                                onEndReachedThreshold={.9}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={!Photos.length <= 0 && isLoading ? this.emptyPhoto() : null}
                                showsVerticalScrollIndicator={false}/>
                        )
                    }
                </View>
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
    searchBox: {
        backgroundColor: 'lightgrey',
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        margin: 10
    },
    row: {
        flexDirection: 'row',
        overflow: 'visible',
        justifyContent: 'center'
    }
})