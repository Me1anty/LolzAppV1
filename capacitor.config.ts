import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lolzapp.app',
  appName: 'LolzApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'api.lzt.market',
      'lzt.market' // Добавьте это для OAuth
    ]
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    App: {
      appUrlOpen: {
        android: {
          enabled: true
        }
      }
    }
  }
};

export default config;