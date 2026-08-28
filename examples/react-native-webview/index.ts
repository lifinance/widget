// Hermes ships no crypto.getRandomValues; viem needs it. Must be the
// first import so the polyfill lands before anything touches crypto.
import 'react-native-get-random-values'
import { registerRootComponent } from 'expo'
import App from './App'

registerRootComponent(App)
