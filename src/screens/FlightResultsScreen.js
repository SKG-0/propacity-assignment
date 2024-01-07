// FlightResultsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const FlightResultsScreen = ({ route }) => {
  const { sourceCity, destinationCity } = route.params;
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('priceAsc');
  const [airlines, setAirlines] = useState([]);

  const fetchFlightResults = async () => {
    try {
      const response = await axios.get('https://api.npoint.io/4829d4ab0e96bfab50e7');
      const data = response.data.data.result;
      const filteredFlights = data.filter(
        (flight) =>
          flight.displayData.source.airport.cityName === sourceCity &&
          flight.displayData.destination.airport.cityName === destinationCity
      );

      // Extract unique airlines based on their codes
      const uniqueAirlines = Array.from(
        new Set(
          data.flatMap((flight) =>
            flight.displayData.airlines.map((airline) => airline.airlineName)
          )
        )
      );

      setAirlines(uniqueAirlines);

      // Apply filtering based on the selected filter
      const filteredResults =
        selectedFilter === 'all'
          ? filteredFlights
          : filteredFlights.filter((flight) =>
            flight.displayData.airlines.some((airline) => airline.airlineName === selectedFilter)
          );

      // Apply sorting based on the selected sort option
      const sortedResults =
        selectedSort === 'priceAsc'
          ? filteredResults.sort((a, b) => a.fare - b.fare)
          : filteredResults.sort((a, b) => b.fare - a.fare);

      setFlightResults(sortedResults);
    } catch (error) {
      console.error('Error fetching flight results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightResults();
  }, [sourceCity, destinationCity, selectedFilter, selectedSort]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Airlines:</Text>
        <Picker
          selectedValue={selectedFilter}
          onValueChange={(itemValue) => setSelectedFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All Airlines" value="all" />
          {airlines.map((airlineName) => (
            <Picker.Item key={airlineName} label={airlineName} value={airlineName} />
          ))}
        </Picker>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by Price:</Text>
        <Picker
          selectedValue={selectedSort}
          onValueChange={(itemValue) => setSelectedSort(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Low to High" value="priceAsc" />
          <Picker.Item label="High to Low" value="priceDesc" />
        </Picker>
      </View>

      <Text style={styles.resultLabel}>Flight Results for {sourceCity} to {destinationCity}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : flightResults.length > 0 ? (
        <FlatList
          data={flightResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.flightCard}>
              <View style={styles.flightHeader}>
                <Text style={styles.airlineName}>{item.displayData.airlines[0].airlineName}</Text>
                <Text style={styles.flightNumber}>{item.displayData.airlines[0].flightNumber}</Text>
              </View>

              <View style={styles.flightInfo}>
                <Text style={styles.location}>
                  {item.displayData.source.airport.cityName} ({item.displayData.source.airport.cityCode})
                  {' to '}
                  {item.displayData.destination.airport.cityName} ({item.displayData.destination.airport.cityCode})
                </Text>
                <Text style={styles.detail}>
                  Departure: {item.displayData.source.depTime.split("T")[0]} at {item.displayData.source.depTime.split("T")[1]}
                </Text>
                <Text style={styles.detail}>
                  Arrival: {item.displayData.destination.arrTime.split("T")[0]} at {item.displayData.destination.arrTime.split("T")[1]}
                </Text>
                <Text style={styles.detail}>Stop Information: {item.displayData.stopInfo}</Text>
                <Text style={styles.detail}>Total Duration: {item.displayData.totalDuration}</Text>
                <Text style={styles.fare}>Fare: {item.fare}</Text>
              </View>
            </View>
          )}
        />

      ) : (
        <Text style={styles.errorText}>No flights found for the selected route.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black'
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: '#3498db',
  },
  sortContainer: {
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 18,
    marginBottom: 5,
    color: '#3498db',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#3498db',
    borderWidth: 1,
    color: '#ecf0f1',
    backgroundColor: 'black',
  },
  resultLabel: {
    fontSize: 20,
    marginBottom: 10,
    color: '#3498db',
  },
  flightCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#34495e',
    backgroundColor: '#2c3e50',
    padding: 15,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  airlineName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  flightNumber: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  location: {
    fontSize: 18,
    color: '#ecf0f1',
  },
  detail: {
    fontSize: 16,
    color: '#ecf0f1',
    marginVertical: 5
  },
  fare: {
    fontSize: 20,
    color: '#ecf0f1',
    marginTop: 20
  },
  errorText: {
    color: "#C70039",
    marginTop: "5%",
    fontSize: 16
  }
});

export default FlightResultsScreen;
