import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";
import type { ArtisanTabParamList } from "./types";

// Screens
import { ArtisanHomeScreen } from "../screens/artisan/HomeScreen";
import { ArtisanNotificationsScreen } from "../screens/artisan/NotificationsScreen";
import { ArtisanPaymentsScreen } from "../screens/artisan/PaymentsScreen";
import { ArtisanProfileScreen } from "../screens/artisan/ProfileScreen";

const Tab = createBottomTabNavigator<ArtisanTabParamList>();

function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  const icons: Record<string, string> = {
    Accueil: "🏠",
    Notifs: "🔔",
    Paiements: "🔒",
    Profil: "👤",
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconActive]}>
        {icons[name] || "•"}
      </Text>
      {badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export function ArtisanTabs() {
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
        name="ArtisanHome"
        component={ArtisanHomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => <TabIcon name="Accueil" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ArtisanNotifications"
        component={ArtisanNotificationsScreen}
        options={{
          tabBarLabel: "Notifs",
          tabBarIcon: ({ focused }) => <TabIcon name="Notifs" focused={focused} badge={3} />,
        }}
      />
      <Tab.Screen
        name="ArtisanPayments"
        component={ArtisanPaymentsScreen}
        options={{
          tabBarLabel: "Paiements",
          tabBarIcon: ({ focused }) => <TabIcon name="Paiements" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ArtisanProfile"
        component={ArtisanProfileScreen}
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
