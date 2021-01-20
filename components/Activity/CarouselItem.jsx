import React, {useState} from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux';

const { width, height } = Dimensions.get('window')

// Receiving Ited Data and Navigation
const CarouselItem = (props) => {
    var item = props.item
    const handleClick =()=>{
    props.navigation.navigate('detailsActivity')
    props.sendActivityToDetail(item)
    }

    const[loading, setLoading] = useState(true)
    
    return (
    // Button to navigate to Caroussel Details
    <TouchableOpacity style={styles.cardView}
        onPress={() => handleClick() }>
        {/* Display of the Card Data */}
            <Image 
                style={styles.image} 
                source={{uri: item.picture}} 
                onLoadEnd={(e) => setLoading(false) }
            />
            {loading ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#FF828B"/>:<></>}
        
        <View style={styles.textView}>
            <Text style={styles.itemTitle}> {item.title}</Text>
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
        width: width - 45,
        height: height / 3,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
        backgroundColor:'#F2F2F2'
    },

    textView: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
        // left: 5,
    },
    image: {
        width: width - 45,
        height: height / 3,
        borderRadius: 10
    },
    itemTitle: {
        color: 'white',
        marginLeft: 10,
        fontSize: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0.8, height: 0.8 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        marginBottom: 5,
        fontWeight: "bold",
        elevation: 5
    },
    itemDescription: {
        color: 'white',
        fontSize: 18,
        marginLeft: 15,
        fontWeight: "200",
        elevation: 5,
        shadowOffset: { width: 0.8, height: 0.8 },
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowColor: '#000',
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

