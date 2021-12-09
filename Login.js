import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StyleSheet, View, Text, ImageBackground, Pressable } from 'react-native';

import { Button } from 'react-native';

const image = {uri: "https://raw.githubusercontent.com/itzpradip/react-native-weather-app-ui/main/assets/cloudy.jpeg" };

export function LoginScreen({ navigation }) {

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '576837731717-fpbrepovdm1de25aa75rco8nsdnhn1df.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      navigation.navigate("Home", { auth: response.authentication })
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center'}}>
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={{
      flex: 1,}}>
        

      <Text style={styles.text1}> Bienvenidx!</Text>
      <Text style={styles.text2}> Ingresa con tu cuenta</Text>
      <Pressable style={styles.button} name="Login" size="m"  onPress={() => { promptAsync();} } >{}
      <Text>Login</Text>
      </Pressable>
      </ImageBackground>
    </View>

  );
}

const styles = StyleSheet.create({
    button:{

        alignItems: 'center',
        justifyContent: 'center',
        bottom: -300,
        width: 150,
        paddingVertical: 15,
        //paddingHorizontal: 20,
        borderRadius: 50,
        //elevation: 3,
        backgroundColor: "lightpink"
    },
    text1:{
        alignItems: "center",
        justifyContent: 'center',
        fontSize: 40,
        color: "white",
        bottom: -170
        
    },
    text2:{
        fontSize: 20,
        color: "white",
        bottom: -170,
        alignItems: 'center',
        justifyContent: 'center'
        
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }

}
);

