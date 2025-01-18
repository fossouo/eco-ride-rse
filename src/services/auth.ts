import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { appleAuth } from '@react-native-seoul/apple-authentication';

// Configuration de Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // À remplacer par votre ID client
});

class AuthService {
  // Authentification avec Email/Mot de passe
  async signUpWithEmail(email: string, password: string) {
    try {
      const result = await auth().createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Authentification avec Google
  async signInWithGoogle() {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const result = await auth().signInWithCredential(googleCredential);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // Authentification avec Facebook
  async signInWithFacebook() {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      const userCredential = await auth().signInWithCredential(facebookCredential);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Authentification avec Apple
  async signInWithApple() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      const userCredential = await auth().signInWithCredential(appleCredential);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Déconnexion
  async signOut() {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
    } catch (error) {
      throw error;
    }
  }

  // Observer les changements d'état de l'authentification
  onAuthStateChanged(callback: (user: any) => void) {
    return auth().onAuthStateChanged(callback);
  }
}

export default new AuthService();