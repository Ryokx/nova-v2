import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import type { ClientTabParamList } from "./types";

// Screens
import { ClientHomeScreen } from "../screens/client/HomeScreen";
import { ClientNotificationsScreen } from "../screens/client/NotificationsScreen";
import { ClientMissionsScreen } from "../screens/client/MissionsScreen";
import { ClientProfileScreen } from "../screens/client/ProfileScreen";

const Tab = createBottomTabNavigator<ClientTabParamList>();

function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  const iconNames: Record<string, string> = {
    Accueil: "home",
    Notifs: "bell",
    Missions: "briefcase",
    Profil: "account",
  };

  return (
    <View style={styles.tabIcon}>
      <MaterialCommunityIcons
        name={(iconNames[name] || "circle") as any}
        size={22}
        color={focused ? Colors.forest : Colors.textHint}
      />
      {badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.forest,
        tabBarInactiveTintColor: Colors.textHint,
      }}
    >
      <Tab.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => <TabIcon name="Accueil" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ClientNotifications"
        component={ClientNotificationsScreen}
        options={{
          tabBarLabel: "Notifs",
          tabBarIcon: ({ focused }) => <TabIcon name="Notifs" focused={focused} badge={2} />,
        }}
      />
      <Tab.Screen
        name="ClientMissions"
        component={ClientMissionsScreen}
        options={{
          tabBarLabel: "Missions",
          tabBarIcon: ({ focused }) => <TabIcon name="Missions" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ClientProfile"
        component={ClientProfileScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ focused }) => <TabIcon name="Profil" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: 24,
    height: 80,
  },
  tabLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
  },
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  icon: { fontSize: 22, opacity: 0.5 },
  iconActive: { opacity: 1 },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: Colors.red,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: "DMSans_700Bold",
  },
});
