import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: '192.168.1.8' })
    .useReactNative()
    .connect();

  // android emulator - adb reverse tcp:9090 tcp:9090

  console.tron = tron;

  tron.clear();
}
