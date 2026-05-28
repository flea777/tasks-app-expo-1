import { useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const btnScale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) =>
    Animated.spring(btnScale, { toValue, useNativeDriver: true, speed: 20 }).start();

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Credenciais inválidas. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.glow} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.logo}>⬡</Text>
          <Text style={styles.title}>TASK OS</Text>
          <Text style={styles.subtitle}>Sistema de Autenticação</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>ACESSO</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={[styles.input, email.length > 0 && styles.inputActive]}
              placeholder="usuario@email.com"
              placeholderTextColor="#333355"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <TextInput
              style={[styles.input, password.length > 0 && styles.inputActive]}
              placeholder="••••••••"
              placeholderTextColor="#333355"
              secureTextEntry
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <Pressable
              style={[styles.button, loading && styles.buttonLoading]}
              onPressIn={() => animatePress(0.96)}
              onPressOut={() => animatePress(1)}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>VERIFICANDO...</Text>
              ) : (
                <Text style={styles.buttonText}>ENTRAR  →</Text>
              )}
            </Pressable>
          </Animated.View>
        </View>

        <Pressable onPress={() => router.push('/signup')} style={styles.link}>
          <Text style={styles.linkText}>
            Não tem acesso?{'  '}
            <Text style={styles.linkHighlight}>CRIAR CONTA</Text>
          </Text>
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050510' },
  glow: {
    position: 'absolute',
    top: -100,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 212, 255, 0.07)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 40, color: '#00d4ff', marginBottom: 8 },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00d4ff',
    letterSpacing: 10,
  },
  subtitle: { color: '#444466', fontSize: 11, letterSpacing: 3, marginTop: 4 },
  card: {
    backgroundColor: '#0d0d1f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1e3f',
    padding: 24,
  },
  cardTitle: {
    color: '#7c3aed',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
  label: { color: '#444466', fontSize: 10, fontWeight: '700', letterSpacing: 3, marginBottom: 6 },
  input: {
    backgroundColor: '#0a0a18',
    borderWidth: 1,
    borderColor: '#1e1e3f',
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#ffffff',
  },
  inputActive: {
    borderColor: '#00d4ff',
  },
  errorBox: {
    backgroundColor: 'rgba(255, 68, 102, 0.1)',
    borderWidth: 1,
    borderColor: '#ff4466',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#ff4466', fontSize: 13 },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonLoading: { backgroundColor: '#006680', shadowOpacity: 0 },
  buttonText: { color: '#000', fontWeight: '900', fontSize: 14, letterSpacing: 3 },
  link: { marginTop: 28, alignItems: 'center' },
  linkText: { color: '#444466', fontSize: 13, letterSpacing: 1 },
  linkHighlight: { color: '#7c3aed', fontWeight: '700', letterSpacing: 2 },
});
