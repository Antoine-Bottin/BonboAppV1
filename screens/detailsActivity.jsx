import React, { useState, useEffect } from 'react'
import { Alert, View, Text, StyleSheet, Image, ScrollView, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native'
import CarouselActi from '../components/Activity/CarouselActi'
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { db, auth } from '../connection/firebase';
import firebase from 'firebase';
const { width, height } = Dimensions.get('window');

import { useIsFocused } from '@react-navigation/native';

const DetailsActivity = (props) => {
  //Receiving idUser from Redux
  const activity = props.activityData
  const [favorites, setFavorites] = useState([])
  const [similar, setSimilar] = useState([])
  const isFocused = useIsFocused();
  
  //Fetching User data everytime we display detailActivity screen
  useEffect(() => {
    let mounted = true;
    function fetchingData() {
      //Receiving DocData Array with previous ID of Favorite 
      db.collection('users').doc(auth.currentUser.uid).onSnapshot(function (doc) {
        if (mounted) {
          // Storing of favFavorite into hooks state (Array of ID's)
          setFavorites(doc.data().favoris)
        }
      })
    }
    //LunchingUseEffect only if the screen is visible
    if (isFocused) {
      fetchingData()
    }
    setSimilar(props.listActivities.filter(activityInList => (activity.category === activityInList.category && activity.title != activityInList.title)))
    return () => mounted = false;
  }, [isFocused])

  //Adding or Delete Id activity into Array of user's favorites
  const handleClickHeart = () => {
    let user = db.collection('users').doc(auth.currentUser.uid).get()
      .then(function(doc) {
        if(doc.exists){
          if(doc.data().favoris.includes(activity.id)){
            db.collection('users').doc(auth.currentUser.uid).update({
              favoris: firebase.firestore.FieldValue.arrayRemove(activity._id)})
          } else {
            db.collection('users').doc(auth.currentUser.uid).update({
            favoris: firebase.firestore.FieldValue.arrayUnion(activity._id)})
          }
        }
      })
    };

    const submitReservation = () =>
    // TODO : proposer les créneaux disponibles et envoyer mail avec choix

    Alert.alert(
      "Demande envoyée",
      "Vous recevrez une confirmation de votre inscription par email ou serez contacté par nos équipes dans les plus brefs délais",
      [
        { text: "OK", onPress: () => props.navigation.navigate('Activités') }
      ],
      { cancelable: false }
    );
    
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView >
        <View style={{ width: width - 45, height: height / 3 }}>
          <Image source={{ uri: activity.picture }} style={styles.mainImage}></Image>
          <TouchableOpacity style={styles.heartButton} onPress={handleClickHeart}>
            <Image 
              source={favorites.includes(activity.id)? require('../assets/favoriteHeartRed.png'): require('../assets/favoriteHeartGrey.png')} 
              style={styles.heart}></Image>
          </TouchableOpacity>
          <Text style={styles.header}>{activity.title} </Text>
          <Text style={styles.description}>{activity.subtitle}</Text>
        </View>

        <View>
          <View style={styles.flex}>
            <View style={styles.elements}>
              <Image source={require('../assets/price.png')} style={styles.logo1}></Image>
              <Text style={styles.details}>{activity.price}€</Text>
            </View>
            <View style={styles.elements}>
              <Image source={require('../assets/location.png')} style={styles.logo1}></Image>
              <Text style={styles.details}>{activity.location.city}</Text>
            </View>
            <View style={styles.elements}>
              <Image source={require('../assets/family.png')} style={styles.logo1}></Image>
              <Text style={styles.details}>{activity.family}</Text>
            </View>
            <View style={styles.elements}>
              <Image source={require('../assets/agendaPurple.png')} style={styles.logo1}></Image>
              <Text style={styles.details}>{activity.openingTime}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.ReservationButton} onPress={() => submitReservation()}>
          <Text style={styles.TextButtonReservation}>Demande de réservation</Text>
        </TouchableOpacity>

        <Text style={styles.TitleDesc}>Description :</Text>
        <View style={styles.detailViewDescription}>
          <Text style={styles.detailDescription}>
            {activity.description}
          </Text>
        </View>

        <Text style={styles.popular}>Activités similaire : </Text>
        <CarouselActi data={similar} navigation={props.navigation}></CarouselActi>
      </ScrollView>
    </SafeAreaView>
  )
}

function mapStateToProps(state) {
  return { activityData: state.activity, idUser: state.idUser, listActivities: state.listActivities }
}

export default connect(
  mapStateToProps,
  null
)(DetailsActivity);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  mainImage: {
    position: "absolute",
    height: height / 3,
    width: width,
  },
  heartButton: {
    position: "absolute",
    right: -30,
    top: 30,
    width: 50,
    height: 50,
    backgroundColor: '#C4C4C4',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  heart: {
    position: "absolute",
    width: 31,
    height: 30,
  },
  logoFamily: {
    width: 18,
    height: 18,
  },
  popular: {
    paddingLeft: 20,
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: '#767676',
    //fontFamily: 'Roboto'
  },
  TextButtonReservation: {
    fontSize: 21,
    color: 'white',
  },
  ReservationButton: {
    marginTop: 25,
    backgroundColor: '#FF828B',
    borderRadius: 70,
    padding: 15,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailViewDescription: {
    marginLeft: 23,
    marginRight: 23,
  },
  detailDescription: {
    marginTop: 10,
    fontSize: 13,
  },
  logo1: {
    width: 25,
    height: 25,
  },
  elements: {
    alignItems: 'center',
    marginTop: 12,
  },
  flex: {
    marginTop: 23,
    flexDirection: 'row',
    justifyContent: "space-around",
    width: width,
  },
  details: {
    fontSize: 16,
    color: "#767676"
  },
  header: {
    position: "absolute",
    bottom: 35,
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 23,
    marginLeft: 23,
    color: "white"
  },
  TitleDesc: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 23,
    marginLeft: 23,
    color: "#767676"
  },
  description: {
    position: "absolute",
    bottom: 5,
    fontSize: 20,
    fontWeight: "normal",
    marginLeft: 23,
    color: "white",
  }
})