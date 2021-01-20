import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image, Dimensions, Button } from 'react-native';

//Firebase
import { auth, db } from './connection/firebase';

// React Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

//Fonts
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

//icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

//Import components
import Activity from './screens/activity';
import ChatExperts from './screens/ChatExperts';
import HealthExperts from './screens/HealthExperts';
import Agenda from './screens/agenda';
import Deals from './screens/Deals';
import DetailsActivity from './screens/DetailsActivity';
import detailsArticles from './screens/detailsArticles';
import detailsDeals from './screens/detailsDeals';
import profile from './screens/profile';
import cameraScreen from './screens/cameraScreen';
import Login from './screens/Login'
import LoginWithMail from './screens/LoginWithMail'
import ChatScreen from './screens/ChatScreen'

//Gestion des dimensions en fonction des tailles d'écran
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGTH = Dimensions.get('window').height;

//Redux  
import picture from './reducer/picture.reducer';
import deal from './reducer/deals.reducer';
import activity from './reducer/activity.reducer';
import idUser from './reducer/idUser.reducer';
import listActivities from './reducer/listActivities';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
const store = createStore(combineReducers({picture,deal,listActivities, activity,idUser}));


const fetchFonts = () => {
  return Font.loadAsync({
  'Roboto': require('./assets/fonts/Roboto-Regular.ttf'),
  });
  };

  function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // if there hasn't been any navigation inside the screen
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Activités';
    switch (routeName) {
      case 'Activités':
        return 'Activités';
      case 'Expertise':
        return 'Expertise';
      case 'Agenda':
        return 'Agenda';
      case 'Bons Plans':
        return 'Bons Plans';
      case 'Mon Profil':
        return 'Mon Profil';
    }
  }
 
function MyTabBar({ state, descriptors, navigation, }) {

  const [pictureProfileInactive, setPictureProfileInactive] = useState('https://firebasestorage.googleapis.com/v0/b/bonboapp-edda4.appspot.com/o/user.png?alt=media&token=dc3bd968-0f27-491f-8dff-4f65817d9d21')
  const [pictureProfileActive, setPictureProfileActive] = useState('https://firebasestorage.googleapis.com/v0/b/bonboapp-edda4.appspot.com/o/userRed.png?alt=media&token=c21e0d58-f358-45bf-ac53-2b540906ddfb')

  useEffect(() => {
    let searchResult = db.collection('users').doc(auth.currentUser.uid).get().then(function(doc) {
      if (doc.exists) {
        if(doc.data().picture){
          setPictureProfileActive(doc.data().picture)
          setPictureProfileInactive(doc.data().picture)
        } else {
          setPictureProfileActive('https://firebasestorage.googleapis.com/v0/b/bonboapp-edda4.appspot.com/o/userRed.png?alt=media&token=c21e0d58-f358-45bf-ac53-2b540906ddfb')
          setPictureProfileInactive('https://firebasestorage.googleapis.com/v0/b/bonboapp-edda4.appspot.com/o/user.png?alt=media&token=dc3bd968-0f27-491f-8dff-4f65817d9d21')
        }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });

  }, [])

  return (
    <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", width: DEVICE_WIDTH, height: DEVICE_HEIGTH / 12 , backgroundColor: '#fff'}}>
    {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        // Display of the name of each button in NavBar
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        //Button creation and display of the logo associted
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{  alignItems: "center", width: DEVICE_WIDTH/5.6,}}
          >
            {/* conditionnal display of the logo using label name */}
            {
              (label === 'Activités' && isFocused === true )
              ? <Image source={require('./assets/activityRed.png')} style={{width: 21, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Activités' && isFocused === false )
              ? <Image source={require('./assets/activity.png')} style={{width: 21, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Agenda' && isFocused === true)
              ? <Image source={require('./assets/agendaRed.png')} style={{width: 18, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Agenda' && isFocused === false)
              ? <Image source={require('./assets/agenda.png')} style={{width: 18, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Expertise' && isFocused === true)
              ? <Image source={require('./assets/expertRed.png')} style={{width: 29, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Expertise' && isFocused === false)
              ? <Image source={require('./assets/expert.png')} style={{width: 29, height:20, marginBottom:5}}/>
              : null
            }
            
            {
              (label === 'Bons Plans' && isFocused === true)
              ? <Image source={require('./assets/dealsRed.png')} style={{width: 28, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Bons Plans' && isFocused === false)
              ? <Image source={require('./assets/deals.png')} style={{width: 28, height:20, marginBottom:5}}/>
              : null
            }
            {
              (label === 'Mon Profil' && isFocused === true)
              ? <Image source={{uri:pictureProfileActive}} style={{width: 28, height:28, marginBottom:5, borderRadius:100}}/>
              : null
            }
            {
              (label === 'Mon Profil' && isFocused === false)
              ? <Image source={{uri:pictureProfileInactive}} style={{width: 28, height:28, marginBottom:5, borderRadius:100}}/>
              : null
            }
            {/* display of the label name */}
            <Text style={{ color: isFocused ? '#FF828B' : '#CCD1EB', fontSize: 12}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
      </View>
    // </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={props => 
        <MyTabBar {...props} />
      }
      tabBarOptions={{
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="Activités" component={Activity} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Expertise" component={HealthExperts} />
      <Tab.Screen name="Bons Plans" component={Deals} />
      <Tab.Screen name="Mon Profil" component={profile} />
      
    </Tab.Navigator>
  )
}
export default function App(props) {
  const [dataLoaded, setDataLoaded] = useState(false)
  if(!dataLoaded){
    return(
      <AppLoading
        startAsync={fetchFonts}
        onFinish={setDataLoaded(true)}/>
    )
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator >
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/> 
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={ ({navigation})=> ({
              headerStyle: {backgroundColor:'#FF828B'},
              headerTintColor:'white',
              headerRight: () => (
                <FontAwesome5 
                  name={'comment-dots'} 
                  brand 
                  style={{color:'white', fontSize:30, marginRight:14}}
                  onPress={() => navigation.navigate('Conversations')}
                />
              
            )})}/>
          <Stack.Screen name="LoginWithMail" component={LoginWithMail} options={{headerShown: false}}/>
          <Stack.Screen 
            name="TabNavigator" 
            component={TabNavigator} 
            options={({ route, navigation }) => ({
              headerTitle: getHeaderTitle(route),
              headerTintColor:'white',
              headerStyle: {backgroundColor:'#FF828B'},
              headerLeft: () => (
                  <Image source={require('./assets/bonbo-logo-nav.png')} style={{width: 27, height:30, marginBottom:5, marginLeft:20}}/>
                  ),
              headerRight: () => (
                <FontAwesome5 
                  name={'comment-dots'} 
                  brand 
                  style={{color:'white', fontSize:30, marginRight:14}}
                  onPress={() => navigation.navigate('Conversations')}
                />
              ),
            })
            }
          />
          <Stack.Screen name="detailsActivity" component={DetailsActivity} options={{headerShown: false}}/>
          <Stack.Screen name="detailsArticles" component={detailsArticles} options={{headerShown: false}}/>
          <Stack.Screen name="Conversations"
            component={ChatExperts} 
            options={ ({navigation})=> ({
              headerStyle: {backgroundColor:'#FF828B'},
              headerTintColor:'white',
              headerRight: () => (
                <FontAwesome5 
                  name={'home'} 
                  brand 
                  style={{color:'white', fontSize:30, marginRight:14}}
                  onPress={() => navigation.navigate('TabNavigator')}
                />
              
            )})}
          />
          <Stack.Screen 
            name="profile" 
            component={profile} 
            options={{headerShown: true,
            title: '',
            headerStyle: {
            backgroundColor: '#FF6B6B',
          },
            headerTintColor: 'white',
            headerTitleStyle: {
            fontWeight: 'bold',
      },
      }} />
          <Stack.Screen 
            name="detailsDeals" 
            component={detailsDeals} 
            options={{headerShown: true,
            title: '',
            headerStyle: {
            backgroundColor: '#FF6B6B',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
            fontWeight: 'bold',
            },
            }}/>
            <Stack.Screen name="cameraScreen" component={cameraScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  LogoNavigation:{
    marginTop:10,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain',
    width: 100,
    height: 100,
  },
})