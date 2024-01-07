import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const CitySelectionScreen = ({ route, navigation }) => {
  const { isSource } = route.params;
  const [uniqueCities, setUniqueCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('https://api.npoint.io/4829d4ab0e96bfab50e7');
        const data = response.data.data.result;

        const uniqueCitySet = new Set();
        data.forEach((item) => {
          const city = isSource ? item.displayData.source.airport.cityName : item.displayData.destination.airport.cityName;
          uniqueCitySet.add(city);
        });

        const allCitiesArray = Array.from(uniqueCitySet);
        setUniqueCities(allCitiesArray);
        setAllCities(allCitiesArray);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [isSource]);

  const handleCitySelection = (city) => {
    navigation.navigate('Home', { selectedCity: city, isSource });
  };

  const handleInputChange = (text) => {
    setSearchText(text);

    if (text.trim() === '') {
      // If input text is empty, show all unique cities
      setUniqueCities(allCities);
    } else {
      // Filter cities based on the input text
      const filtered = allCities.filter((city) =>
        city.toLowerCase().includes(text.toLowerCase())
      );
      setUniqueCities(filtered);
    }
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity style={styles.cityItem} onPress={() => handleCitySelection(item)}>
      <Text style={styles.cityItemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={`Search ${isSource ? 'Source' : 'Destination'} City`}
        placeholderTextColor="#95a5a6"
        value={searchText}
        onChangeText={handleInputChange}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={uniqueCities}
          keyExtractor={(item) => item}
          renderItem={renderCityItem}
          style={styles.cityList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black'
  },
  input: {
    height: 40,
    marginBottom: 16,
    padding: 10,
    color: '#ecf0f1', // Light text color
    fontSize:18
  },
  loadingText: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20,
    color: '#ecf0f1', // Light text color
  },
  cityList: {
    flex: 1,
  },
  cityItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#34495e', // Dark border color
  },
  cityItemText: {
    fontSize: 18,
    color: '#ecf0f1', // Light text color
  },
});

export default CitySelectionScreen;
