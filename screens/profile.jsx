import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, Text, View, Image, Button, Dimensions, Platform } from 'react-native';
import { db, auth, storage } from '../connection/firebase';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window')

function Profile() {
  const userId = auth.currentUser.uid
  const [user, setUser] = useState(null)
  const [image, setImage] = useState(null);

  useEffect(() => {
    db.collection('users').doc(userId).onSnapshot(doc => {
      if(doc.data().picture){
        setImage(doc.data().picture)
      }
      setUser(doc.data())
    })
  }, [])

  function alertCGV () {
    Alert.alert(
      // TODO : à remplir 
      "Conditions Générales de Vente",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  const pickImage = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64:true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
          });

          console.log(result)
          if (!result.cancelled) {
            const response = await fetch(result.uri)
            const blob = await response.blob()
            
            var image = new File([blob], `${userId}.jpg`, {
              type: "image/jpeg",
            });
          
            var storageRef = storage.ref();
            var userImagesRef = storageRef.child(`profileImages/${userId}.jpg`);
            //let text  = 'data:image/jpeg;base64,'+result.base64
            console.log(result.data)
            var downloadImage = userImagesRef.put(image)
            // var downloadImage = userImagesRef.putString(text, 'data_url').then(function(snapshot) {
            //   console.log('Uploaded a data_url string!');
            // });
            
            downloadImage.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {

              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;

                case 'storage/canceled':
                  // User canceled the upload
                  break;

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break;
              }
            }, function() {
              // Upload completed successfully, now we can get the download URL
              downloadImage.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                db.collection('users').doc(userId).set({picture:downloadURL}, {merge: true})
              });
            });           
          };
            setImage(result.uri);
        }
      }
  }
  
    function signOut(){
      
      Alert.alert(
        // TODO : à remplir 
        "Déconnexion",
        "Etes-vous sûr de vouloir vous déconnecter ?",
        [
          {
            text: "Annuler",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Oui, je me déconnecte", onPress: () => console.log('ok déconnexion')
            //auth.signOut() 
          }
        ],
        { cancelable: false }
      );
      
    }
  
    return (
      <ScrollView style={styles.container}>
      
      <FontAwesome
        name="power-off"
        style={{ color: "#FF6B6B", fontSize: 30, alignSelf:'flex-end', marginRight:20, marginTop:20}}
        onPress={signOut}
      /> 
        <View style={styles.iconContainer_profile}>
          {image ? <Image source={{ uri: image }} style={styles.picture_profile}/> : <FontAwesome
              name="user"
              style={{ backgroundColor: "#EEEEEE", color:'white', fontSize: 110, marginTop:20}}
            />}
          <TouchableOpacity style={{...styles.containerCamera}} onPress={() => pickImage()}>
            
             <FontAwesome
              name="search-plus"
              style={{ color: "#FF6B6B", fontSize: 30}}
            /> 
              {/* <Image style={{width:'60%', height:'60%'}} source={require('../assets/camera.png')}  /> */}
            
          </TouchableOpacity>
        </View>
        <Text style={styles.iconName_profile}>{auth.currentUser.displayName}</Text>
        <View style={styles.choicesContainer}>
          <TouchableOpacity style={styles.choicesTextContainer_profile}>
            <Image style={styles.iconChoices_profile}  source={require('../assets/family.png')}/>
              <Text style={styles.choicesText_profile}>Ma famille</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choicesTextContainer_profile}>
          <Image style={styles.iconChoices_profile} source={require('../assets/interest.png')}/>
            <Text style={styles.choicesText_profile}>Centres d'intérêts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choicesTextContainer_profile}>
          <Image style={styles.iconChoices_profile} source={require('../assets/Settings.png')}/>
            <Text style={styles.choicesText_profile}>Paramètres</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addFriends}>
          <Text style={styles.addFriendsText}>Invite tes amies et gagne une réduction de 15%</Text>
        </View>
        <TouchableOpacity onPress={() => alertCGV()}>
           <Text style={styles.CGV_profile}>CGV & CVI</Text>
        </TouchableOpacity>
       
      </ScrollView>
    );
  }
  
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  iconContainer_profile:{
    flex:1,
    alignSelf:'center',
    alignItems:'center',
    height:150,
    backgroundColor:'#EEEEEE',
   // borderColor:'#FF6B6B',
    //borderWidth:1,
    width:150,
    borderRadius:100,
  },
  picture_profile:{
    height:'100%',
    width:'100%',
    borderRadius:100,
    borderColor:'#EEEEEE',
    borderWidth:1,
  },
  iconName_profile:{
    fontSize:27,
    color:'#767676',
    alignSelf:'center',
    marginTop:20

  },
  choicesContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    height:100,
    marginTop:30,
  },
  choicesTextContainer_profile:{
    justifyContent:'center',
    width:width/3.5,
    height:100,
    margin:'2%',
    borderRadius:20,
    backgroundColor:'#EEEEEE',   
  },
  choicesText_profile:{
    fontSize:15,
    color:'black',
    textAlign:'center',
    alignSelf:'center',
    marginTop:5
    
  },
  iconChoices_profile:{
    height:35,
    width:35,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
  },
  
  CGV_profile:{
    textAlign:'center',
    color:'black',
    marginTop:'10%'
  },
  containerCamera:{
    height:50,
    width:50,
    bottom:50,
    left:60,
    borderRadius:100, 
    backgroundColor:'#EEEEEE',
    display:'flex', 
    alignItems:'center', 
    textAlign:'center',
    paddingLeft:3,
    justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
  },
  addFriends:{
    backgroundColor:'#EEEEEE',
    height:height/5,
    width:width/1.1,
    alignSelf:'center',
    justifyContent:'center',
    marginTop:40,
    borderRadius:20,

  },
  addFriendsText:{
    textAlign:'center',
    fontSize:19,
  }
})