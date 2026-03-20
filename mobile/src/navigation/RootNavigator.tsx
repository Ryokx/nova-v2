import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

// Tab navigators
import { ClientTabs } from "./ClientTabs";
import { ArtisanTabs } from "./ArtisanTabs";

// Auth
import { AuthScreen } from "../screens/auth/AuthScreen";

// Client detail screens
import { ArtisanProfileScreen } from "../screens/client/ArtisanProfileScreen";
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

// Shared screens
import { SupportScreen } from "../screens/shared/SupportScreen";
import { SettingsScreen } from "../screens/shared/SettingsScreen";
import { NotificationPrefsScreen } from "../screens/shared/NotificationPrefsScreen";

// Artisan detail screens
import { CreateQuoteScreen } from "../screens/artisan/CreateQuoteScreen";
import { CreateInvoiceScreen } from "../screens/artisan/CreateInvoiceScreen";
import { QuoteSignatureScreen } from "../screens/artisan/QuoteSignatureScreen";
import { RDVDetailScreen } from "../screens/artisan/RDVDetailScreen";
import { UrgentDetailScreen } from "../screens/artisan/UrgentDetailScreen";
import { ArtisanDocumentsScreen } from "../screens/artisan/DocumentsScreen";
import { ClientDirectoryScreen } from "../screens/artisan/ClientDirectoryScreen";
import { QRCodeScreen } from "../screens/artisan/QRCodeScreen";
import { AccountingScreen } from "../screens/artisan/AccountingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth */}
      <Stack.Screen name="Auth" component={AuthScreen} />

      {/* Tab navigators */}
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="ArtisanTabs" component={ArtisanTabs} />

      {/* Client detail screens */}
      <Stack.Screen name="ArtisanProfile" component={ArtisanProfileScreen} />
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
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="ContractDetail" component={ContractDetailScreen} />

      {/* Shared screens */}
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPrefsScreen} />

      {/* Artisan detail screens */}
      <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} />
      <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      <Stack.Screen name="QuoteSignature" component={QuoteSignatureScreen} />
      <Stack.Screen name="RDVDetail" component={RDVDetailScreen} />
      <Stack.Screen name="UrgentDetail" component={UrgentDetailScreen} />
      <Stack.Screen name="ArtisanDocuments" component={ArtisanDocumentsScreen} />
      <Stack.Screen name="ClientDirectory" component={ClientDirectoryScreen} />
      <Stack.Screen name="QRCodeProfile" component={QRCodeScreen} />
      <Stack.Screen name="Accounting" component={AccountingScreen} />
    </Stack.Navigator>
  );
}
