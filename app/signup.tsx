import { useEffect, useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 12 }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.delay(1400),
    ]).start(() => onDone());
  }, []);

  return (
    <Animated.View style={[styles.successOverlay, { opacity }]}>
      <Animated.View style={[styles.successCard, { transform: [{ scale }] }]}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>CONTA CRIADA</Text>
        <Text style={styles.successSub}>Redirecionando...</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const router = useRouter();
  const btnScale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) =>
    Animated.spring(btnScale, { toValue, useNativeDriver: true, speed: 20 }).start();

  const handleSignup = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Erro ao cadastrar. Tente novamente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.glowPurple} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.logo}>◈</Text>
          <Text style={styles.title}>TASK OS</Text>
          <Text style={styles.subtitle}>Novo Registro de Usuário</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>CADASTRO</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={[styles.input, name.length > 0 && styles.inputActive]}
              placeholder="Seu nome completo"
              placeholderTextColor="#333355"
              autoCapitalize="words"
              value={name}
              onChangeText={(v) => { setName(v); setError(''); }}
            />
          </View>

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
              placeholder="mínimo 6 caracteres"
              placeholderTextColor="#333355"
              secureTextEntry
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
            />
            {password.length > 0 && (
              <View style={styles.passwordStrength}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      password.length >= i * 3
                        ? { backgroundColor: password.length >= 8 ? '#00ff88' : password.length >= 6 ? '#00d4ff' : '#ff9900' }
                        : { backgroundColor: '#1e1e3f' },
                    ]}
                  />
                ))}
              </View>
            )}
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
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'CRIANDO...' : 'CRIAR CONTA  →'}</Text>
            </Pressable>
          </Animated.View>
        </View>

        <Pressable onPress={() => router.push('/login')} style={styles.link}>
          <Text style={styles.linkText}>
            Já tem uma conta?{'  '}
            <Text style={styles.linkHighlight}>ENTRAR</Text>
          </Text>
        </Pressable>

      </KeyboardAvoidingView>

      {success && <SuccessOverlay onDone={() => {}} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050510' },
  glowPurple: {
    position: 'absolute',
    top: -80,
    left: '50%',
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124, 58, 237, 0.07)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 36 },
  logo: { fontSize: 36, color: '#7c3aed', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '900', color: '#7c3aed', letterSpacing: 10 },
  subtitle: { color: '#444466', fontSize: 11, letterSpacing: 3, marginTop: 4 },
  card: {
    backgroundColor: '#0d0d1f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1e3f',
    padding: 24,
  },
  cardTitle: { color: '#00d4ff', fontSize: 11, fontWeight: '700', letterSpacing: 4, marginBottom: 20 },
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
  inputActive: { borderColor: '#7c3aed' },
  passwordStrength: { flexDirection: 'row', gap: 4, marginTop: 6 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
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
    backgroundColor: '#7c3aed',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonLoading: { backgroundColor: '#3d1f74', shadowOpacity: 0 },
  buttonText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 3 },
  link: { marginTop: 28, alignItems: 'center' },
  linkText: { color: '#444466', fontSize: 13, letterSpacing: 1 },
  linkHighlight: { color: '#00d4ff', fontWeight: '700', letterSpacing: 2 },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 16, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: '#0d0d1f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00ff88',
    padding: 40,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: { fontSize: 48, color: '#00ff88', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#00ff88', letterSpacing: 6 },
  successSub: { color: '#444466', fontSize: 12, letterSpacing: 3, marginTop: 8 },
});
