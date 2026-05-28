import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

function SplashScreen() {
  const pulse = useRef(new Animated.Value(0.4)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.splash}>
      <View style={styles.splashGlow} />
      <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
      <Animated.View style={[styles.ring2, { transform: [{ rotate: spin }], opacity: pulse }]} />
      <Animated.Text style={[styles.splashTitle, { opacity: pulse }]}>TASK OS</Animated.Text>
      <Text style={styles.splashSub}>inicializando sistema...</Text>
    </View>
  );
}

export default function RootLayout() {
  const { token, loading, loadToken } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inTabs = segments[0] === '(tabs)';
    if (!token && inTabs) {
      router.replace('/login');
    } else if (token && !inTabs) {
      router.replace('/(tabs)');
    }
  }, [token, loading, segments]);

  if (loading) return <SplashScreen />;

  return <Slot />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#050510',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 212, 255, 0.06)',
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00d4ff',
    borderTopColor: 'transparent',
    borderRightColor: 'rgba(0,212,255,0.3)',
    marginBottom: -50,
  },
  ring2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderBottomColor: 'transparent',
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00d4ff',
    letterSpacing: 10,
    marginTop: 16,
  },
  splashSub: {
    color: '#444466',
    fontSize: 12,
    letterSpacing: 3,
    marginTop: 8,
  },
});
