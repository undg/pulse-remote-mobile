import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { ThemeProvider, useTheme } from 'theme'
import { SinksScreen } from 'screens/Sinks'
import { SourcesScreen } from 'screens/Sources'
import { ConfigScreen } from 'screens/Config'
import { AboutScreen } from 'screens/About'

const Tab = createBottomTabNavigator()

function AppInner() {
  const { navigationTheme } = useTheme()

  return (
    <NavigationContainer theme={navigationTheme}>
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

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
