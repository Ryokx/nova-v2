import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

// Tab screens
import { ArtisanHomeScreen } from "../screens/artisan/HomeScreen";
import { ArtisanNotificationsScreen } from "../screens/artisan/NotificationsScreen";
import { ArtisanPaymentsScreen } from "../screens/artisan/PaymentsScreen";
import { ArtisanProfileScreen } from "../screens/artisan/ProfileScreen";

// Detail screens
import { CreateQuoteScreen } from "../screens/artisan/CreateQuoteScreen";
import { CreateInvoiceScreen } from "../screens/artisan/CreateInvoiceScreen";
import { QuoteSignatureScreen } from "../screens/artisan/QuoteSignatureScreen";
import { RDVDetailScreen } from "../screens/artisan/RDVDetailScreen";
import { UrgentDetailScreen } from "../screens/artisan/UrgentDetailScreen";
import { ArtisanDocumentsScreen } from "../screens/artisan/DocumentsScreen";
import { ClientDirectoryScreen } from "../screens/artisan/ClientDirectoryScreen";
import { QRCodeScreen } from "../screens/artisan/QRCodeScreen";
import { AccountingScreen } from "../screens/artisan/AccountingScreen";
import { ArtisanPricingScreen } from "../screens/artisan/PricingScreen";
import { SupportScreen } from "../screens/shared/SupportScreen";
import { SettingsScreen } from "../screens/shared/SettingsScreen";
import { NotificationPrefsScreen } from "../screens/shared/NotificationPrefsScreen";

const Tab = createBottomTabNavigator<any>();
const HomeStack = createNativeStackNavigator<any>();
const NotifsStack = createNativeStackNavigator<any>();
const PayStack = createNativeStackNavigator<any>();
const ProfileStack = createNativeStackNavigator<any>();

const stackOptions = { headerShown: false } as const;

function addArtisanSharedScreens(Stack: ReturnType<typeof createNativeStackNavigator>) {
  return (
    <>
      <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      <Stack.Screen name="QuoteSignature" component={QuoteSignatureScreen} />
      <Stack.Screen name="RDVDetail" component={RDVDetailScreen} />
      <Stack.Screen name="UrgentDetail" component={UrgentDetailScreen} />
      <Stack.Screen name="ArtisanDocuments" component={ArtisanDocumentsScreen} />
      <Stack.Screen name="ClientDirectory" component={ClientDirectoryScreen} />
      <Stack.Screen name="QRCodeProfile" component={QRCodeScreen} />
      <Stack.Screen name="Accounting" component={AccountingScreen} />
      <Stack.Screen name="ArtisanPricing" component={ArtisanPricingScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPrefsScreen} />
      <Stack.Screen name="Referral" component={({ navigation }: any) => {
        const { ReferralScreen } = require("../screens/client/ReferralScreen");
        return <ReferralScreen navigation={navigation} route={{ params: {} } as any} />;
      }} />
    </>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={stackOptions}>
      <HomeStack.Screen name="ArtisanHomeMain" component={ArtisanHomeScreen} />
      {addArtisanSharedScreens(HomeStack)}
    </HomeStack.Navigator>
  );
}

function NotifsStackScreen() {
  return (
    <NotifsStack.Navigator screenOptions={stackOptions}>
      <NotifsStack.Screen name="ArtisanNotifsMain" component={ArtisanNotificationsScreen} />
      {addArtisanSharedScreens(NotifsStack)}
    </NotifsStack.Navigator>
  );
}

function PayStackScreen() {
  return (
    <PayStack.Navigator screenOptions={stackOptions}>
      <PayStack.Screen name="ArtisanPayMain" component={ArtisanPaymentsScreen} />
      {addArtisanSharedScreens(PayStack)}
    </PayStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={stackOptions}>
      <ProfileStack.Screen name="ArtisanProfileMain" component={ArtisanProfileScreen} />
      {addArtisanSharedScreens(ProfileStack)}
    </ProfileStack.Navigator>
  );
}

function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  const iconNames: Record<string, string> = {
    Accueil: "home",
    Notifs: "bell",
    Paiements: "lock",
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

export function ArtisanTabs() {
  const { c } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { ...styles.tabBar, backgroundColor: c.card + "F0", borderTopColor: c.border },
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.forest,
        tabBarInactiveTintColor: Colors.textHint,
      }}
    >
      <Tab.Screen
        name="ArtisanHome"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => <TabIcon name="Accueil" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ArtisanNotifications"
        component={NotifsStackScreen}
        options={{
          tabBarLabel: "Notifs",
          tabBarIcon: ({ focused }) => <TabIcon name="Notifs" focused={focused} badge={3} />,
        }}
      />
      <Tab.Screen
        name="ArtisanPayments"
        component={PayStackScreen}
        options={{
          tabBarLabel: "Paiements",
          tabBarIcon: ({ focused }) => <TabIcon name="Paiements" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ArtisanProfile"
        component={ProfileStackScreen}
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
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingBottom: 24,
    height: 80,
  },
  tabLabel: { fontFamily: "DMSans_500Medium", fontSize: 10 },
  tabIcon: { alignItems: "center", justifyContent: "center", position: "relative" },
  badge: {
    position: "absolute", top: -4, right: -10,
    backgroundColor: Colors.red, borderRadius: 8,
    width: 16, height: 16, alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: Colors.white, fontSize: 9, fontFamily: "DMSans_700Bold" },
});
