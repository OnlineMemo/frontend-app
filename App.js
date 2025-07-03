import * as React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, BackHandler, View } from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// !!! 'react-native-safe-area-context' 도입으로 미사용 !!!
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: Constants.statusBarHeight,
//   },
// });

function WebViewScreen() {
  const webview = useRef(null);
  const insets = useSafeAreaInsets();

  const onAndroidBackPress = () => {
    if (webview.current) {
      webview.current.goBack();
      return true;
    }
    return false;
  };

  const handleWebViewMessage = async (event) => {
    const clipboardData = event.nativeEvent.data;
    // 모바일 클립보드에 데이터 저장
    await Clipboard.setStringAsync(clipboardData);
  };

  useEffect(() => {
    // Android 하드웨어 뒤로 가기 버튼 처리를 위한 이벤트 리스너 추가
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    // 언마운트 시 해당 이벤트 리스너 제거
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, []);

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <WebView
        style={{ flex: 1 }}
        source={{ uri: 'https://www.onlinememo.kr' }}
        ref={webview}
        textZoom={100}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WebViewScreen />
    </SafeAreaProvider>
  );
}

/*
< 플레이스토어 AAB 빌드 방법 >

eas build --platform android --profile production
eas build --platform android --profile production --clear-cache  // 설정변경 후 적용 빌드의 경우

< apk 빌드 방법 >

eas build --platform android --profile preview
eas build --platform android --profile preview --clear-cache  // 설정변경 후 적용 빌드의 경우

< 번외: expo cli 업그레이드 >

expo-cli upgrade
*/