import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Tab navigators (contain nested stacks with all detail screens)
import { ClientTabs } from "./ClientTabs";
import { ArtisanTabs } from "./ArtisanTabs";

// Auth
import { AuthScreen } from "../screens/auth/AuthScreen";

// ArtisanProfile is the ONLY screen outside tabs (no tab bar)
import { ArtisanProfileScreen } from "../screens/client/ArtisanProfileScreen";

const Stack = createNativeStackNavigator<any>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="ArtisanTabs" component={ArtisanTabs} />

      {/* Artisan profile opens fullscreen without tab bar */}
      <Stack.Screen name="ArtisanProfile" component={ArtisanProfileScreen} />
    </Stack.Navigator>
  );
}
