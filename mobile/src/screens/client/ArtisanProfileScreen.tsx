import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card, EscrowStepper } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock data ---- */
const reviews = [
  {
    name: "Caroline L.",
    rating: 5,
    text: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
    date: "Il y a 3 jours",
  },
  {
    name: "Pierre M.",
    rating: 5,
    text: "Intervention rapide et soignée. Le séquestre Nova m'a rassuré.",
    date: "Il y a 1 semaine",
  },
];

/* ---- helpers ---- */
const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row", gap: 1 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Text
        key={i}
        style={{ fontSize: size, color: i <= rating ? Colors.gold : Colors.border }}
      >
        {"★"}
      </Text>
    ))}
  </View>
);

const initialMessages = [
  { id: "1", from: "artisan", text: "Bonjour ! Comment puis-je vous aider ?", time: "14:30" },
  { id: "2", from: "client", text: "Bonjour, j'ai une fuite sous l'évier de ma cuisine.", time: "14:31" },
  { id: "3", from: "artisan", text: "Je peux passer demain matin pour un diagnostic gratuit. Ça vous convient ?", time: "14:32" },
];

export function ArtisanProfileScreen({
  navigation,
}: RootStackScreenProps<"ArtisanProfile">) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState("");

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), from: "client", text: chatInput.trim(), time },
    ]);
    setChatInput("");
    // Simulate artisan auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), from: "artisan", text: "Bien reçu, je reviens vers vous rapidement.", time },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Hero ---------- */}
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"‹"}</Text>
          </TouchableOpacity>

          <View style={styles.avatarWrap}>
            <Avatar name="Jean-Michel" size={84} radius={26} />
          </View>
          <Text style={styles.heroName}>Jean-Michel Petit</Text>
          <Text style={styles.heroJob}>Plombier-Chauffagiste</Text>

          <View style={styles.ratingRow}>
            <Stars rating={5} size={15} />
            <Text style={styles.ratingValue}>4.9</Text>
            <Text style={styles.ratingMissions}>{"•"} 127 missions</Text>
          </View>
        </View>

        {/* ---------- Content card ---------- */}
        <View style={styles.contentCard}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            <Badge label="Certifie Nova" variant="certified" size="sm" />
            <Badge label="Decennale" variant="success" size="sm" />
            <Badge label="RGE" variant="warning" size="sm" />
          </View>

          {/* Conditions tarifs — Classique + Urgences */}
          <View style={styles.conditionsCard}>
            <View style={styles.conditionsHeader}>
              <MaterialCommunityIcons name="shield-lock" size={14} color={Colors.forest} />
              <Text style={styles.conditionsHeaderText}>Paiement sécurisé par séquestre Nova</Text>
            </View>

            {/* Two-column: Classique | Urgences */}
            <View style={styles.conditionsCols}>
              {/* Classique */}
              <View style={styles.conditionsCol}>
                <View style={[styles.conditionsColHeader, { backgroundColor: "rgba(27,107,78,0.08)" }]}>
                  <MaterialCommunityIcons name="wrench" size={13} color={Colors.forest} />
                  <Text style={[styles.conditionsColTitle, { color: Colors.forest }]}>Classique</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Déplacement</Text>
                  <Text style={[styles.conditionVal, { color: Colors.success }]}>Offert</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Devis</Text>
                  <Text style={[styles.conditionVal, { color: Colors.success }]}>Gratuit</Text>
                </View>
              </View>

              {/* Urgences */}
              <View style={styles.conditionsCol}>
                <View style={[styles.conditionsColHeader, { backgroundColor: "rgba(232,48,42,0.08)" }]}>
                  <MaterialCommunityIcons name="lightning-bolt" size={13} color={Colors.red} />
                  <Text style={[styles.conditionsColTitle, { color: Colors.red }]}>Urgences</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Déplacement</Text>
                  <Text style={[styles.conditionVal, { color: Colors.navy }]}>60€</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Devis</Text>
                  <Text style={[styles.conditionVal, { color: Colors.success }]}>Gratuit</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Escrow explainer */}
          <View style={styles.escrowBox}>
            <Text style={styles.escrowTitle}>
              <MaterialCommunityIcons name="information-outline" size={18} color={Colors.forest} /> Comment ça marche
            </Text>
            <EscrowStepper currentStep={0} />
          </View>

          {/* Reviews */}
          <Text style={styles.sectionTitle}>Avis clients</Text>
          {reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewLeft}>
                  <Avatar name={r.name} size={28} radius={10} />
                  <Text style={styles.reviewName}>{r.name}</Text>
                </View>
                <Stars rating={r.rating} size={11} />
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
          ))}

          {/* Annual maintenance CTA */}
          <TouchableOpacity style={styles.maintenanceCta} activeOpacity={0.8} onPress={() => navigation.navigate("MaintenanceContract")}>
            <View style={styles.maintenanceIcon}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.maintenanceTitle}>
                Contrat d'entretien annuel
              </Text>
              <Text style={styles.maintenanceDesc}>
                Chaudière, climatisation, VMC — entretien planifié
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: Colors.forest }}>{"›"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- Bottom action buttons ---------- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => setChatOpen(true)}
        >
          <MaterialCommunityIcons name="chat-outline" size={20} color={Colors.forest} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          activeOpacity={0.8}
          onPress={() => Linking.openURL("tel:+33612345678")}
        >
          <MaterialCommunityIcons name="phone-outline" size={20} color={Colors.forest} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Booking", { artisanId: "1" })}
        >
          <Text style={styles.primaryBtnText}>Prendre rendez-vous</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- Chat Modal ---------- */}
      <Modal visible={chatOpen} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.chatModal}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Chat header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.navy} />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Avatar name="Jean-Michel" size={32} radius={10} />
              <View>
                <Text style={styles.chatHeaderName}>Jean-Michel Petit</Text>
                <View style={styles.chatOnlineRow}>
                  <View style={styles.chatOnlineDot} />
                  <Text style={styles.chatOnlineText}>En ligne</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => { setChatOpen(false); Linking.openURL("tel:+33612345678"); }}>
              <MaterialCommunityIcons name="phone" size={20} color={Colors.forest} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            style={styles.chatMessages}
            contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
            renderItem={({ item: m }) => (
              <View
                style={[
                  styles.chatBubble,
                  m.from === "client" ? styles.chatBubbleClient : styles.chatBubbleArtisan,
                ]}
              >
                <Text
                  style={[
                    styles.chatBubbleText,
                    m.from === "client" ? styles.chatBubbleTextClient : styles.chatBubbleTextArtisan,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.chatTime,
                    m.from === "client" ? styles.chatTimeClient : styles.chatTimeArtisan,
                  ]}
                >
                  {m.time}
                </Text>
              </View>
            )}
          />

          {/* Chat input */}
          <View style={styles.chatInputBar}>
            <TextInput
              style={styles.chatInput}
              placeholder="Écrire un message..."
              placeholderTextColor={Colors.textHint}
              value={chatInput}
              onChangeText={setChatInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.chatSendBtn, !chatInput.trim() && { opacity: 0.4 }]}
              onPress={sendMessage}
              disabled={!chatInput.trim()}
            >
              <MaterialCommunityIcons name="send" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Hero */
  hero: {
    backgroundColor: Colors.surface,
    paddingTop: 54,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 54,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "600" },
  avatarWrap: { marginBottom: 12 },
  heroName: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 23,
    color: Colors.navy,
    marginBottom: 3,
  },
  heroJob: { fontSize: 13, color: Colors.textHint, marginBottom: 10 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: { fontSize: 14, fontWeight: "700", color: Colors.gold },
  ratingMissions: { fontSize: 12, color: Colors.textHint },

  /* Content card */
  contentCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...Shadows.sm,
  },

  /* Badges */
  badgesRow: { flexDirection: "row", gap: 6, marginBottom: 18, flexWrap: "wrap", justifyContent: "center" },

  /* Escrow box */
  /* Conditions */
  conditionsCard: {
    backgroundColor: Colors.bgPage,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  conditionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  conditionsHeaderText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: Colors.forest,
  },
  conditionsCols: {
    flexDirection: "row",
    gap: 8,
  },
  conditionsCol: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  conditionsColHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7,
  },
  conditionsColTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 11,
  },
  conditionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(10,22,40,0.04)",
  },
  conditionLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  conditionVal: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12,
  },

  escrowBox: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginBottom: 20,
  },
  escrowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#14523B",
    marginBottom: 6,
  },

  /* Pricing */
  pricingRow: {
    flexDirection: "row",
    backgroundColor: Colors.bgPage,
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  pricingCell: { flex: 1, alignItems: "center" },
  pricingCellBorder: { borderLeftWidth: 1, borderLeftColor: Colors.border },
  priceMono: {
    fontFamily: "DMMono_500Medium",
    fontSize: 22,
    fontWeight: "700",
    color: Colors.navy,
  },
  priceGreen: { fontSize: 15, fontWeight: "600", color: Colors.success },
  priceForest: { fontSize: 15, fontWeight: "600", color: Colors.forest },
  priceSub: { fontSize: 10, color: Colors.textHint, marginTop: 2 },

  /* Reviews */
  sectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: Colors.navy,
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: Colors.bgPage,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.03)",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reviewLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewName: { fontSize: 13, fontWeight: "600", color: Colors.navy },
  reviewText: {
    fontSize: 12.5,
    color: "#4A5568",
    lineHeight: 18,
  },
  reviewDate: { fontSize: 10, color: Colors.textMuted, marginTop: 5 },

  /* Maintenance CTA */
  maintenanceCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  maintenanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  maintenanceTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.navy,
    marginBottom: 2,
  },
  maintenanceDesc: { fontSize: 12, color: Colors.textSecondary },

  /* Bottom bar */
  bottomBar: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "rgba(10,22,40,0.04)",
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  primaryBtnText: { color: Colors.white, fontSize: 15, fontFamily: "Manrope_700Bold" },

  /* Chat modal */
  chatModal: { flex: 1, backgroundColor: Colors.bgPage },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatHeaderInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  chatHeaderName: { fontFamily: "DMSans_600SemiBold", fontSize: 15, color: Colors.navy },
  chatOnlineRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  chatOnlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  chatOnlineText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.success },
  chatMessages: { flex: 1 },
  chatBubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  chatBubbleClient: {
    backgroundColor: Colors.deepForest,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  chatBubbleArtisan: {
    backgroundColor: Colors.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatBubbleText: { fontSize: 14, lineHeight: 20 },
  chatBubbleTextClient: { color: Colors.white, fontFamily: "DMSans_400Regular" },
  chatBubbleTextArtisan: { color: Colors.navy, fontFamily: "DMSans_400Regular" },
  chatTime: { fontSize: 10, marginTop: 4 },
  chatTimeClient: { color: "rgba(255,255,255,0.5)", textAlign: "right" },
  chatTimeArtisan: { color: Colors.textMuted },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chatInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: Colors.bgPage,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.navy,
  },
  chatSendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
});
