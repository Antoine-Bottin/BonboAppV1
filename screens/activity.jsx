import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, LogBox } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CarouselActi from '../components/Activity/CarouselActi'
import CarouselFav from '../components/ActivityFavorite/CarouselActi'
import { db, auth } from '../connection/firebase';
import { useIsFocused } from '@react-navigation/native';
import { connect } from 'react-redux';

function Activity(props) {
  const userId = auth.currentUser.uid;
  const [activityData, setActivityData] = useState([]);
  const [activityDataTrend, setActivityDataTrend] = useState([]);
  const [themes, setThemes] = useState([]);
  const [list, setList] = useState([]);
  const [favoritesListId, setFavoritesListId] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activitiesToDisplay, setActivitiesToDisplay] = useState([]);
  const [trend, setTrend] = useState(true);
  const [newActivities, setNewActivities] = useState([]);

  const isFocused = useIsFocused();

  const toggleList = (id) => {
    if(list.includes(id)) {
      setList(list.filter(item => item != id))
    } else {
      setList([...list, id])
    }
  }

  useEffect(() => {
    db.collection('activitiesGroup').orderBy("title", "asc").onSnapshot(snapshot =>{
    setThemes(snapshot.docs.map(doc => ({title: doc.data().title, id: doc.id}) ) )
    })
  
    db.collection('activity').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      let data = snapshot.docs.map(doc => ({...doc.data(), id:doc.id}))
      setActivityData(data)
      let array = data
      array.length > 10 ? setNewActivities(array.splice(10, array.lenght-10)) : setNewActivities(array)
      props.listActivities(data)
    });
      
    db.collection('users').doc(userId).onSnapshot(doc =>{
      setFavoritesListId(doc.data().favoris)
    });
  }, [isFocused]);

  useEffect(() => {
    setFavorites(
      activityData.filter(item => favoritesListId.includes(item.id))
      )
  }, [favoritesListId])

  useEffect(() => {
    if(trend){
      setActivityDataTrend(activityData.filter(element => element.trend === true))
    } else {
      setActivityDataTrend([])
    }
  }, [trend, activityData])

  useEffect(() => {
    if(list.length === 0){
      setActivitiesToDisplay(activityData)
    } else {
      setActivitiesToDisplay(activityData.filter(item => list.includes(item.category)) )
    }
  }, [list, activityData])

  var viewFavorites;
  if (favoritesListId.length>0) {
    viewFavorites = (
      <>
        <Text style={styles.OthersTitle}>Mes Favoris</Text>
        <CarouselFav data={favorites} navigation={props.navigation}></CarouselFav>
      </>
    )
  } 

  return (
    <ScrollView >
      <View style={styles.container}>
        <View style={{...styles.list, marginHorizontal:0}}>
          <ScrollView horizontal>
            {
              trend ? 
              <TouchableOpacity  style={styles.buttonSelected} onPress={() => setTrend(!trend)}>
                <Text style={styles.textButton}>Tendance</Text>
              </TouchableOpacity> 
              :
              <TouchableOpacity  style={styles.button} onPress={() => setTrend(!trend)}>
               <Text style={styles.textButton}>Tendance</Text>
              </TouchableOpacity>
            }
          
            {
              themes.map((theme, i)=>{
                return( list.includes(theme.id) ?
                  <TouchableOpacity key={i} style={styles.buttonSelected} onPress={() => toggleList(theme.id)}>
                    <Text key={theme.title} style={styles.textButton}>{theme.title}</Text>
                  </TouchableOpacity>
                  : 
                  <TouchableOpacity key={i} style={styles.button} onPress={() => toggleList(theme.id)}>
                    <Text key={theme.title} style={styles.textButton}>{theme.title}</Text>
                  </TouchableOpacity>
                ) 
              })
            }
          </ScrollView>
        </View>
        
        {/* sending Data and Navigation as property to Caroussel Acti*/}
        <CarouselActi data={activitiesToDisplay} navigation={props.navigation}></CarouselActi>
          {trend ? 
            <>
              <Text style={styles.popular}>Tendance</Text>
              <CarouselActi data={activityDataTrend} navigation={props.navigation}></CarouselActi>
            </>
          : <></>}
         {viewFavorites}
        <Text style={styles.popular}>Nouveautés</Text>
        <CarouselActi data={newActivities} navigation={props.navigation}></CarouselActi>
      </View>
    </ScrollView>
  );
}

function mapDispatchToProps(dispatch) {         // Redux send id from facebook. action name 'addId', value : id
  return {
    listActivities: function (activityData) {
      dispatch({
        type: 'listActivities',
        data: activityData
      })
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Activity);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  popular: {
    backgroundColor:'white',
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: '#767676',
   // fontFamily: 'Roboto',
  },
  OthersTitle: {
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: '#767676',
   //fontFamily: 'Roboto',
  },
  buttonSelected: {
    backgroundColor: '#FF828B',
    borderRadius: 70,
    padding: 10,
    marginHorizontal:3,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  button:{
    backgroundColor: '#E2E5F4',
    borderRadius: 70,
    padding: 10,
    marginHorizontal:3,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  list:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: 'center',
    alignItems: 'center',
    marginVertical:15,
    marginHorizontal:15,
  },
  textButton:{
    color:'white',
    fontWeight:'600'
  }
});