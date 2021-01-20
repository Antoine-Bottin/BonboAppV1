import React, {useEffect, useState} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert,
  Modal,
  TouchableHighlight,
  Dimensions, 
  TextInput 
} from 'react-native';
import { db, auth } from '../connection/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import {connect} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window')

function LoginWithMail(props) {
    const [valueName, setValueName] = useState('');
    const [valueMail, setValueMail] = useState('');
    const [valuePassword, setValuePassword] = useState('');
    const [valuePasswordVerif, setValuePasswordVerif] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [textModal, setTextModal] = useState('')
   
    let createUser =  (userLogged) =>{
      const userToCreate = {                                                    //Adding data to the new User
        name: userLogged.displayName,
        email: userLogged.email,
        expert:false,
        credit : 0,
        favoris: [],
        phoneNumber: '',
        picture: '',
        age: '',
        pregnancy: false,
        ifPregnancy: '',
        family: [
          //  {
          //   name: 'Nicolas',
          //   lastName: 'Ivorra',
          //   picture: '',
          //   age: 22,
          // }
        ],
        hobbies: {
          hobbies1: false,
          hobbies2: true,
        },
        _id: userLogged.uid,
      };
      db.collection('users').doc(userLogged.uid).set(userToCreate); //Send new User to firestore. Collection User, name of the document: value of Id from facebook
      props.idUser(userLogged.uid)                                             //Send Id from Facebook  to Reducer
      props.navigation.navigate('TabNavigator')                                     // Navigate to TabNavigator
    }

    var dataTransit = () => {
      // ajouter condition nom complet champ rempli
      if(valuePassword === valuePasswordVerif){
        auth.createUserWithEmailAndPassword(valueMail, valuePassword)
          .then(() => {
            auth.currentUser.updateProfile({
              displayName: valueName,
              photoURL: "https://firebasestorage.googleapis.com/v0/b/bonboapp-edda4.appspot.com/o/user.png?alt=media&token=dc3bd968-0f27-491f-8dff-4f65817d9d21"
            }).then(function() {
              createUser(auth.currentUser)
            }).catch(function(error) {
              console.log(error)
            });
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if(errorMessage === 'The email address is already in use by another account.'){
              setTextModal('Cette adresse email est déjà utilisée, veuillez vous reconnecter avec vos identifiants ou choisir une autre adresse pour créer un compte')
              setModalVisible(true)
            }
          });
      } else {
        setTextModal('Veuillez saisir des mots de passe identiques pour valider votre inscription!')
        setModalVisible(true)
        
      }
    }

    return (
      <KeyboardAwareScrollView  
        enableAutomaticScroll={true}
      >
        <Modal
        animationType="slide"
        transparent={true}
        
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
      <Text style={styles.modalText}>{textModal}</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#FF828B" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
        {/* <View style={{backgroundColor:'blue', flex:1, height:height}}><Text>TEST</Text></View> */}
        <View 
        style={styles.container}
        >
          <Image source={require('../assets/backgroundLoginImage.jpg')} style={{width: width, height: height, position: 'absolute'}}></Image>
          <LinearGradient
          // Button Linear Gradient
          start={{x: 1, y: 1.9}}
          end={{x: 1, y: -0.2}}
          colors={[ 'rgba(187, 104, 104, 1)','rgba(255, 130, 139, 1)', 'transparent']}
          style={{ height: height, position: 'absolute', width: width }}>
          
          </LinearGradient>
          <Image source={require('../assets/bonbo_logo.png')} style={{width: 53.2, height: 60, position: 'absolute', top: width/2}}></Image>
          <View style={{marginTop: '70%'}}>
              <TextInput style={styles.mailLogin} value={valueName} onChangeText={setValueName} placeholder={"Nom Complet"}></TextInput>
              <TextInput style={styles.mailLogin} autoCapitalize = 'none' value={valueMail} onChangeText={setValueMail} placeholder={"Adresse email"}></TextInput>
              <TextInput style={styles.mailLogin} secureTextEntry = {true} autoCapitalize = 'none' value={valuePassword} onChangeText={setValuePassword} placeholder={"Mot de passe"}></TextInput>
              <TextInput style={styles.mailLogin} secureTextEntry = {true} autoCapitalize = 'none' value={valuePasswordVerif} onChangeText={setValuePasswordVerif} placeholder={"Vérifiez votre mot de passe"}></TextInput>
          </View>
          <TouchableOpacity style={styles.Inscription} onPress={dataTransit}>
              <Text style={{color: 'white'}}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

function mapDispatchToProps(dispatch) {
  return {
    idUser: function(id) {
      dispatch({type:'addId',
      idUser:id})
    }
  }
}

export default connect(
  null, 
  mapDispatchToProps
  )(LoginWithMail);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:height,
  },
  Inscription: {
    backgroundColor: '#0F7BF0',
    width: width /1.2,
    height: 50,
    justifyContent: 'space-evenly',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  mailLogin: {
    flexDirection: 'row',
    color:'gray',
    backgroundColor: 'white',
    borderColor: "#1D3A58",
    borderWidth: 1,
    width: width /1.2,
    height: 50,
    justifyContent: 'space-evenly',
    borderRadius: 25,
    alignItems: 'center',
    paddingLeft: 25,
  },
  alreadySign: {
    paddingTop: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#FF828B",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
