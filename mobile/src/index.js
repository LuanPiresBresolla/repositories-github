import React from 'react';
import { StatusBar } from 'react-native';
import './config/ReactotronConfig'; // Debug com ReactoTron
import 'react-native-gesture-handler';

import Routes from './routes';

export default function App() {
  return (
    <>
      {/* Configurando status bar do IOS e ANDROID */}
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <Routes />
    </>
  );
}
