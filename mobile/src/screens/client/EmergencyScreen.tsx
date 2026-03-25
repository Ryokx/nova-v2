import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Fonts, Radii, Shadows, Spacing } from "../../constants/theme";
import { Avatar, Badge, Card, ConfirmModal } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import type { RootStackScreenProps } from "../../navigation/types";

/* ---- mock data ---- */
const urgCategories = [
  { id: "plumber", label: "Plomberie", icon: "wrench" },
  { id: "electrician", label: "Électricité", icon: "lightning-bolt" },
  { id: "locksmith", label: "Serrurerie", icon: "key" },
  { id: "heating", label: "Chauffage", icon: "fire" },
  { id: "other", label: "Autre", icon: "+" },
];

const urgentArtisans = [
  {
    id: "3",
    name: "Karim B.",
    job: "Serrurier",
    cat: "locksmith",
    initials: "KB",
    rating: 5.0,
    reviews: 83,
    price: 80,
    responseTime: "15 min",
    distance: "1,2 km",
    missions: 83,
  },
  {
    id: "1",
    name: "Jean-Michel P.",
    job: "Plombier",
    cat: "plumber",
    initials: "JM",
    rating: 4.9,
    reviews: 127,
    price: 85,
    responseTime: "25 min",
    distance: "2,4 km",
    missions: 127,
  },
  {
    id: "14",
    name: "Christophe D.",
    job: "Chauffagiste",
    cat: "heating",
    initials: "CD",
    rating: 4.9,
    reviews: 89,
    price: 90,
    responseTime: "30 min",
    distance: "3,1 km",
    missions: 89,
  },
];

/* ---- helpers ---- */
const Stars = ({ rating, size = 13 }: { rating: number; size?: number }) => (
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

export function EmergencyScreen({
  navigation,
}: RootStackScreenProps<"Emergency">) {
  const [urgCat, setUrgCat] = useState<string | null>(null);
  const [confirmedArtisan, setConfirmedArtisan] = useState<string | null>(null);
  const [urgCancelled, setUrgCancelled] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: "info" as const, title: "", message: "", actions: [] as any[] });

  const handleUrgentBook = (artisanName: string) => {
    setConfirmedArtisan(artisanName);
  };

  const handleUrgentCancel = () => {
    setModal({
      visible: true,
      type: "danger",
      title: "Annuler la demande urgente",
      message: "Êtes-vous sûr de vouloir annuler l'intervention urgente ?\n\nLes frais de déplacement urgence de 50,00€ restent à votre charge. Le reste vous sera remboursé sous 3 à 5 jours.",
      actions: [
        { label: "Non, garder", variant: "outline", onPress: () => setModal(m => ({ ...m, visible: false })) },
        {
          label: "Confirmer",
          variant: "danger",
          onPress: () => {
            setUrgCancelled(true);
            setModal({
              visible: true,
              type: "info",
              title: "Demande annulée",
              message: "L'intervention urgente a été annulée. Les frais de déplacement urgence de 50,00€ ont été prélevés.",
              actions: [{ label: "OK", onPress: () => setModal(m => ({ ...m, visible: false })) }],
            });
          },
        },
      ],
    });
  };

  const filtered =
    urgCat && urgCat !== "all"
      ? urgentArtisans.filter((a) => a.cat === urgCat)
      : urgentArtisans;

  /* -------- Step 1: Category selection -------- */
  if (!urgCat) {
    return (
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>{"‹"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Urgence 24h/24</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Red gradient banner */}
          <View style={styles.redBanner}>
            <Text style={styles.redBannerEmoji}><MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.red} /></Text>
            <Text style={styles.redBannerTitle}>
              Besoin d'une intervention urgente ?
            </Text>
            <Text style={styles.redBannerSub}>
              Sélectionnez le domaine concerné
            </Text>
          </View>

          {/* Category cards */}
          <View style={styles.content}>
            {urgCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                activeOpacity={0.85}
                onPress={() =>
                  setUrgCat(cat.id === "other" ? "all" : cat.id)
                }
              >
                <View style={styles.catIconWrap}>
                  <MaterialCommunityIcons name={cat.icon as any} size={22} color={Colors.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={styles.catSub}>
                    {cat.id === "other"
                      ? "Tous les artisans d'urgence"
                      : `Artisans ${cat.label.toLowerCase()} disponibles`}
                  </Text>
                </View>
                <Text style={styles.chevron}>{"›"}</Text>
              </TouchableOpacity>
            ))}

            {/* Info notice */}
            <View style={styles.infoNotice}>
              <Text style={styles.infoIcon}><MaterialCommunityIcons name="clock-alert" size={16} color={Colors.red} /></Text>
              <Text style={styles.infoText}>
                Temps de réponse moyen : 20 minutes. Intervention sous 2h
                garantie.
              </Text>
            </View>
          </View>
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

  /* -------- Step 2: Available artisans -------- */
  const catLabel =
    urgCat === "all"
      ? "Tous les domaines"
      : urgCategories.find((c) => c.id === urgCat)?.label || "Urgence";

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setUrgCat(null)}
        >
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Urgence — {catLabel}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Express banner */}
        <View style={styles.expressBanner}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.white} />
          <View>
            <Text style={styles.expressBannerTitle}>Intervention express</Text>
            <Text style={styles.expressBannerSub}>
              Ces artisans peuvent intervenir dans l'heure
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.countLabel}>
            {filtered.length} artisan{filtered.length > 1 ? "s" : ""}{" "}
            disponible{filtered.length > 1 ? "s" : ""} maintenant
          </Text>

          {filtered.map((a) => (
            <View key={a.id} style={styles.artisanCard}>
              {/* Artisan info row */}
              <TouchableOpacity
                style={styles.artisanTop}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("ArtisanProfile", { id: a.id })
                }
              >
                <View style={styles.avatarWrap}>
                  <Avatar name={a.name} size={50} radius={18} uri={getAvatarUri(a.name)} />
                  <View style={styles.onlineDot} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.artisanNameRow}>
                    <Text style={styles.artisanName}>{a.name}</Text>
                    <Badge
                      label="Certifie Nova"
                      variant="certified"
                      size="sm"
                    />
                  </View>
                  <Text style={styles.artisanJob}>{a.job}</Text>
                  <View style={styles.metaRow}>
                    <Stars rating={Math.round(a.rating)} size={13} />
                    <Text style={styles.ratingValue}>{a.rating}</Text>
                    <Text style={styles.dot}>{"•"}</Text>
                    <Text style={styles.metaText}>{a.reviews} avis</Text>
                    <Text style={styles.dot}>{"•"}</Text>
                    <Text style={styles.metaText}>{a.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Response time */}
              <View style={styles.urgencyBar}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <MaterialCommunityIcons name="clock-alert" size={13} color={Colors.red} />
                  <Text style={styles.urgencyTime}>
                    Dispo en ~{a.responseTime}
                  </Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.redBtn}
                  activeOpacity={0.85}
                  onPress={() => handleUrgentBook(a.name)}
                  disabled={!!confirmedArtisan}
                >
                  <Text style={styles.redBtnText}>
                    {confirmedArtisan === a.name ? "✓ Demande envoyée" : "Intervention immédiate"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.outlineBtn}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("ArtisanProfile", { id: a.id })
                  }
                >
                  <Text style={styles.outlineBtnText}>Voir profil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Confirmed state with cancel option */}
          {confirmedArtisan && !urgCancelled && (
            <View style={styles.confirmedCard}>
              <View style={styles.confirmedHeader}>
                <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
                <Text style={styles.confirmedTitle}>Demande envoyée</Text>
              </View>
              <Text style={styles.confirmedDesc}>
                {confirmedArtisan} a été contacté et se rend vers vous. Paiement sécurisé par séquestre Nova.
              </Text>
              <TouchableOpacity style={styles.urgCancelBtn} onPress={handleUrgentCancel} activeOpacity={0.7}>
                <MaterialCommunityIcons name="close-circle-outline" size={16} color={Colors.red} />
                <Text style={styles.urgCancelBtnText}>Annuler la demande</Text>
              </TouchableOpacity>
              <View style={styles.urgCancelInfo}>
                <MaterialCommunityIcons name="information-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.urgCancelInfoText}>
                  En cas d'annulation, les frais de déplacement urgence de 50,00€ restent à votre charge.
                </Text>
              </View>
            </View>
          )}

          {urgCancelled && (
            <View style={styles.cancelledCard}>
              <MaterialCommunityIcons name="close-circle" size={20} color={Colors.red} />
              <Text style={styles.cancelledTitle}>Demande annulée</Text>
              <Text style={styles.cancelledDesc}>
                Frais de déplacement urgence de 50,00€ prélevés. Aucune autre facturation.
              </Text>
            </View>
          )}

          {/* Trust footer */}
          <View style={styles.trustFooter}>
            <Text style={styles.trustIcon}><MaterialCommunityIcons name="shield-check" size={20} color={Colors.forest} /></Text>
            <Text style={styles.trustText}>
              Tarif urgence majoré. Paiement sécurisé par
              séquestre Nova — l'artisan ne sera payé qu'après
              validation par nos équipes.
            </Text>
          </View>
        </View>
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
  root: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 4,
    backgroundColor: Colors.bgPage,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 24,
    color: Colors.forest,
    fontWeight: "700",
  },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },
  content: {
    paddingHorizontal: 16,
  },

  /* Red banner */
  redBanner: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.red,
    alignItems: "center",
  },
  redBannerEmoji: { fontSize: 20, marginBottom: 4 },
  redBannerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
    marginBottom: 4,
    textAlign: "center",
  },
  redBannerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  /* Category cards */
  catCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  catIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(232,48,42,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  catIcon: { fontSize: 22 },
  catLabel: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  catSub: {
    fontSize: 12,
    color: Colors.textHint,
    marginTop: 2,
  },
  chevron: { fontSize: 20, color: "#B0B0BB" },

  /* Info notice */
  infoNotice: {
    backgroundColor: "rgba(232,48,42,0.04)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.08)",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoIcon: { fontSize: 16, color: Colors.red },
  infoText: { fontSize: 12, color: Colors.red, lineHeight: 18, flex: 1 },

  /* Express banner */
  expressBanner: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.red,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  expressBannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: Colors.white,
  },
  expressBannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
  countLabel: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 14,
  },

  /* Artisan card */
  artisanCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  artisanTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  avatarWrap: { position: "relative" },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  artisanNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  artisanName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  artisanJob: {
    fontSize: 13,
    color: Colors.textHint,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.navy,
  },
  dot: { fontSize: 11, color: Colors.textMuted },
  metaText: { fontSize: 11, color: Colors.textHint },

  /* Urgency bar */
  urgencyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(232,48,42,0.04)",
    borderWidth: 1,
    borderColor: "rgba(232,48,42,0.08)",
    marginBottom: 12,
  },
  urgencyTime: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: Colors.red,
  },
  priceText: {
    fontFamily: "DMMono_500Medium",
    fontSize: 15,
    color: Colors.navy,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.textHint,
    fontFamily: "DMMono_500Medium",
  },

  /* Action buttons */
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  redBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  redBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  outlineBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    color: Colors.forest,
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },

  /* Confirmed + cancel */
  confirmedCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: "rgba(34,200,138,0.2)",
  },
  confirmedHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  confirmedTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.success },
  confirmedDesc: { fontFamily: "DMSans_400Regular", fontSize: 13, color: "#4A5568", lineHeight: 20, marginBottom: 12 },
  urgCancelBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10,
  },
  urgCancelBtnText: { fontFamily: "DMSans_600SemiBold", fontSize: 13, color: Colors.red },
  urgCancelInfo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(138,149,163,0.06)", borderRadius: 10, padding: 10, marginTop: 4,
  },
  urgCancelInfoText: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted, flex: 1 },

  cancelledCard: {
    backgroundColor: "rgba(232,48,42,0.04)", borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: "rgba(232,48,42,0.1)",
    alignItems: "center",
  },
  cancelledTitle: { fontFamily: "Manrope_700Bold", fontSize: 15, color: Colors.red, marginTop: 6, marginBottom: 4 },
  cancelledDesc: { fontFamily: "DMSans_400Regular", fontSize: 12, color: "#4A5568", textAlign: "center" },

  /* Trust footer */
  trustFooter: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  trustIcon: { fontSize: 18 },
  trustText: {
    fontSize: 12,
    color: "#14523B",
    lineHeight: 18,
    flex: 1,
  },
});
