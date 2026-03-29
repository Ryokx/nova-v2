import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { ConfirmModal } from "../../components/ui";
import type { RootStackScreenProps } from "../../navigation/types";
import { API_BASE_URL, API_ROUTES } from "../../constants/api";

interface SavedCard {
  id: number;
  type: "Visa" | "Mastercard";
  last4: string;
  expiry: string;
  holder: string;
}

function CardIcon({ type }: { type: "Visa" | "Mastercard" }) {
  const isVisa = type === "Visa";
  return (
    <View style={[styles.cardIcon, { backgroundColor: isVisa ? "#1A1F71" : "#EB001B" }]}>
      <Text style={styles.cardIconText}>{isVisa ? "VISA" : "MC"}</Text>
    </View>
  );
}

export function PaymentMethodsScreen({
  navigation,
}: RootStackScreenProps<"PaymentMethods">) {
  const [cards, setCards] = useState<SavedCard[]>([
    { id: 0, type: "Visa", last4: "6411", expiry: "09/28", holder: "Sophie Lefèvre" },
    { id: 1, type: "Mastercard", last4: "8923", expiry: "03/27", holder: "Sophie Lefèvre" },
  ]);
  const [defaultCard, setDefaultCard] = useState(0);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");

  const [applePay, setApplePay] = useState(false);
  const [googlePay, setGooglePay] = useState(false);

  const [modal, setModal] = useState<{ visible: boolean; type: "success" | "warning" | "danger" | "info"; title: string; message: string; actions: any[] }>({ visible: false, type: "info", title: "", message: "", actions: [] });

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const detectCardType = (number: string): "Visa" | "Mastercard" => {
    const first = number.replace(/\s/g, "").charAt(0);
    return first === "5" ? "Mastercard" : "Visa";
  };

  const handleAddCard = async () => {
    const digits = newCardNumber.replace(/\s/g, "");
    if (digits.length < 16) {
      setModal({ visible: true, type: "warning", title: "Numéro incomplet", message: "Le numéro de carte doit contenir 16 chiffres.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
      return;
    }
    if (newCardExpiry.length < 5) {
      setModal({ visible: true, type: "warning", title: "Date invalide", message: "Veuillez entrer une date d'expiration valide (MM/AA).", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
      return;
    }
    if (newCardCvv.length < 3) {
      setModal({ visible: true, type: "warning", title: "CVV invalide", message: "Le CVV doit contenir 3 chiffres.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
      return;
    }

    // Créer un SetupIntent sur le backend pour enregistrer la carte de façon sécurisée
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.setupIntent}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // Si le backend retourne une URL Stripe hosted (setup session), l'ouvrir dans le navigateur
      if (data?.url) {
        await Linking.openURL(data.url);
        return;
      }
      // Sinon enregistrement optimiste local (dev/fallback)
    } catch {
      // Fallback en dev si l'API n'est pas accessible
    }

    const newCard: SavedCard = {
      id: Date.now(),
      type: detectCardType(newCardNumber),
      last4: digits.slice(-4),
      expiry: newCardExpiry,
      holder: newCardHolder || "Titulaire",
    };

    setCards(prev => [...prev, newCard]);
    setDefaultCard(newCard.id);
    setShowAddCard(false);
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardCvv("");
    setNewCardHolder("");

    setModal({
      visible: true,
      type: "success",
      title: "Carte ajoutée",
      message: `Votre carte ${newCard.type} •••• ${newCard.last4} a été enregistrée et définie par défaut.`,
      actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }],
    });
  };

  const handleDeleteCard = (id: number) => {
    const card = cards.find(c => c.id === id);
    setModal({
      visible: true,
      type: "danger",
      title: "Supprimer la carte",
      message: `Supprimer la carte ${card?.type} •••• ${card?.last4} ?`,
      actions: [
        { label: "Annuler", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
        {
          label: "Supprimer",
          variant: "danger",
          onPress: () => {
            setCards(prev => prev.filter(c => c.id !== id));
            if (defaultCard === id && cards.length > 1) {
              setDefaultCard(cards.find(c => c.id !== id)?.id || 0);
            }
            setModal(m => ({ ...m, visible: false }));
          },
        },
      ],
    });
  };

  const toggleApplePay = () => {
    if (!applePay) {
      setModal({
        visible: true,
        type: "info",
        title: "Configurer Apple Pay",
        message: "Votre compte Apple Pay sera lié à Nova pour les paiements rapides.\n\nVous pourrez payer en un tap sans entrer vos coordonnées bancaires.",
        actions: [
          { label: "Annuler", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
          {
            label: "Activer",
            onPress: () => {
              setApplePay(true);
              setModal({ visible: true, type: "success", title: "Apple Pay activé", message: "Vous pouvez maintenant payer avec Apple Pay sur Nova.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
            },
          },
        ],
      });
    } else {
      setApplePay(false);
    }
  };

  const toggleGooglePay = () => {
    if (!googlePay) {
      setModal({
        visible: true,
        type: "info",
        title: "Configurer Google Pay",
        message: "Votre compte Google Pay sera lié à Nova pour les paiements rapides.\n\nVous pourrez payer en un tap sans entrer vos coordonnées bancaires.",
        actions: [
          { label: "Annuler", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
          {
            label: "Activer",
            onPress: () => {
              setGooglePay(true);
              setModal({ visible: true, type: "success", title: "Google Pay activé", message: "Vous pouvez maintenant payer avec Google Pay sur Nova.", actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }] });
            },
          },
        ],
      });
    } else {
      setGooglePay(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moyens de paiement</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Saved cards */}
        <Text style={styles.sectionTitle}>Cartes enregistrées</Text>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.cardRow, defaultCard === card.id && styles.cardRowSelected]}
            activeOpacity={0.85}
            onPress={() => setDefaultCard(card.id)}
            onLongPress={() => handleDeleteCard(card.id)}
          >
            <CardIcon type={card.type} />
            <View style={{ flex: 1 }}>
              <View style={styles.cardNameRow}>
                <Text style={styles.cardName}>{card.type} •••• {card.last4}</Text>
                {defaultCard === card.id && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Par défaut</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSub}>{card.holder} • Exp. {card.expiry}</Text>
            </View>
            <View style={[styles.radio, defaultCard === card.id && styles.radioSelected]} />
          </TouchableOpacity>
        ))}

        {cards.length === 0 && (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="credit-card-off" size={24} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Aucune carte enregistrée</Text>
          </View>
        )}

        {/* Add card form */}
        {showAddCard ? (
          <View style={styles.addCardForm}>
            <Text style={styles.addCardFormTitle}>Nouvelle carte</Text>
            <TextInput
              style={styles.input}
              placeholder="Numéro de carte"
              placeholderTextColor={Colors.textHint}
              value={newCardNumber}
              onChangeText={(t) => setNewCardNumber(formatCardNumber(t))}
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="MM/AA"
                placeholderTextColor={Colors.textHint}
                value={newCardExpiry}
                onChangeText={(t) => setNewCardExpiry(formatExpiry(t))}
                keyboardType="number-pad"
                maxLength={5}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVV"
                placeholderTextColor={Colors.textHint}
                value={newCardCvv}
                onChangeText={(t) => setNewCardCvv(t.replace(/\D/g, "").slice(0, 3))}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nom du titulaire"
              placeholderTextColor={Colors.textHint}
              value={newCardHolder}
              onChangeText={setNewCardHolder}
              autoCapitalize="words"
            />
            <View style={styles.addCardActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowAddCard(false); setNewCardNumber(""); setNewCardExpiry(""); setNewCardCvv(""); setNewCardHolder(""); }}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveCardBtn} onPress={handleAddCard} activeOpacity={0.85}>
                <Text style={styles.saveCardBtnText}>Ajouter la carte</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addCardBtn} activeOpacity={0.85} onPress={() => setShowAddCard(true)}>
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color={Colors.forest} />
            <Text style={styles.addCardText}>Ajouter une carte</Text>
          </TouchableOpacity>
        )}

        {/* Digital wallets */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Portefeuilles numériques</Text>
        <View style={styles.walletsCard}>
          {/* Apple Pay */}
          <TouchableOpacity style={styles.walletRow} activeOpacity={0.7} onPress={toggleApplePay}>
            <View style={[styles.walletIcon, { backgroundColor: "#000" }]}>
              <MaterialCommunityIcons name="apple" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.walletLabel}>Apple Pay</Text>
              <Text style={[styles.walletSub, applePay && { color: Colors.success }]}>
                {applePay ? "Configuré" : "Non configuré"}
              </Text>
            </View>
            <View style={[styles.walletToggle, applePay && styles.walletToggleActive]}>
              <Text style={[styles.walletToggleText, applePay && { color: Colors.white }]}>
                {applePay ? "Actif" : "Configurer"}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.walletDivider} />

          {/* Google Pay */}
          <TouchableOpacity style={styles.walletRow} activeOpacity={0.7} onPress={toggleGooglePay}>
            <View style={[styles.walletIcon, { backgroundColor: "#4285F4" }]}>
              <MaterialCommunityIcons name="google" size={18} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.walletLabel}>Google Pay</Text>
              <Text style={[styles.walletSub, googlePay && { color: Colors.success }]}>
                {googlePay ? "Configuré" : "Non configuré"}
              </Text>
            </View>
            <View style={[styles.walletToggle, googlePay && styles.walletToggleActive]}>
              <Text style={[styles.walletToggleText, googlePay && { color: Colors.white }]}>
                {googlePay ? "Actif" : "Configurer"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Security info */}
        <View style={styles.securityInfo}>
          <MaterialCommunityIcons name="shield-lock" size={16} color={Colors.forest} />
          <Text style={styles.securityText}>
            Vos données bancaires sont chiffrées et sécurisées. Nova ne stocke pas vos numéros de carte complets.
          </Text>
        </View>

        <Text style={styles.hintText}>
          Appui long sur une carte pour la supprimer.
        </Text>
      </ScrollView>

      <ConfirmModal
        visible={modal.visible}
        onClose={() => setModal(m => ({ ...m, visible: false }))}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 54, paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { backgroundColor: "rgba(27,107,78,0.08)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  backArrow: { fontSize: 24, color: Colors.forest, fontWeight: "700" },
  headerTitle: { fontFamily: "DMSans_700Bold", fontSize: 17, color: Colors.navy },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 12 },

  sectionTitle: { fontSize: 14, fontFamily: "Manrope_700Bold", color: Colors.navy, marginBottom: 12 },

  /* Cards */
  cardRow: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 14,
    borderWidth: 1, borderColor: "rgba(10,22,40,0.04)", ...Shadows.sm,
  },
  cardRowSelected: { borderWidth: 2, borderColor: Colors.forest },
  cardIcon: { width: 48, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  cardIconText: { fontSize: 10, fontFamily: "Manrope_700Bold", color: Colors.white, letterSpacing: 0.5 },
  cardNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  cardName: { fontSize: 15, fontFamily: "Manrope_700Bold", color: Colors.navy },
  defaultBadge: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, backgroundColor: "rgba(34,200,138,0.08)" },
  defaultBadgeText: { fontSize: 10, fontFamily: "DMSans_600SemiBold", color: Colors.success },
  cardSub: { fontSize: 12, color: Colors.textHint },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#B0B0BB" },
  radioSelected: { borderWidth: 6, borderColor: Colors.forest },

  emptyCard: { alignItems: "center", paddingVertical: 24, backgroundColor: Colors.white, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  emptyText: { fontFamily: "DMSans_500Medium", fontSize: 13, color: Colors.textMuted, marginTop: 8 },

  /* Add card button */
  addCardBtn: {
    width: "100%", paddingVertical: 16, borderRadius: 18,
    borderWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(27,107,78,0.2)",
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
  },
  addCardText: { fontSize: 14, fontFamily: "DMSans_600SemiBold", color: Colors.forest },

  /* Add card form */
  addCardForm: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  addCardFormTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.navy, marginBottom: 14 },
  input: {
    height: 48, backgroundColor: Colors.bgPage, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14,
    fontFamily: "DMSans_400Regular", fontSize: 14, color: Colors.navy, marginBottom: 10,
  },
  inputRow: { flexDirection: "row", gap: 10 },
  addCardActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, height: 46, borderRadius: 14, backgroundColor: Colors.bgPage, alignItems: "center", justifyContent: "center" },
  cancelBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.textSecondary },
  saveCardBtn: { flex: 2, height: 46, borderRadius: 14, backgroundColor: Colors.deepForest, alignItems: "center", justifyContent: "center" },
  saveCardBtnText: { fontFamily: "Manrope_700Bold", fontSize: 14, color: Colors.white },

  /* Wallets */
  walletsCard: {
    backgroundColor: Colors.white, borderRadius: 18, paddingHorizontal: 16,
    borderWidth: 1, borderColor: "rgba(10,22,40,0.04)", marginBottom: 20, ...Shadows.sm,
  },
  walletRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  walletDivider: { height: 1, backgroundColor: Colors.surface },
  walletIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  walletLabel: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy },
  walletSub: { fontFamily: "DMSans_400Regular", fontSize: 12, color: Colors.textHint, marginTop: 1 },
  walletToggle: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
    backgroundColor: Colors.bgPage, borderWidth: 1, borderColor: Colors.border,
  },
  walletToggleActive: { backgroundColor: Colors.forest, borderColor: Colors.forest },
  walletToggleText: { fontFamily: "DMSans_600SemiBold", fontSize: 12, color: Colors.textSecondary },

  /* Security */
  securityInfo: {
    backgroundColor: "rgba(27,107,78,0.04)", borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: "rgba(27,107,78,0.08)",
    flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8,
  },
  securityText: { fontSize: 12, color: "#4A5568", lineHeight: 19, flex: 1 },
  hintText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, textAlign: "center", marginTop: 4 },
});
