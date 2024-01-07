// HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const [selectedSourceCity, setSelectedSourceCity] = useState('');
  const [selectedDestinationCity, setSelectedDestinationCity] = useState('');
  const [errorMessage,setErrorMessage]=useState("")

  useEffect(() => {
    const { selectedCity, isSource } = route.params || {};

    if (selectedCity && isSource) {
      setSelectedSourceCity(selectedCity);
    } else if (selectedCity && !isSource) {
      setSelectedDestinationCity(selectedCity);
    }
  }, [route.params]);

  const handleSelectCity = (isSource) => {
    navigation.navigate('CitySelection', { isSource });
  };

  const handleSearchFlights = () => {
    if(selectedDestinationCity===selectedSourceCity || selectedSourceCity==="" || selectedDestinationCity===""){
      setErrorMessage("Invalid inputs")
    }else{
      navigation.navigate('FlightResults', {
        sourceCity: selectedSourceCity,
        destinationCity: selectedDestinationCity,
      });
      setErrorMessage("")
    }
  };

  return (
    <View style={styles.container}>



      <View style={{alignSelf:"flex-start"}}>
        <View style={{display:"flex",flexDirection:"r"}}>
          <Image source={require("../../public/images/airplane.png")} style={{width:25,height:25}} />
          <Text style={styles.logoText}>jetSetGo</Text>
        </View>
        <Text style={styles.headText}>Search Flights Easier</Text>
        </View>

      {/* Source City TextInput */}
      <TextInput
        style={styles.input}
        placeholder="Select Source City"
        placeholderTextColor="#95a5a6"
        value={selectedSourceCity}
        onChangeText={(text) => setSelectedSourceCity(text)}
        onFocus={() => handleSelectCity(true)}
      />
      {/* Destination City Section */}

      <Image style={styles.logo} source={require("../../public/images/upDown.png")}  />
      <TextInput
        style={styles.input}
        placeholder="Select Destination City"
        placeholderTextColor="#95a5a6"
        value={selectedDestinationCity}
        onChangeText={(text) => setSelectedDestinationCity(text)}
        onFocus={() => handleSelectCity(false)}
      />

      {/* Search Flights Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchFlights}>
        <Text style={styles.buttonText}>Search Flights</Text>
      </TouchableOpacity>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
    justifyContent:'center'
  },
  headText:{
    fontSize:26,
    color:"white",
    alignSelf:"flex-start",
    marginBottom:'20%',
    marginTop:'-15%',
    fontWeight:"bold"
  },
  logoText:{
    fontSize:26,
    color:"gray",
    alignSelf:"flex-start",
    marginBottom:'20%',
    fontWeight:"bold"
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    color: '#ecf0f1',
    borderColor:"gray"
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  logo: {
    width: 30,
    height: 30, 
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  errorMessage:{
    color:"#C70039",
    marginTop:"5%",
    fontSize:16
  }
});

export default HomeScreen;
