import {
  StyleSheet,
  View,
  ToastAndroid,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

type Weather = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
};

type GeoLocation = {
  coords: {
    accuracy: number;
    altitude: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
};

export default function Home() {
  const [weather, setWeather] = useState<Weather>();
  const [location, setLocation] = useState<GeoLocation>();
  const [city, setCity] = useState('');

  const onChangeText = (cityName: string) => {
    console.log(cityName);
    setCity(cityName);
  };

  const fetchWeather = async () => {
    try {
      const res: any = await fetch(
        `${BASE_URL}?q=${city}&APPID=ac4db0b006784d0854b9b8be0051879c&units=metric`,
      );
      const data = await res.json();
      console.log('fetchWeather', JSON.stringify(data, null, 2));

      if (data?.cod === 200) {
        setWeather(data);
        return;
      }

      if (data?.cod === '404') {
        ToastAndroid.show(data?.message, ToastAndroid.SHORT);
        return;
      }
    } catch {
      ToastAndroid.show('Unable to fetch the weather!', ToastAndroid.SHORT);
      return;
    }
  };

  const fetchWeatherByLatAndLong = async () => {
    try {
      const res: any = await fetch(
        `${BASE_URL}?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&APPID=ac4db0b006784d0854b9b8be0051879c&units=metric`,
      );
      const data = await res.json();
      setWeather(data);
      console.log(JSON.stringify(data, null, 2));
      return;
    } catch {
      ToastAndroid.show('Unable to fetch the weather!', ToastAndroid.SHORT);
      return;
    }
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(info => setLocation(info));
    if (location) {
      fetchWeatherByLatAndLong();
      console.log('location', location);
    }
  }, []);

  if (!weather) {
    ToastAndroid.show('Fetching the weather', ToastAndroid.SHORT);
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search City"
        keyboardType="default"
        onChangeText={onChangeText}
        value={city}
      />
      <Button
        onPress={fetchWeather}
        title="Search"
        accessibilityLabel="Button to search weather for the city"
      />
      <Text style={styles.location}>{weather.name}</Text>
      <Text style={styles.temperature}>{Math.round(weather.main.temp)}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    width: 300,
  },
  location: {
    fontSize: 30,
  },
  temperature: {
    fontSize: 100,
    color: 'gray',
  },
});
