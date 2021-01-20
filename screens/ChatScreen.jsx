// @refresh reset

import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat} from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, Image, TextInput, View, LogBox, Button, Alert } from 'react-native'
import { db, auth, database } from '../connection/firebase';
import firebase from 'firebase';
import GiftedChatComponent from '../components/Chat/GiftedChatComponent'
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import 'dayjs/locale/fr'
import { FontAwesome5 } from '@expo/vector-icons';

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

export default function ChatScreen({route}) {
    const [user, setUser] = useState({_id: auth.currentUser.uid, name : auth.currentUser.displayName})
    const [expert, setExpert] = useState({})
    const [messages, setMessages] = useState([])
    const [status, setStatus] = useState(true)
    const expertId = route.params.room.split('-')[0]

    const chatsRef = db.collection('rooms').doc(route.params.room)
    
    useEffect(() => {
         db.collection('experts').doc(expertId).get().then(function(doc) {
            if (doc.exists) {
                setExpert(doc.data())
            }
        })

       var unsubscribe = db.collection('rooms').doc(route.params.room).onSnapshot(doc => {
            console.log(doc.data().open)
            setStatus(doc.data().open)
            setMessages(
                doc.data().messages.map(message => ({
                    _id: message._id,
                    text: message.text,
                    createdAt: new Date(message.createdAt.seconds*1000),
                    user: {
                        _id: message.user._id,
                        name: message.user.name,
                    },
                })
                ).reverse()
            )
        })
        return () => unsubscribe()
    }, [])


    function handleSend(messages) {
        chatsRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(messages[0])
        })
    }

    // const appendMessages = useCallback (
    //     (messages) => {
    //         setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    //     },
    //     [messages]
    // )

    function info () {
        Alert.alert(
          "Information sur le statut",
          "Votre conversation est clôturée par l'expert lorqu'il a répondu à votre question, vous pourrez lui poser une autre question en achetant d'autres crédits",
          [
            {
              text: "Ok",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            // TODO : lien vers paiemement
            { text: "Acheter d'autres crédits", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        );
      }

    function handleSend(messages) {
        chatsRef.update({
            messages: firebase.firestore.FieldValue.arrayUnion(messages[0])
        })
    }

    return ( 
        <View style={{flex:1}}>
            <View style={styles.iconContainer_profile}>
                <View style={{flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'flex-start'}}>
                    <Image source={{ uri: expert.picture }} style={styles.picture_profile}/>
                    <View style={{flex:1, marginLeft:20, alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold'}}>{expert.fullName}</Text>
                        <Text >{expert.job}</Text>
                    </View>
                </View>
            <View style={{marginLeft:20, flexDirection:'row', alignItems:'center', marginTop:10}}>
                    <Text style={{color:'#FF828B'}}>Statut de la conversation :  
                    {status ? ' ouvert' : ' fermé'}   </Text>
                    <FontAwesome5 
                        onPress={info}
                        name="question-circle" 
                        size={16} 
                        color="#FF828B"
                    />
                </View>
            </View>
            <GiftedChatComponent messagesfromProps={messages} user={user} status={status} expert={expert} handleSend={handleSend}/>
            {/* <GiftedChat 
                renderChatEmpty={emptyList}
                messages={messages} 
                user={user} 
                onSend={handleSend}
                alwaysShowSend={true}
                placeholder={'Posez votre question ici...'}
                renderUsernameOnMessage={true}
                renderAvatarOnTop={true}
                isTyping={true}
                dateFormat='LL'
                isLoadingEarlier={true}
                locale='fr'
                minInputToolbarHeight={55}
                renderComposer={(props) => {
                    return(
                    <TextInput
                       {...props}
                       styles={{backgroundColor:"blue"}}
                    />
                  )
              } }
                renderInputToolbar={(props) => { return(
                    status ?
                    <InputToolbar {...props} containerStyle={{
                        flex:1,
                        marginHorizontal: 15,
                        borderWidth: 0.5,
                        borderTopColor:'#EEEEEE',
                        borderTopWidth:1,
                        borderColor: '#EEEEEE',
                        borderRadius: 25,
                        //backgroundColor:'blue'
                    }} 
                    /> : 
                    <View style={{flex:1, alignItems:'center', justifyContent:'center', fontSize:18}}>
                        <Text style={{color:'#FF828B', fontWeight:'bold', fontStyle:'italic'}}>Votre conversation a été clôturée</Text>
                    </View>
                )}}
                renderBubble = {(props)=> {
                    return (
                      <Bubble
                        {...props}
                        wrapperStyle={{
                          right: {
                            backgroundColor: '#FF828B'
                          },
                          left: {
                            backgroundColor: '#EEEEEE',
                            color:'black'
                          }
                        }}
                      />
                    )
                  }}
                renderAvatar={(props)=> {
                    return (
                      <Avatar
                        {...props}
                        imageStyle={{
                          left: {
                            backgroundColor: '#FF828B',
                          },
                        }}
                      />
                    );
                  }}
                listViewProps={{ backgroundColor: "white" }}
                renderSend={
                    (props) => {
                        return(
                        <Send {...props} containerStyle={{ borderWidth: 0}}>
                            <TouchableOpacity style={{backgroundColor:'#FF828B', display:'flex', alignItems:'center', justifyContent:'center',borderColor:'white', height:33, width:33, borderRadius:100, marginHorizontal:10, marginVertical:5}}>
                                <Ionicons name="ios-send" size={20} color="white" /> 
                            </TouchableOpacity>
                        </Send>)
                    }
                } 
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
    iconContainer_profile:{
        paddingHorizontal: 20,
        alignSelf:'center',
        alignItems:'center',
        backgroundColor:'#EEEEEE',
        width:'100%',
        paddingVertical:10,
    },
    picture_profile:{
        height:100,
        width:100,
        borderRadius:100,
        borderColor:'#EEEEEE',
        borderWidth:1,
    },
})