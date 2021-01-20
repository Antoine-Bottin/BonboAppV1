import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, Dimensions } from 'react-native';
import { db, auth} from '../connection/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window')


export default function MessagesList({navigation}) {

  const [dataPars, setDataPars] = useState([])

  const [conversationsToDisplay, setConversationsToDisplay]= useState([])
  const [conversations, setConversations]= useState([])
  const [input, setInput] = useState('')

  useEffect(()=>{
    db.collection('rooms').where('user', '==', auth.currentUser.uid).onSnapshot(snapshot =>{
      let datas = snapshot.docs.map(doc => doc.data());
      let lastMessages = datas.map(function(conversation) {
        let list = conversation.messages;
        let response = {};
      
        db.collection('experts').doc(conversation.expert).get().then(function(doc) {
          if (doc.exists) {
            response.picture = doc.data().picture;
            response.name = doc.data().fullName;
            response.id = doc.id;
          }})
        
        if(list[list.length-1]){
          let getLastMessage = list[list.length-1].text.slice(0,20)
          response.message= getLastMessage
          let dateLastMessage = new Date(list[list.length-1].createdAt.seconds * 1000).toLocaleDateString('fr-FR')
          response.date = dateLastMessage
        } else {
          response.message= ''
          response.date = ''
        }
        return response

      })
      
      setConversations(lastMessages)

    })
  },[]);

  // useEffect(()=>{
  //   console.log(conversations)
  //   setConversationsToDisplay(
  //     conversations.filter(conversation => conversation.name.toLowerCase().includes(input.toLowerCase()))
  //   )
  // } ,[conversations, input])
  

    return (
      <View style={styles.container}>
        <View style ={styles.searchBar}>
          <Image source={require('../assets/search.png')}></Image>
          <TextInput 
            style={styles.searchBarContent} 
            placeholder="Un métier, un nom ..." 
            underlineColorAndroid="transparent" 
            placeholderTextColor = "white" 
            value={input}
            onChangeText={setInput}
          />
        </View>
        <FlatList
        data={conversations}
        // numColumns={numColumn}
        keyExtractor={item => item.message}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.flexDescription}
            onPress={() => navigation.navigate('Chat', {room: `${item.id}-${auth.currentUser.uid}`})}
          >
                <Image source={{uri: item.picture}} style={styles.photoProfil}></Image>
                <View>
                  <Text style={styles.profilName}>{item.name}</Text>
                  <Text style={styles.profession}>{item.message}</Text>
                  <Text style={{fontSize:10, color:'#767676'}}>{item.date}</Text>
                </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 20,
    },
    flexDescription : {
      flex: 1,
      flexDirection: "row",
      alignItems: 'center'
    },
    photoProfil: {
      width:50,
      height:50,
      borderRadius: 40,
      margin: 15,
      marginLeft: 23,
    },
    profilName: {
      fontSize: 17,
      fontWeight: "500",
      color: "#767676"
    },
    profession: {
      fontSize: 15,
      
      color: "#767676"
    },
    searchBar:{
      flexDirection: "row",
      backgroundColor: '#FF828B',
      width: width /1.5,
      height: 40,
      marginLeft: 23,
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
  })