// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import FlightResultsScreen from './src/screens/FlightResultsScreen';
import CitySelectionScreen from './src/screens/CitySelectionScreen';

const Stack = createStackNavigator();

const App = () => {
  const headerStyle = {
    backgroundColor: '#000', // Black background
  };

  const headerTitleStyle = {
    color: '#fff', // White text
  };

  const headerTintColor = '#fff'; // White color for back arrow

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FlightResults"
          component={FlightResultsScreen}
          options={{
            headerStyle,
            headerTitleStyle,
            headerTintColor,
          }}
        />
        <Stack.Screen
          name="CitySelection"
          component={CitySelectionScreen}
          options={{
            headerStyle,
            headerTitleStyle,
            headerTintColor,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
