import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import auth from '../services/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'client' | 'driver'>('client');

  const handleEmailAuth = async () => {
    try {
      if (isSignUp) {
        await auth.signUpWithEmail(email, password);
        // Créer le profil utilisateur avec le type sélectionné
        await createUserProfile();
      } else {
        await auth.signInWithEmail(email, password);
      }
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await auth.signInWithGoogle();
      await createUserProfile();
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleFacebookAuth = async () => {
    try {
      await auth.signInWithFacebook();
      await createUserProfile();
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleAppleAuth = async () => {
    try {
      await auth.signInWithApple();
      await createUserProfile();
      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const createUserProfile = async () => {
    // À implémenter : création du profil utilisateur dans la base de données
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Créer un compte' : 'Connexion'}
      </Text>

      {/* Sélection du type d'utilisateur lors de l'inscription */}
      {isSignUp && (
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'client' && styles.selectedType,
            ]}
            onPress={() => setUserType('client')}
          >
            <Text style={styles.userTypeText}>Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === 'driver' && styles.selectedType,
            ]}
            onPress={() => setUserType('driver')}
          >
            <Text style={styles.userTypeText}>Chauffeur</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleEmailAuth}>
        <Text style={styles.buttonText}>
          {isSignUp ? "S'inscrire" : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
          <Icon name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookAuth}>
          <Icon name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleAuth}>
            <Icon name="apple" size={24} color="#000000" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchText}>
          {isSignUp
            ? 'Déjà un compte ? Connectez-vous'
            : "Pas de compte ? S'inscrire"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  userTypeButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2ecc71',
    width: '40%',
  },
  selectedType: {
    backgroundColor: '#2ecc71',
  },
  userTypeText: {
    textAlign: 'center',
    color: '#2ecc71',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  socialButton: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  switchText: {
    color: '#2ecc71',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AuthScreen;