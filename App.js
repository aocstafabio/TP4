import React, { useEffect, useState } from 'react';
import {useColorScheme} from 'react-native';
import { StyleSheet, Text, View, Image, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl, Appearance } from 'react-native';
import * as Location from 'expo-location';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LoginScreen } from "./Login";

const axios = require("axios");
const image = {uri: "https://raw.githubusercontent.com/itzpradip/react-native-weather-app-ui/main/assets/cloudy.jpeg" };
const imagee = {uri: "https://images.pexels.com/photos/6156383/pexels-photo-6156383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" };



export class HomeScreen extends React.Component {

    _GOOGLE_URL = "https://www.googleapis.com/oauth2/v3/userinfo?access_token="
  
    constructor(props) {
      super(props);
      this.state = {
        userInfo: null
  
      }
    }
  
    
  
    ComponentDidMount() {
      console.log("hola");
      let token = this.props.route.params.auth.accessToken;
      this.getUserInfo(token)
    }
  
    getUserInfo(token) {
      console.log("User info");
      console.log(token);
      axios.get(_GOOGLE_URL + token).then(resp => {
        console.log(resp.data);
        this.setState({ userInfo: resp.data });
      }).catch(error => {
        console.log(error);
      })
    }
  
    render() {
      return (
  
        <View style={{ flex: 1, justifyContent: 'center' }}>
        <ImageBackground
      source={image}
      resizeMode="cover"
      style={{
      flex: 1,}}>
        
          <Text>Clima</Text>
          <Text>Nombre: {this.state.userInfo?.name}</Text>
          <Text>Email: {this.state.userInfo?.email}</Text>
          </ImageBackground>
        </View>
      );
  
    }
  
  }


const Drawer = createDrawerNavigator();




function Navigate() {

  const scheme = useColorScheme();


  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Home" component={HomeScreen.bind(this)} />
        <Drawer.Screen name="Pronóstico" component={Clima} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


export default Navigate;




const openWeatherKey = ``;
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&lang=sp&appid=142a57c0470e9a93e55a8444c66d2102`;


const Clima = () => {


  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Los permisos de ubicación fueron rechazados');
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    const response = await fetch( `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    const data = await response.json();

    if(!response.ok) {
      Alert.alert(`Error: ${data.message}`); 
    } else {
      setForecast(data);
    }

    setRefreshing(false);
  }

  useEffect(() => { 
    if (!forecast) {
      loadForecast(); 
    }
  })

  if (!forecast) {
    return <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" />
      </SafeAreaView>;
  }

  const current = forecast.current.weather[0];
 
  return (

      
    <SafeAreaView style={styles.container}>
        <ImageBackground
      source={imagee}
      resizeMode="cover"
      style={{
      flex: 1,}}>
        
      <ScrollView 
        refreshControl={
          <RefreshControl 
            onRefresh={() => {  loadForecast() }} 
            refreshing={refreshing}
          />}
          
      >
        <Text style={styles.title}>Pronóstico</Text>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
          <Text style={styles.currentTemp}>{Math.round(forecast.current.temp)}°C</Text>
        </View>
        
        <Text style={styles.currentDescription}>{current.description}</Text>
        <View>
          <Text style={styles.subtitle}>Por hora</Text>
          <FlatList horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hour) => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              return <View style={styles.hour}>
                <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                <Text>{Math.round(hour.item.temp)}°C</Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <Text>{weather.description}</Text>
              </View>
            }}
          />
        </View>

        <Text style={styles.subtitle}>Próximos 5 días</Text>
        {forecast.daily.slice(0,5).map(d => {
          const weather = d.weather[0];
          var dt = new Date(d.dt * 1000);
          return <View style={styles.day} key={d.dt}>
            <Text style={styles.dayTemp}>{Math.round(d.temp.max)}°C</Text>
            <Image
              style={styles.smallIcon}
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
              }}
            />
            <View style={styles.dayDetails}>
              <Text>{dt.toLocaleDateString()}</Text>
              <Text>{weather.description}</Text>
            </View>
          </View>
        })}
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 42,
    color: '#e96e50',
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: '#e96e50',
  },
  container: {
    flex: 1,
    bottom: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    marginBottom: 24
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20
  },
  largeIcon: {
    width: 250,
    height: 200,
  },
  smallIcon: {
    width: 100,
    height: 100,
  }
});

//export default Clima;



