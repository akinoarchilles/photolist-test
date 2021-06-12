import React, { Component } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';

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

    renderItem = ({item, index}) => {
        return (
            <Card key={index} item={item}/>
        )
    }

    render() {
        const { Photos } = this.state
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1}}
                    data={Photos.items}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.published}
                />
            </View>
        )
    }
}

const Card = ({item}) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.media.m }} style={{ width: '100%', height: 300, resizeMode: 'cover' }}/>
            <View style={styles.cardBody}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.published}>{item.published}</Text>
                <Text style={styles.author}>{item.author}</Text>
            </View>
        </View>
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
        shadowOpacity: 1,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden'
    },
    cardBody: {
        padding: 10
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 12,
        fontWeight: 'normal'
    },
    published: {
        fontSize: 11,
        color: 'grey',
    },

})