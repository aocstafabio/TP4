import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
//import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Clima } from "./App";
//import { LoginScreen } from "./Login";
import React, { useState, useEffect } from 'react';


const axios = require("axios");

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
  
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>POKEDEX!</Text>
          <Image source={{ uri: "https://media.tenor.com/images/39d6060576a516f1dd437eafccafbdb1/tenor.gif" }}
          />
  
          <Text>Nombre: {this.state.userInfo?.name}</Text>
          <Text>Email: {this.state.userInfo?.email}</Text>
        </View>
  
  
  
      );
  
    }
  
  }


const Drawer = createDrawerNavigator();


function Navigate() {

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Nav">
        <Drawer.Screen name="App" component={Clima} />
        <Drawer.Screen name="Nav" component={HomeScreen.bind(this)} />


      </Drawer.Navigator>
    </NavigationContainer>
  );
}



export default Navigate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }

}
);