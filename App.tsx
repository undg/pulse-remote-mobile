import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { SinksScreen } from './src/screens/Sinks'
import { SourcesScreen } from './src/screens/Sources'
import { ConfigScreen } from './src/screens/Config'
import { AboutScreen } from './src/screens/About'

const Tab = createBottomTabNavigator()

export default function App() {
  const scheme = useColorScheme()

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style='auto' />
      <Tab.Navigator initialRouteName='Sinks'>
        <Tab.Screen name='Sinks' component={SinksScreen} />
        <Tab.Screen name='Sources' component={SourcesScreen} />
        <Tab.Screen name='Config' component={ConfigScreen} />
        <Tab.Screen name='About' component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
