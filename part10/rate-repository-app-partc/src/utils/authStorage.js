import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  async getAccessToken() {
    const rawAccessTokens = await AsyncStorage.getItem(
      `${this.namespace}:accesstoken`,
    );
    return rawAccessTokens ? JSON.parse(rawAccessTokens) : null;
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(
      `${this.namespace}:accesstoken`,
      JSON.stringify(accessToken),
    )
  }

  async removeAccessToken() {
    // Remove the access token from the storage
    await AsyncStorage.removeItem(`${this.namespace}:accesstoken`)
  }
}

export default AuthStorage;