import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";

// -- Root Stack --
export type RootStackParamList = {
  Auth: undefined;
  ClientTabs: NavigatorScreenParams<ClientTabParamList>;
  ArtisanTabs: NavigatorScreenParams<ArtisanTabParamList>;

  // Client stack screens
  ArtisanProfile: { id: string };
  ArtisanListByCategory: { category: string };
  AllCategories: undefined;
  Booking: { artisanId: string };
  Payment: { missionId: string; amount: number };
  MissionDetail: { id: string };
  ReportDispute: { missionId: string };
  Tracking: { missionId: string };
  SignDevis: { devisId: string };
  DevisReceived: { devisId: string };
  VideoDialognostic: undefined;
  MaintenanceContract: undefined;
  ContractDetail: { contractId: string; name: string; icon: string; price: string; artisan: string; since: string; freq: string };
  Referral: undefined;
  Emergency: undefined;
  PaymentMethods: undefined;
  InsuranceSimulator: undefined;
  Support: undefined;
  Settings: undefined;
  NotificationPreferences: undefined;

  // Artisan stack screens
  CreateQuote: undefined;
  CreateInvoice: { missionId: string };
  QuoteSignature: { devisId: string };
  RDVDetail: { rdvId: string };
  UrgentDetail: { demandId: string };
  ArtisanDocuments: undefined;
  ClientDirectory: undefined;
  QRCodeProfile: undefined;
  Accounting: undefined;
  ArtisanPricing: undefined;
};

// -- Client Tabs --
export type ClientTabParamList = {
  ClientHome: undefined;
  ClientNotifications: undefined;
  ClientMissions: undefined;
  ClientProfile: undefined;
};

// -- Artisan Tabs --
export type ArtisanTabParamList = {
  ArtisanHome: undefined;
  ArtisanNotifications: undefined;
  ArtisanPayments: undefined;
  ArtisanProfile: undefined;
};

// Screen props helpers
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type ClientTabScreenProps<T extends keyof ClientTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<ClientTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ArtisanTabScreenProps<T extends keyof ArtisanTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<ArtisanTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;
