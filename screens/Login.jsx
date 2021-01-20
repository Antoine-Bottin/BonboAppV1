import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { db, authF, auth, database } from '../connection/firebase';
import * as Facebook from 'expo-facebook';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window')

function Login(props) {
  // at the lunch of the program, useEffect start and check if the user is already connected
    
  useEffect(() => {
      async function serchingLogUsers() {                               //Checking user
          auth.onAuthStateChanged(user => {                             // If user exist...
              if(user != null){
                  props.idUser(auth.currentUser.uid)                //Send Id From Facebook To Reducer
                  db.collection('users').doc(auth.currentUser.uid).get()
                    .then(function(doc) {
                      if (doc.exists) {
                        props.navigation.navigate('TabNavigator')         // And move to TabNavigator
                      } else {
                          // doc.data() will be undefined in this case
                          console.log("No such document!");
                      }
                    })
                    .catch(function(error) {
                    console.log("Error getting document:", error);
                });
              } else {
                console.log('no users loged')
              }
          })
      }
      serchingLogUsers();
    }, [])

  //Buton to connect with Facebook
  async function logInWithFacebook() {
    
    //app ID initialiting
    await Facebook.initializeAsync({
      appId: '661816107831400',
    });
    //detail of the type of request permissons
    const {
      type,
      token,
    } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
     
    if (type === 'success') {
      //Connection between Firebase and Facebook Authentification
      const credential = authF.FacebookAuthProvider.credential(token);
      // Catching pissible error or rejection
      auth.signInWithCredential(credential).catch((error) => {
        console.log(error)
      })
      //Store data from Facebook
      var userDataFacebook = auth.currentUser.providerData;

      //we MUST do !!

      //  ==> request from, firebase userDataFacebook[0].uid

      // creation fo an object with data information when th user is logged for the first time 
      const user = {
        name: userDataFacebook[0].displayName,
        email: userDataFacebook[0].email,
        expert:false,
        credit : 0,
        speciality:'',
        favoris: [],
        phoneNumber: userDataFacebook[0].phoneNumber,
        picture: userDataFacebook[0].photoURL,
        age: '',
        pregnancy: false,
        ifPregnancy: '',
        family: [
        //   {
        //   Type: {
        //     name: 'Nicolas',
        //     lastName: 'Ivorra',
        //     picture: '',
        //     age: 22,
        //   }
        // }
      ],
        hobbies: {
          hobbies1: false,
          hobbies2: true,
        },
        _id: auth.currentUser.uid,
      };
      // Add a new document in collection "users" with auth ID 
      db.collection('users').doc(auth.currentUser.uid).set(user);
      //passing the id of Facebook to Redux to keep the user on the same session outside of this page
      props.idUser(auth.currentUser.uid)
      //Immediatly navigation the main content activity
      props.navigation.navigate('TabNavigator')
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/backgroundLoginImage.jpg')} style={{ width: width, height: height, position: 'absolute' }}></Image>
      <LinearGradient
        // Button Linear Gradient
        start={{ x: 1, y: 1.9 }}
        end={{ x: 1, y: -0.2 }}
        colors={['rgba(187, 104, 104, 1)', 'rgba(255, 130, 139, 1)', 'transparent']}
        style={{ height: height, position: 'absolute', width: width }}>
      </LinearGradient>

      <Image source={require('../assets/bonbo_logo.png')} style={{ width: 53.2, height: 60, position: 'absolute', top: width / 2 }}></Image>
      
      <TouchableOpacity style={styles.facebookLogin} onPress={() => logInWithFacebook()}>
        <Image source={require('../assets/facebookLogo.png')} style={{ width: 20, height: 20 }}></Image>
        <Text style={{ color: 'white' }}>S'inscrire avec Facebook</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.mailLogin} onPress={() => props.navigation.navigate('LoginWithMail')}>
        <Image source={require('../assets/mailLogo.png')} style={{ width: 20, height: 20 }}></Image>
        <Text style={{ color: '#1D3A58' }}>S'inscrire par Email</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.alreadySign}>
        <Text style={{ color: "white" }}>
          Déjà inscrit ? Se connecter
          </Text>
      </TouchableOpacity>
    </View>
  );
}

function mapDispatchToProps(dispatch) {         // Redux send id from facebook. action name 'addId', value : id
  return {
    idUser: function (id) {
      dispatch({
        type: 'addId',
        idUser: id
      })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Login);


const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookLogin: {
    flexDirection: 'row',
    backgroundColor: '#0F7BF0',
    width: width / 1.2,
    height: 50,
    justifyContent: 'space-evenly',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 350,
  },
  mailLogin: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: "#1D3A58",
    borderWidth: 1,
    width: width / 1.2,
    height: 50,
    justifyContent: 'space-evenly',
    borderRadius: 25,
    alignItems: 'center',
  },
  alreadySign: {
    paddingTop: 50,
  }
});