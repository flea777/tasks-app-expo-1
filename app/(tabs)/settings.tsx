import { useRef } from 'react';
import { Animated, Platform, Pressable, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, Text, View, Alert } from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function SettingsScreen() {
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const btnScale = useRef(new Animated.Value(1)).current;

  const animatePress = (toValue: number) =>
    Animated.spring(btnScale, { toValue, useNativeDriver: true, speed: 20 }).start();

  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const maskedToken = token ? `${token.slice(0, 12)}...${token.slice(-6)}` : '—';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.pageTitle}>CONFIGURAÇÕES</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SESSÃO ATIVA</Text>
          <View style={styles.tokenCard}>
            <View style={styles.tokenDot} />
            <Text style={styles.tokenText} numberOfLines={1}>{maskedToken}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SISTEMA</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plataforma</Text>
              <Text style={styles.infoValue}>{Platform.OS.toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versão</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: '#00ff88' }]}>● ONLINE</Text>
            </View>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <Pressable
            style={styles.logoutButton}
            onPressIn={() => animatePress(0.96)}
            onPressOut={() => animatePress(1)}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>ENCERRAR SESSÃO  ⏻</Text>
          </Pressable>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050510',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  pageTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#00d4ff',
    letterSpacing: 6,
    marginBottom: 32,
  },
  section: { marginBottom: 28 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#444466',
    letterSpacing: 3,
    marginBottom: 10,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d1f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e1e3f',
    padding: 16,
    gap: 10,
  },
  tokenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  tokenText: { color: '#444466', fontSize: 13, fontFamily: 'monospace', flex: 1 },
  infoCard: {
    backgroundColor: '#0d0d1f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e1e3f',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  divider: { height: 1, backgroundColor: '#1e1e3f' },
  infoLabel: { color: '#444466', fontSize: 13 },
  infoValue: { color: '#7c7c9a', fontSize: 13, fontWeight: '600' },
  logoutButton: {
    backgroundColor: 'rgba(255, 68, 102, 0.1)',
    borderWidth: 1,
    borderColor: '#ff4466',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#ff4466',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutText: { color: '#ff4466', fontSize: 13, fontWeight: '900', letterSpacing: 3 },
});
