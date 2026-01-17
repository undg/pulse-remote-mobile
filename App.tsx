import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, View, Text } from 'react-native'

// TODO: replace placeholders with real screens
function SinksScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sinks</Text>
    </View>
  )
}

function SourcesScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sources</Text>
    </View>
  )
}

function ConfigScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Config</Text>
    </View>
  )
}

function AboutScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>About</Text>
    </View>
  )
}

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
