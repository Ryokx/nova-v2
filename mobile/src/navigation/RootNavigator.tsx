import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Tab navigators (contain nested stacks with all detail screens)
import { ClientTabs } from "./ClientTabs";
import { ArtisanTabs } from "./ArtisanTabs";

// Auth
import { AuthScreen } from "../screens/auth/AuthScreen";
import { PendingValidationScreen } from "../screens/artisan/PendingValidationScreen";

// Screens that open fullscreen without tab bar
import { ArtisanProfileScreen } from "../screens/client/ArtisanProfileScreen";
import { MaintenanceContractScreen } from "../screens/client/MaintenanceContractScreen";
import { ContractDetailScreen } from "../screens/client/ContractDetailScreen";
import { BookingScreen } from "../screens/client/BookingScreen";
import { PaymentScreen } from "../screens/client/PaymentScreen";

const Stack = createNativeStackNavigator<any>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="ArtisanPendingValidation" component={PendingValidationScreen} />
      <Stack.Screen name="ArtisanTabs" component={ArtisanTabs} />

      {/* Screens accessible from ArtisanProfile (outside tabs) */}
      <Stack.Screen name="ArtisanProfile" component={ArtisanProfileScreen} />
      <Stack.Screen name="MaintenanceContract" component={MaintenanceContractScreen} />
      <Stack.Screen name="ContractDetail" component={ContractDetailScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}
