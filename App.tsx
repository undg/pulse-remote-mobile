import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "theme";
import { SinksScreen } from "screens/Sinks";
import { SourcesScreen } from "screens/Sources";
import { ConfigScreen } from "screens/Config";
import { AboutScreen } from "screens/About";

const Tab = createBottomTabNavigator();

function AppInner() {
  const { navigationTheme, colors } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Sinks"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case "Sinks":
                iconName = "volume-high-outline";
                break;
              case "Sources":
                iconName = "mic-outline";
                break;
              case "Config":
                iconName = "settings-outline";
                break;
              default:
                iconName = "information-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
        })}
      >
        <Tab.Screen name="Sinks" component={SinksScreen} />
        <Tab.Screen name="Sources" component={SourcesScreen} />
        <Tab.Screen name="Config" component={ConfigScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
