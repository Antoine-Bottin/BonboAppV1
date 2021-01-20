import React, {useState} from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux';

const { width, height } = Dimensions.get('window')

// Receiving Ited Data and Navigation
const CarouselItem = (props) => {
    const[loading, setLoading] = useState(true)
    var item;
    item=props.item

    var handleClick= (item) => {
        props.navigation.navigate('detailsActivity'), 
        props.sendActivityToDetail(item)
    }

    return (
    // Button to navigate to Caroussel Details
    <TouchableOpacity style={styles.cardView} onPress={() => handleClick(item)}>
        {/* Display of the Card Data */}
        <Image style={styles.image} source={{uri : item.picture}} onLoadEnd={(e) => setLoading(false) } />
        {loading ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#FF828B"/>:<></>}
        <View style={styles.textView}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.subtitle}</Text>
        </View>
    </TouchableOpacity>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        sendActivityToDetail: function(item) { 
          dispatch( {type: 'sendActivityToDetail', 
                    data:item}) 
      }
    }
  }
  
  export default connect(
    null, 
    mapDispatchToProps
)(CarouselItem);

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        width: width / 2.5,
        // height: height / 3.5,
        backgroundColor: 'white',
        marginTop: 10,
        marginRight: 10,
    },
    textView: {
        bottom: 0,
        marginBottom: 10,
    },
    image: {
        width: width / 2.5,
        height: height / 5,
        borderRadius: 10
    },
    itemTitle: {
        color: '#767676',
        marginTop: 7,
        fontSize: 13,
        //shadowColor: '#000',
       // shadowOffset: { width: 0.8, height: 0.8 },
       // shadowOpacity: 1,
        shadowRadius: 3,
        fontWeight: "bold",
    },
    itemDescription: {
        color: '#767676',
        fontSize: 10,
        fontWeight: "300",
        elevation: 5,
        shadowRadius: 3,
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
