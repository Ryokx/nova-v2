import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";

// Tab screens
import { ClientHomeScreen } from "../screens/client/HomeScreen";
import { ClientNotificationsScreen } from "../screens/client/NotificationsScreen";
import { ClientMissionsScreen } from "../screens/client/MissionsScreen";
import { ClientProfileScreen } from "../screens/client/ProfileScreen";

// Detail screens (shown inside tabs to keep tab bar visible)
import { ArtisanListScreen } from "../screens/client/ArtisanListScreen";
import { AllCategoriesScreen } from "../screens/client/AllCategoriesScreen";
import { BookingScreen } from "../screens/client/BookingScreen";
import { PaymentScreen } from "../screens/client/PaymentScreen";
import { MissionDetailScreen } from "../screens/client/MissionDetailScreen";
import { ReportDisputeScreen } from "../screens/client/ReportDisputeScreen";
import { TrackingScreen } from "../screens/client/TrackingScreen";
import { SignDevisScreen } from "../screens/client/SignDevisScreen";
import { DevisReceivedScreen } from "../screens/client/DevisReceivedScreen";
import { VideoDiagnosticScreen } from "../screens/client/VideoDiagnosticScreen";
import { MaintenanceContractScreen } from "../screens/client/MaintenanceContractScreen";
import { ContractDetailScreen } from "../screens/client/ContractDetailScreen";
import { ReferralScreen } from "../screens/client/ReferralScreen";
import { EmergencyScreen } from "../screens/client/EmergencyScreen";
import { PaymentMethodsScreen } from "../screens/client/PaymentMethodsScreen";
import { SupportScreen } from "../screens/shared/SupportScreen";
import { SettingsScreen } from "../screens/shared/SettingsScreen";
import { NotificationPrefsScreen } from "../screens/shared/NotificationPrefsScreen";

const Tab = createBottomTabNavigator<any>();
const HomeStack = createNativeStackNavigator<any>();
const NotifsStack = createNativeStackNavigator<any>();
const MissionsStack = createNativeStackNavigator<any>();
const ProfileStack = createNativeStackNavigator<any>();

const stackOptions = { headerShown: false } as const;

/* Shared detail screens added to each stack that needs them */
function addSharedScreens(Stack: ReturnType<typeof createNativeStackNavigator>) {
  return (
    <>
      <Stack.Screen name="ArtisanListByCategory" component={ArtisanListScreen} />
      <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
      <Stack.Screen name="ReportDispute" component={ReportDisputeScreen} />
      <Stack.Screen name="Tracking" component={TrackingScreen} />
      <Stack.Screen name="SignDevis" component={SignDevisScreen} />
      <Stack.Screen name="DevisReceived" component={DevisReceivedScreen} />
      <Stack.Screen name="VideoDialognostic" component={VideoDiagnosticScreen} />
      <Stack.Screen name="MaintenanceContract" component={MaintenanceContractScreen} />
      <Stack.Screen name="ContractDetail" component={ContractDetailScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPrefsScreen} />
    </>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={stackOptions}>
      <HomeStack.Screen name="ClientHomeMain" component={ClientHomeScreen} />
      {addSharedScreens(HomeStack)}
    </HomeStack.Navigator>
  );
}

function NotifsStackScreen() {
  return (
    <NotifsStack.Navigator screenOptions={stackOptions}>
      <NotifsStack.Screen name="ClientNotifsMain" component={ClientNotificationsScreen} />
      {addSharedScreens(NotifsStack)}
    </NotifsStack.Navigator>
  );
}

function MissionsStackScreen() {
  return (
    <MissionsStack.Navigator screenOptions={stackOptions}>
      <MissionsStack.Screen name="ClientMissionsMain" component={ClientMissionsScreen} />
      {addSharedScreens(MissionsStack)}
    </MissionsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={stackOptions}>
      <ProfileStack.Screen name="ClientProfileMain" component={ClientProfileScreen} />
      {addSharedScreens(ProfileStack)}
    </ProfileStack.Navigator>
  );
}

function TabIcon({ name, focused, badge }: { name: string; focused: boolean; badge?: number }) {
  const iconNames: Record<string, string> = {
    Accueil: "home",
    Notifs: "bell",
    Interventions: "briefcase",
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
        name="ClientHome"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => <TabIcon name="Accueil" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ClientNotifications"
        component={NotifsStackScreen}
        options={{
          tabBarLabel: "Notifs",
          tabBarIcon: ({ focused }) => <TabIcon name="Notifs" focused={focused} badge={2} />,
        }}
      />
      <Tab.Screen
        name="ClientMissions"
        component={MissionsStackScreen}
        options={{
          tabBarLabel: "Interventions",
          tabBarIcon: ({ focused }) => <TabIcon name="Interventions" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ClientProfile"
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
