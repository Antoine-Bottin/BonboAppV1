import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, Image, Dimensions, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

const { width, height } = Dimensions.get('window')
console.log(width)
export default function ArticleBlog({article}) {

    const[loading, setLoading] = useState(true);

    const openLink = useCallback(async () => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(article.url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(article.url);
        } else {
          Alert.alert(`Impossible d'ouvrir le lien : ${article.url}`);
        }
      }, [article.url]);

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => openLink()}>
        {/* Display of the Card Data */}
        <Image style={styles.image} source={{uri : article.image}} onLoadEnd={(e) => setLoading(false) } />
        {loading ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#FF828B"/>:<></>}
        <View style={styles.textView}>
            <Text style={styles.itemTitle}>{article.title}</Text>
            <Text style={styles.itemDescription}>{article.timestamp.toDate().toLocaleDateString('fr-FR')}</Text>
        </View>
    </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    cardContainer: {
        width: width/2.3,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
    },
    textView: {
        bottom: 0,
        marginBottom: 10,
    },
    image: {
        width: width / 2.3,
        height: width / 2.5,
        borderRadius: 10
    },
    itemTitle: {
        color: '#767676',
        marginTop: 7,
        fontSize: 13,
        marginBottom: 5,
        fontWeight: "bold",
        textAlign:'left'
    },
    itemDescription: {
        color: '#767676',
        fontSize: 10,
        fontWeight: "300",
        //elevation: 5
    },
    activityIndicator : { 
        position: 'absolute', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
