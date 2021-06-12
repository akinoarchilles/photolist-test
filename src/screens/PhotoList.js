import React, { Component } from "react";
import { TouchableOpacity, FlatList, View, Image, Text, RefreshControl, Button, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Navigation } from "react-native-navigation";
import { getApi } from "../api";
import { pushScreen } from "../navigation";
import moment from 'moment';

export default class extends Component {
    static options() {
		return {
			topBar: {
				title: {
                    text: 'Flicker Photo App'
                },
                rightButtons: [
                    {
                        id: 'fav',
                        icon: require('../assets/love_red.png'),
                        color: 'red'
                    }
                ]
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
            pushScreen(this.props.componentId, 'Favorites')
        }
    }

    searchResult = (tag='') => {
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
    
                this.setState({ Photos: response, oldSearchTag: tag })
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

    renderItem = ({item, index}) => {
        let onItemPress = () => {
            pushScreen(this.props.componentId, 'PhotoDetail', {
                Photo: item
            })
        }
        return (
            <Card key={index} item={item} onPress={onItemPress}/>
        )
    }

    render() {
        const { isLoading, Photos, searchTag, refreshing } = this.state
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.searchBox}>
                    <View style={styles.row}>
                        <View style={{ flex: 9 }}>
                            <TextInput 
                                ref={(ref) => this._searchInput = ref}
                                value={searchTag}
                                onChangeText={(value) => this.setState({ searchTag: value })}
                                onSubmitEditing={() => this.searchResult(searchTag)}
                                placeholder={'Search by Tag'}/>
                        </View>
                        <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end' }} onPress={() => this.searchResult(searchTag)}>
                            <Image source={require('../assets/search.png')} style={{ width: 20, height: 20, resizeMode: 'cover' }}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center'}}>
                    {
                        isLoading ? (
                            <ActivityIndicator size={'large'}/>
                        ) : (
                            <FlatList
                                style={{ flex: 1 }}
                                data={Photos.items}
                                renderItem={this.renderItem}
                                keyExtractor={item => item.link}
                                refreshControl={
                                    <RefreshControl
                                        progressViewOffset={30}
                                        refreshing={refreshing}
                                        onRefresh={() => this.onRefresh()}
                                    />
                                }
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={this.emptyPhoto()}
                                showsVerticalScrollIndicator={false}/>
                        )
                    }
                </View>
            </View>
        )
    }
}

const Card = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <Image source={{ uri: item.media.m }} style={{ width: '100%', height: 300, resizeMode: 'cover', borderRadius: 10 }}/>
                <View style={styles.cardBody}>
                    <Text style={styles.author}>{item.author}</Text>
                    <Text style={[styles.title, styles.item]}>{item.title}</Text>
                    <Text style={[styles.published, styles.item]}>{item.published}</Text>
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
        marginVertical: 2,
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
        padding: 10,
        margin: 10
    },
    row: {
        flexDirection: 'row',
        overflow: 'visible'
    }
})