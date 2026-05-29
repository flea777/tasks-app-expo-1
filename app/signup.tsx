import { useEffect, useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

// ─── Validações ────────────────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function strengthLevel(pwd: string): number {
  if (pwd.length === 0) return 0;
  if (pwd.length < 6) return 1;
  if (pwd.length < 9) return 2;
  return 3;
}
const STRENGTH_COLOR = ['#1e1e3f', '#ff4466', '#00d4ff', '#00ff88'];
const STRENGTH_LABEL = ['', 'FRACA', 'MÉDIA', 'FORTE'];

// ─── Overlay de sucesso ─────────────────────────────────────────────────────────
function SuccessOverlay({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 12 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
      Animated.delay(1600),
    ]).start(() => onDone());
  }, []);

  return (
    <Animated.View style={[styles.successOverlay, { opacity }]}>
      <Animated.View style={[styles.successCard, { transform: [{ scale }] }]}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>CONTA CRIADA</Text>
        <Text style={styles.successSub}>Redirecionando para o login...</Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Botão com glow que segue o mouse ─────────────────────────────────────────
function GlowButton({
  onPress, loading, disabled,
}: { onPress: () => void; loading: boolean; disabled: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const btnScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const animateScale = (to: number) =>
    Animated.spring(btnScale, { toValue: to, useNativeDriver: true, speed: 20 }).start();

  const handleMouseEnter = () => {
    setHovered(true);
    Animated.timing(glowOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };
  const handleMouseLeave = () => {
    setHovered(false);
    Animated.timing(glowOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };
  const handleMouseMove = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setGlowPos({ x: locationX, y: locationY });
  };

  const webEvents = Platform.OS === 'web'
    ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, onMouseMove: handleMouseMove }
    : {};

  return (
    <Animated.View style={[{ transform: [{ scale: btnScale }] }, disabled && { opacity: 0.5 }]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => animateScale(0.96)}
        onPressOut={() => animateScale(1)}
        style={[styles.button, loading && styles.buttonLoading]}
        {...webEvents}
      >
        {/* Glow que segue o cursor */}
        <Animated.View
          style={[
            styles.buttonGlow,
            { opacity: glowOpacity, left: glowPos.x - 60, top: glowPos.y - 60 },
          ]}
          pointerEvents="none"
        />
        <Text style={styles.buttonText}>
          {loading ? 'PROCESSANDO...' : 'CRIAR CONTA  →'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Tela principal ─────────────────────────────────────────────────────────────
export default function SignupScreen() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const register = useAuthStore((state) => state.register);
  const router   = useRouter();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())        e.name     = 'Nome é obrigatório.';
    if (!email.trim())       e.email    = 'E-mail é obrigatório.';
    else if (!isValidEmail(email)) e.email = 'E-mail inválido. Verifique o @.';
    if (!password)           e.password = 'Senha é obrigatória.';
    else if (password.length < 6) e.password = 'Mínimo de 6 caracteres.';
    if (!confirmPassword)    e.confirm  = 'Confirme sua senha.';
    else if (confirmPassword !== password) e.confirm = 'As senhas não coincidem.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        (err?.message === 'Network Error' ? 'Servidor não encontrado. Verifique o backend.' : err?.message) ??
        'Erro ao cadastrar. Tente novamente.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: string) => ({
    hasError: !!errors[key],
    clearError: () => setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; }),
  });

  const strength = strengthLevel(password);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.glowPurple} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>◈</Text>
          <Text style={styles.title}>TASK OS</Text>
          <Text style={styles.subtitle}>Novo Registro de Usuário</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>CADASTRO</Text>

          {/* Nome */}
          <Field label="NOME" error={errors.name}>
            <TextInput
              style={[styles.input, name && styles.inputActive, errors.name && styles.inputError]}
              placeholder="Seu nome completo"
              placeholderTextColor="#333355"
              autoCapitalize="words"
              value={name}
              onChangeText={(v) => { setName(v); field('name').clearError(); }}
            />
          </Field>

          {/* E-mail */}
          <Field label="E-MAIL" error={errors.email}>
            <TextInput
              style={[styles.input, email && styles.inputActive, errors.email && styles.inputError]}
              placeholder="usuario@email.com"
              placeholderTextColor="#333355"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => { setEmail(v); field('email').clearError(); }}
            />
          </Field>

          {/* Senha */}
          <Field label="SENHA" error={errors.password}>
            <TextInput
              style={[styles.input, password && styles.inputActive, errors.password && styles.inputError]}
              placeholder="mínimo 6 caracteres"
              placeholderTextColor="#333355"
              secureTextEntry
              value={password}
              onChangeText={(v) => { setPassword(v); field('password').clearError(); }}
            />
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[styles.strengthBar, { backgroundColor: strength >= i ? STRENGTH_COLOR[strength] : '#1e1e3f' }]}
                  />
                ))}
                <Text style={[styles.strengthLabel, { color: STRENGTH_COLOR[strength] }]}>
                  {STRENGTH_LABEL[strength]}
                </Text>
              </View>
            )}
          </Field>

          {/* Confirmar senha */}
          <Field label="CONFIRMAR SENHA" error={errors.confirm}>
            <View style={styles.confirmRow}>
              <TextInput
                style={[
                  styles.input, styles.inputFlex,
                  confirmPassword && styles.inputActive,
                  errors.confirm && styles.inputError,
                  confirmPassword && confirmPassword === password && styles.inputMatch,
                ]}
                placeholder="repita a senha"
                placeholderTextColor="#333355"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(v) => { setConfirmPassword(v); field('confirm').clearError(); }}
              />
              {confirmPassword.length > 0 && (
                <Text style={[styles.matchIcon, { color: confirmPassword === password ? '#00ff88' : '#ff4466' }]}>
                  {confirmPassword === password ? '✓' : '✗'}
                </Text>
              )}
            </View>
          </Field>

          {/* Erro geral */}
          {errors.general ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {errors.general}</Text>
            </View>
          ) : null}

          <GlowButton onPress={handleSignup} loading={loading} disabled={loading} />
        </View>

        <Pressable onPress={() => router.push('/login')} style={styles.link}>
          <Text style={styles.linkText}>
            Já tem uma conta?{'  '}
            <Text style={styles.linkHighlight}>ENTRAR</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>

      {success && <SuccessOverlay onDone={() => router.replace('/login')} />}
    </SafeAreaView>
  );
}

// ─── Componente de campo ────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.fieldError}>⚠ {error}</Text> : null}
    </View>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050510' },
  glowPurple: {
    position: 'absolute', top: -80, left: '50%', marginLeft: -150,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(124, 58, 237, 0.07)',
  },
  container: {
    flex: 1, paddingHorizontal: 24, justifyContent: 'center',
    maxWidth: 480, width: '100%', alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 28 },
  logo: { fontSize: 32, color: '#7c3aed', marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '900', color: '#7c3aed', letterSpacing: 10 },
  subtitle: { color: '#444466', fontSize: 10, letterSpacing: 3, marginTop: 4 },
  card: {
    backgroundColor: '#0d0d1f', borderRadius: 12,
    borderWidth: 1, borderColor: '#1e1e3f', padding: 20,
  },
  cardTitle: { color: '#00d4ff', fontSize: 10, fontWeight: '700', letterSpacing: 4, marginBottom: 16 },
  fieldGroup: { marginBottom: 12 },
  label: { color: '#444466', fontSize: 9, fontWeight: '700', letterSpacing: 3, marginBottom: 5 },
  input: {
    backgroundColor: '#0a0a18', borderWidth: 1, borderColor: '#1e1e3f',
    borderRadius: 8, paddingVertical: 11, paddingHorizontal: 14, fontSize: 14, color: '#fff',
  },
  inputFlex: { flex: 1 },
  inputActive: { borderColor: '#7c3aed' },
  inputError: { borderColor: '#ff4466' },
  inputMatch: { borderColor: '#00ff88' },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  matchIcon: { fontSize: 20, fontWeight: '900' },
  fieldError: { color: '#ff4466', fontSize: 11, marginTop: 4 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 2, marginLeft: 4 },
  errorBox: {
    backgroundColor: 'rgba(255,68,102,0.1)', borderWidth: 1, borderColor: '#ff4466',
    borderRadius: 8, padding: 10, marginBottom: 12,
  },
  errorText: { color: '#ff4466', fontSize: 12 },
  button: {
    backgroundColor: '#7c3aed', paddingVertical: 14, borderRadius: 8,
    alignItems: 'center', marginTop: 6, overflow: 'hidden',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },
  buttonLoading: { backgroundColor: '#3d1f74', shadowOpacity: 0 },
  buttonGlow: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  buttonText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 3, zIndex: 1 },
  link: { marginTop: 24, alignItems: 'center' },
  linkText: { color: '#444466', fontSize: 12, letterSpacing: 1 },
  linkHighlight: { color: '#00d4ff', fontWeight: '700', letterSpacing: 2 },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,5,16,0.95)',
    justifyContent: 'center', alignItems: 'center',
  },
  successCard: {
    alignItems: 'center', backgroundColor: '#0d0d1f',
    borderRadius: 16, borderWidth: 1, borderColor: '#00ff88', padding: 40,
    shadowColor: '#00ff88', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35, shadowRadius: 24, elevation: 12,
  },
  successIcon: { fontSize: 52, color: '#00ff88', marginBottom: 14 },
  successTitle: { fontSize: 20, fontWeight: '900', color: '#00ff88', letterSpacing: 6 },
  successSub: { color: '#444466', fontSize: 11, letterSpacing: 2, marginTop: 8 },
});
