import React, { useState, useEffect } from 'react';
import {Alert, TextInput, StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth} from '../connection/firebase';
import ArticleBlog from '../components/articles/ArticleBlog';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window')
console.log(width)

export default function Bonbo({navigation}) {
  
  const [experts, setExperts] = useState([])
  const [articles, setArticles] = useState([])
  const [expertsToDisplay, setExpertsToDisplay]= useState([])
  const [inputExpert, setInputExpert] = useState('')

  useEffect(()=>{
     db.collection('experts').onSnapshot(snapshot =>{
      setExperts(snapshot.docs.map(doc => ({...doc.data(), id: doc.id})))
     })

     db.collection('articles').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setArticles(snapshot.docs.map(doc=>({...doc.data(), id:doc.id})))
     })
    },[]
  );

  useEffect(()=>{
   
    setExpertsToDisplay(
      experts.filter(expert => (expert.job.toLowerCase().includes(inputExpert.toLowerCase()) 
      || 
      expert.fullName.toLowerCase().includes(inputExpert.toLowerCase())) ))
    },[experts, inputExpert]
  );

  const getHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nos Experts Santé </Text>
        <Text style={styles.description}>
          Rapide, seul à seul avec un expert parental dans vos conversations
        </Text>
        <View style={styles.rowSearchBar}>
          <View style ={styles.searchBar}>
            <Image source={require('../assets/search.png')}></Image>
            <TextInput 
              style={styles.searchBarContent} 
              placeholder="Un métier, un nom ..." 
              underlineColorAndroid="transparent" 
              laceholderTextColor = "white"
              value={inputExpert} 
              onChangeText={setInputExpert}/>
          </View>
          <TouchableOpacity style={styles.ConversationButton} onPress={ () => navigation.navigate('Conversations')}>
            <Image source={require('../assets/conversationLogo.png')} style={{height: 20, width: 20}}></Image>
          <Text style={styles.textConversation}>Conversations</Text>
        </TouchableOpacity>

        </View>
      </View>
    )
  };
  const getFooter = () => {
    return (
      <View style={{alignItems:'center', width:'100%'}}>
        
        <TouchableOpacity style={styles.ExpertButton}>
          <Text style={styles.TextExpertBold}>OBTENIR UNE REPONSE D'EXPERT</Text>
          <View style={styles.flexRowText}>
            <Text style={styles.TextExpert}>pour seulement</Text>
            <Text style={styles.TextExpertBold}> 4,99€</Text>
          </View>
        </TouchableOpacity>
        <LinearGradient
          colors={['#ffffff','#FF828B','#FF828B','#ffffff']}
          start={{x: 0.0, y: 1.0}} end={{x: 1.0, y: 1.0}}
          style={{ height: 3, alignItems: 'center', justifyContent: 'center', width: width/1.2}}
        >
        </LinearGradient>

      </View>
    )
  };
 
  function searchRoom(expertId, expertUrl){
     db.collection('rooms').doc(`${expertId}-${auth.currentUser.uid}`).get().then(function(doc) {
      if (doc.exists){
        // go to room
        console.log('doc exists')
        navigation.navigate('Chat', {room: `${expertId}-${auth.currentUser.uid}`})
      } else {
        console.log('room not exists')
        
        db.collection('users').doc(auth.currentUser.uid).get().then(function(doc){
          let credit = doc.data().credit
          if(credit === 0){
            Alert.alert(
              "Crédit insuffisant",
              "Pour pouvoir poser une question à nos experts, vous devez d'abord acheter des crédits ",
              [
                {
                  text: "Annuler",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "Je souhaite acheter un crédit", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          } else {
            db.collection("rooms").doc(`${expertId}-${auth.currentUser.uid}`).set({
              messages: [],
              open: true,
            })
            .then(function() {
                console.log("Document successfully written!");
                db.collection('users').doc(auth.currentUser.uid).update({
                  credit: credit-1
                }).then(()=> {console.log('credit débité')})
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
              console.log('credit oui', doc.data().credit)
              navigation.navigate('Chat', {room:`${expertId}-${auth.currentUser.uid}`})
            }})
      }}).catch(function(error) {
        console.log("Error getting document:", error);
      })
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      
      {getHeader()}

      <ScrollView horizontal style={{flex:1}}>
        {
          expertsToDisplay.map((expert =>{
            return (
              <View key={expert.fullName} style={styles.majorView}>
                <TouchableOpacity style={styles.elements} onPress={()=> searchRoom(expert.id, expert.picture)}>
                  <View style={styles.BoxImage}>
                    <Image source={{uri: expert.picture}} style={styles.photoProfil}></Image>
                  </View>
                  <Text style={styles.profession}>{expert.job}</Text>
                  <Text style={styles.profilName}>{expert.fullName}</Text>
                </TouchableOpacity>
              </View>
            )
          }))
        }
        
      </ScrollView>
      
      {getFooter()}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Blog / Articles </Text>
        <View style={styles.rowArticles}>
            {
              articles.map((article,i) => {
                return (

                   <ArticleBlog
                    key={article.title+i}
                    article={article}
                  />
                )
              })
            }
          
        </View>
      </View>
    </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ConversationButton: {
    //position: "absolute",
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#FF828B",
    justifyContent: 'center',
    alignItems: "center",
    //bottom: 50,
    //right: 20,
    //zIndex: 2,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    //elevation: 18,
  },
  textConversation: {
    fontSize: 8,
    color: "#FF828B",
  },
  rowSearchBar: {
    display:'flex', 
    flexDirection:'row', 
    paddingHorizontal:0, 
    alignItems:'center', 
    justifyContent:'space-around',
  },
  searchBar:{
    flexDirection: "row",
    backgroundColor: '#FF828B',
    width: width /1.5,
    height: 40,
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    borderRadius: 7,
  },
  searchBarContent:{
    marginLeft: 11,
    color: '#fff',
    fontSize: 13,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 23,
    marginBottom: 5,
    color: "#767676"
  },
  headerContainer: {
    display:'flex',
    marginBottom: 10,
    backgroundColor:'white'
  },
  description: {
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 23,
    color: "#767676",
    marginBottom: 15,
    paddingRight: 40,
  },
  flexRowText: {
    flexDirection: 'row',
  },
  TextExpert: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  TextExpertBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  
  ExpertButton: {
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: '#FF828B',
    width: 290,
    borderRadius: 5,
    padding: 15,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18, 
  },
  elements: {
    alignItems: 'center',
    justifyContent:'center',
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'#EEEEEE',
    borderRadius:10,
    paddingVertical:10,
    marginBottom:10,
    width:140,
    
  },
  photoProfil: {
    borderRadius: 80,
    width: 100,
    height:100,
  },
  BoxImage: {
    width: 120,
    height: 100,
    borderColor:'#767676',
    justifyContent: 'center',
    alignItems: "center",
    borderRadius: 7,
  },
  profilName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#868686",
    textAlign:'center'
  },
  profession: {
    textAlign:'center',
    fontSize: 15,
    marginVertical: 5,
    color: "#565656",
  },
  majorView: {
    display:'flex',
    flex:1,
    marginLeft: 15,
    borderRadius:10,
  },
  rowArticles: {
    marginHorizontal:10,
    textAlign:'center',
    flexDirection:'row',
    display:'flex',
    flexWrap:'wrap',
    justifyContent:'space-between',
  }
})