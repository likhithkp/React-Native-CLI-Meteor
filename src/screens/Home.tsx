import {
  StyleSheet,
  View,
  ToastAndroid,
  Button,
  ActivityIndicator,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';

const URL =
  'https://api.openweathermap.org/data/2.5/weather?q=Dubai&APPID=ac4db0b006784d0854b9b8be0051879c&unit=metrics';

type Weather = {
  name: string;
};

export default function Home() {
  const [weather, setWeather] = useState<Weather>();

  const fetchWeather = async () => {
    try {
      const res: any = await fetch(URL);
      const data = await res.json();
      setWeather(data);
      console.log(JSON.stringify(data, null, 2));
    } catch {
      ToastAndroid.show('Unable to fetch the weather!', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (!weather) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Button onPress={fetchWeather} title="Get" />
      <Text>{weather.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
