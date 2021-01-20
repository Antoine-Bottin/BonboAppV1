import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, Alert, Modal, TouchableHighlight, FlatList } from 'react-native';
import { ActionSheet, Root } from 'native-base';
import { WeekCalendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { auth, db } from '../connection/firebase';
import firebase from 'firebase';
// import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window')
let animObj = null;

function Agenda() {
  const [daySelected, setDaySelected] = useState(new Date().setHours(1,0,0,0)/1000)
  const [smiley, setSmiley] = useState(null)
  const [dataUser, setDataUser] = useState([]);
  const [daysToDisplay, setDaysToDisplay]= useState([])
  const [averageFeel, setAverageFeel] =useState(0)

  const smileys = [
    {img: require('../assets/twemoji_angry-face.png'), number:1, feel:'vraiment très très mal.'},
    {img: require('../assets/twemoji_face-with-rolling-eyes.png'), number:2, feel:'bof bof'},
    {img: require('../assets/twemoji_beaming-face-with-smiling-eyes.png'), number:3, feel:'plutôt bien'},
    {img: require('../assets/twemoji_smiling-face-with-heart-eyes.png'), number:4, feel:'décontracté(e) et de bonne humeur'},
    {img: require('../assets/twemoji_baby-angel.png'), number:5, feel:"d'une humeur de déglingo, prêt(e) à gravir des montagnes"}
  ];
  // Search user's data :
  useEffect(() => {
    const data = db.collection('users').doc(auth.currentUser.uid).onSnapshot(doc =>{
      setDataUser(doc.data().feel)
      let feelDay = doc.data().feel.filter(day => day.timestamp === daySelected)[0]
      feelDay ? setSmiley(smileys.filter(smiley => smiley.number === feelDay.number)[0]) : setSmiley(null)
    })
    return () => {
      data() 
    }
  }, []);

  const weekToDisplay = () => {
    console.log(daySelected)
    let array = []
    let date = null
    let dateTimestamp = null
    let dayNumber = new Date(daySelected * 1000).getDay()
    for(let i = 0; i<7; i++){ 
      if(i > dayNumber){
        date = new Date((daySelected + 86400*(i-dayNumber))*1000);
        dateTimestamp = daySelected + 86400*(i-dayNumber)
      } else {
        date = new Date((daySelected - 86400*i)*1000);
        dateTimestamp = daySelected - 86400*i
      }
      let searchData = dataUser.filter(date => date.timestamp === dateTimestamp)
        array.push({
          timestamp:dateTimestamp,
          day:dayName(date),
          date: date,
          feel: searchData[0] ? searchData[0].number : 0 ,
          emoji: searchData[0] ? smileys[searchData[0].number -1].img : '' ,
        })
    }
      setDaysToDisplay(array.sort(function (a, b) {
        return a.timestamp - b.timestamp; // order array by timestamp
      }))
  }

  const searchAverageFeel = ()=> {
    const humeur = daysToDisplay.filter(day => day.feel !=0).map(item => item.feel)
    const avg = array => array.reduce((sum, e) => sum + e, 0) / array.length
    setAverageFeel(avg(humeur))
  }

  useEffect(() => {
    weekToDisplay()
  }, [dataUser])

  useEffect(() => {
    searchAverageFeel()
  }, [daysToDisplay])

  // set feel when daySelected changes :
  useEffect(() => {
    let feelDay = dataUser.filter(day => day.timestamp === daySelected)[0]
    feelDay ? setSmiley(smileys.filter(smiley => smiley.number === feelDay.number)[0]) : setSmiley(null)  
    weekToDisplay()
  }, [daySelected]);

    const todayTimestamp = new Date().setHours(1,0,0,0)/1000
    const todayToDisplay = new Date(todayTimestamp *1000).toISOString().slice(0,10)

  // Calendar 
  LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'fr';
  
  function dayName(date){
    const optionsDate = { weekday: 'long'};
    const dayName = new Intl.DateTimeFormat('fr-FR', optionsDate).format(date).slice(0,3)
    return (dayName+'').charAt(0).toUpperCase()+dayName.substr(1)
  };

   // Display markers :
  let markedDatesToDisplay = {}
  dataUser.map((date) => { 
    // Convert the date to AAAA-MM-JJ :
    let dateTodisplay = new Date(date.timestamp *1000).toISOString().slice(0,10)
    markedDatesToDisplay = {...markedDatesToDisplay, [dateTodisplay]:{
      selected: date.timestamp === daySelected, // circle if daySelected
      marked: date.timestamp !== undefined, // marker whith dot if feel and timestamp exist
      dotColor: date.timestamp === daySelected ? 'white' : '#FF828B',
      selectedColor: '#FF828B'},
    }
    });

  // update firestore on click smiley:
  const handleClickSmiley = (number) => {
    db.collection('users').doc(auth.currentUser.uid).update({
      feel : firebase.firestore.FieldValue.arrayUnion({
        number : number,
        timestamp : daySelected
      })
    })
  }

  var ArticlesView = () => {
    return (
      <View>
        <Text style={styles.todayText}>Aujourd'hui</Text>
        <View style={{...styles.buttons, backgroundColor: '#82C4C3'}}>
          <Text style={{fontSize:40}}>💡</Text>
          {/* <Image style={styles.emoji} source={require('../assets/light-bulb.png')} style={styles.feelingsEmo} /> */}
          <View style={styles.insideTextContainer}>
            <Text style={styles.insideText}>CONSEIL D'EXPERT</Text>
            <Text style={styles.insideText}>Voir les experts</Text>
          </View>
          <TouchableOpacity style={styles.readContainer}>
            <Text style={styles.read}>Lire</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.buttons, backgroundColor: '#D4647C'}}>
          <Text style={{fontSize:40}}>👨‍👩‍👧‍👦</Text>
          {/* <Image style={styles.emoji} source={require('../assets/twemoji_family-man-woman-girl-boy.png')} style={styles.feelingsEmo} /> */}
          <View style={styles.insideTextContainer}>
            <Text style={styles.insideText}>SUGGESTION D'ACTIVITE</Text>
            <Text style={styles.insideText}>S'arrêter et se reposer</Text>
          </View>
          <TouchableOpacity style={styles.readContainer}>
            <Text style={styles.read}>Lire</Text>
          </TouchableOpacity>
        </View>
        <View style={{...styles.buttons, backgroundColor:'#FF887E'}}>
          <Text style={{fontSize:40}}>📖</Text>
          {/* <Image style={styles.emoji} source={require('../assets/twemoji_family-man-woman-girl-boy.png')} style={styles.feelingsEmo} /> */}
          <View style={styles.insideTextContainer}>
            <Text style={styles.insideText}>UN ARTICLE POUR VOUS</Text>
            <Text style={styles.insideText}>S'arrêter et se reposer</Text>
          </View>
          <TouchableOpacity style={styles.readContainer}>
            <Text style={styles.read}>Lire</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  var display;
  if(!smiley){
    display = (
      <View>
        <Text style={styles.greetingText}>Bonjour {auth.currentUser.displayName}, </Text>
        <Text style={styles.questionText}>Comment vous sentez vous aujourd'hui?</Text>
        <View style={styles.smileyRow}>
          {
            smileys.map((smiley,i) => {
              return(
                <TouchableOpacity key={i} onPress={() => { handleClickSmiley(smiley.number) }}>
                  <Image source={smiley.img} style={styles.feelingsEmo} />
                </TouchableOpacity>
              )
            })
          }
        </View>
        <ArticlesView />
      </View>
    )

  } else {

    display = (
      <View style={{flex:1}}>
        {daySelected === todayTimestamp ?
        <Text style={styles.greetingText}>Aujourd'hui vous vous sentez {smiley.feel} </Text>
        :
        <Text style={styles.greetingText}>Ce jour là vous vous sentiez {smiley.feel} </Text>
        }
        <Text style={styles.questionText}>Cette semaine a été incroyablement.....{averageFeel}</Text>
        <Image source={require('../assets/rainbow.gif')} style={styles.rainbow} />
      <Text style={styles.questionText}>Votre humeur cette semaine</Text>
        <View style={styles.feelingWeek}>
          {
            daysToDisplay.map((day,i)=>{
              return(
                <View key={day+i} style={{ justifyContent: 'center', alignSelf: 'center', display:'flex', flex:1, justifyContent:'space-around'}}>
                  <Text style={styles.feelingWeekText}>{day.day}</Text>
                  {day.emoji ? <Image source={day.emoji} style={styles.feelingsEmo} /> : null}
                </View>
              )
            })
          }
        </View>
        <ArticlesView />
      </View >
    )
  }

  return (
    <Root>
       <WeekCalendar style={styles.calendar}
          // Maximum date that can be selected, dates after maxDate will be grayed out
          maxDate={todayToDisplay}
          onDayPress={(day) => {
            day.timestamp/1000 <= todayTimestamp && setDaySelected(day.timestamp/1000); 
          }}
          markedDates={markedDatesToDisplay}
          theme={{todayTextColor: '#FF887E'}}
        />
      <ScrollView style={styles.container}>
        {display}
      </ScrollView>
    </Root>
  );
}

export default Agenda;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  calendar: {
    height: 60,
    padding: 15
  },
  feelingsEmo: {
    width: 35,
    height: 35,
    alignSelf: 'center'
  },
  greetingText: {
    textAlign: 'center',
    fontSize: 23,
    fontWeight: 'bold',
    color: '#767676',
    paddingTop: 45,
  },
  questionText: {
    width: width / 1.5,
    textAlign: 'center',
    fontSize: 16,
    color: '#767676',
    paddingBottom: 15,
    alignSelf: 'center'
  },
  smileyRow: {
    flexDirection: 'row',
    width: width / 1.2,
    alignSelf: 'center',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 50
  },
  todayText: {
    textAlign: 'left',
    marginTop: 30,
    marginLeft: 30,
    color: '#767676',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: width / 1.2,
    minHeight: 70,
    marginTop: 20,
    padding: 15,
    borderRadius: 5
  },
  thirdTip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    backgroundColor: '#FF887E',
    width: width / 1.2,
    minHeight: 70,
    marginTop: 20,
    padding: 15,
    borderRadius: 5
  },
  emoji: {
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
  },
  insideTextContainer: {
    alignSelf: 'center'
  },
  insideText: {
    color: 'white',
    fontSize: 14
  },
  read: {
    textAlign: 'center',
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 5
  },
  readContainer: {
    alignSelf: 'center',
  },
  rainbow: {
    width: width / 1.8,
    height: 100,
    alignSelf: 'center'
  },
  feelingWeek: {
    flex:1,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'stretch',
    alignSelf: 'center',
    width: width/1.2,
    backgroundColor: '#F8F8F8',
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  feelingWeekText: {
    marginTop:5,
    flex:1,
    width:'100%',
    textAlign:'center',
  }
});
