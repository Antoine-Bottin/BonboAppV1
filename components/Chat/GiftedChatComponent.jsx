// @refresh reset

import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat, Send, Bubble, Avatar, InputToolbar, TextInput} from 'react-native-gifted-chat'
import { StyleSheet, Text, View, LogBox} from 'react-native'
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import 'dayjs/locale/fr'

LogBox.ignoreLogs(['Setting a timer for a long period of time'])

function GiftedChatComponent({messagesfromProps, user, status, expert, handleSend}) {

    const [messages, setMessages] = useState(messagesfromProps)
    const [statusOpen, setStatusOpen] = useState(status)
    const [user2, setUser2] = useState(user)
    
    useEffect(() => {
        setMessages(messagesfromProps)
    }, [messagesfromProps])

    useEffect(() => {
        setStatusOpen(status)
    }, [status])
    
    function emptyList (){
        return(
            <View style={{transform: [{ scaleY: -1 }], height:'100%', alignItems:'center', justifyContent:'center'}}>
                <View style={{width:'80%', borderRadius:10, backgroundColor:'#EEEEEE', padding:20}}>
                    <Text style={{color:'#FF828B', fontSize:20}}>Vous pouvez désormais poser votre question à {expert.fullName}</Text>
                </View>
            </View>
        )
    }

    return ( 
        <View style={{flex:1}}>
            <GiftedChat 
                renderChatEmpty={emptyList}
                messages={messages} 
                user={user2} 
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
                // renderComposer={(props) => {
                //     return(
                //     <TextInput
                //         {...props}
                //         styles={{backgroundColor:"blue"}}
                //     />
                //     )
                // } }
                renderInputToolbar={(props) => { return(
                    statusOpen ?
                    <InputToolbar {...props} containerStyle={{
                        flex:1,
                        marginHorizontal: 15,
                        borderWidth: 0.5,
                        borderTopColor:'#EEEEEE',
                        borderTopWidth:1,
                        borderColor: '#EEEEEE',
                        borderRadius: 25,
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
            />
        </View> 
    )
}
export default GiftedChatComponent

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