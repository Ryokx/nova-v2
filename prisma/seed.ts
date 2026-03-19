import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.referral.deleteMany(),
    prisma.maintenanceContract.deleteMany(),
    prisma.review.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.devis.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.mission.deleteMany(),
    prisma.document.deleteMany(),
    prisma.artisanProfile.deleteMany(),
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("Demo1234!", 12);

  // ━━━ CLIENTS ━━━
  const [sophie, pierre, amelie] = await Promise.all([
    prisma.user.create({
      data: {
        email: "sophie.client@demo.nova.fr",
        name: "Sophie Laurent",
        phone: "06 12 34 56 78",
        passwordHash,
        role: "CLIENT",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "pierre.martin@demo.nova.fr",
        name: "Pierre Martin",
        phone: "06 45 67 89 01",
        passwordHash,
        role: "CLIENT",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "amelie.renard@demo.nova.fr",
        name: "Amélie Renard",
        phone: "06 78 90 12 34",
        passwordHash,
        role: "CLIENT",
        emailVerified: new Date(),
      },
    }),
  ]);

  // ━━━ ADMIN ━━━
  await prisma.user.create({
    data: {
      email: "admin@nova.fr",
      name: "Admin Nova",
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // ━━━ ARTISANS ━━━
  const artisanData = [
    {
      email: "jm.plombier@demo.nova.fr",
      name: "Jean-Michel Petit",
      phone: "06 11 22 33 44",
      trade: "Plombier",
      description: "Plombier certifié avec 15 ans d'expérience. Spécialiste en réparation de fuites, installation sanitaire et dépannage urgent. Intervention rapide sur Paris et petite couronne.",
      hourlyRate: 65,
      city: "Paris",
      postalCode: "75004",
      responseTime: "<2h",
      rating: 4.9,
      reviewCount: 127,
      missionCount: 127,
      isVerified: true,
      siret: "123 456 789 00012",
      insuranceNumber: "DEC-2026-JMP-001",
      rgeNumber: "RGE-2026-001",
      certifications: ["Qualibat", "RGE"],
    },
    {
      email: "sophie.electricienne@demo.nova.fr",
      name: "Sophie Mercier",
      phone: "06 22 33 44 55",
      trade: "Électricienne",
      description: "Électricienne diplômée, spécialisée en mise aux normes NF C 15-100, installation de tableaux électriques et dépannage. Certifiée Consuel.",
      hourlyRate: 70,
      city: "Paris",
      postalCode: "75011",
      responseTime: "<1h",
      rating: 4.8,
      reviewCount: 94,
      missionCount: 94,
      isVerified: true,
      siret: "234 567 890 00023",
      insuranceNumber: "DEC-2026-SM-002",
      certifications: ["Consuel", "NF C 15-100"],
    },
    {
      email: "karim.serrurier@demo.nova.fr",
      name: "Karim Benali",
      phone: "06 33 44 55 66",
      trade: "Serrurier",
      description: "Serrurier agréé, ouverture de portes sans destruction, remplacement de serrures multipoints, blindage de portes. Disponible 7j/7.",
      hourlyRate: 60,
      city: "Paris",
      postalCode: "75009",
      responseTime: "<30min",
      rating: 5.0,
      reviewCount: 83,
      missionCount: 83,
      isVerified: true,
      siret: "345 678 901 00034",
      insuranceNumber: "DEC-2026-KB-003",
      certifications: ["A2P"],
    },
    {
      email: "marie.peintre@demo.nova.fr",
      name: "Marie Dubois",
      phone: "06 44 55 66 77",
      trade: "Peintre",
      description: "Peintre en bâtiment avec 10 ans d'expérience. Peinture intérieure et extérieure, ravalement, pose de papier peint, enduits décoratifs.",
      hourlyRate: 55,
      city: "Lyon",
      postalCode: "69006",
      responseTime: "<3h",
      rating: 4.7,
      reviewCount: 61,
      missionCount: 61,
      isVerified: true,
      siret: "456 789 012 00045",
      insuranceNumber: "DEC-2026-MD-004",
      certifications: [],
    },
    {
      email: "thomas.plombier@demo.nova.fr",
      name: "Thomas Rousseau",
      phone: "06 55 66 77 88",
      trade: "Plombier",
      description: "Plombier chauffagiste, spécialiste en installation de chauffe-eau, réparation de canalisations et entretien de chaudières.",
      hourlyRate: 60,
      city: "Paris",
      postalCode: "75015",
      responseTime: "<3h",
      rating: 4.7,
      reviewCount: 68,
      missionCount: 68,
      isVerified: true,
      siret: "567 890 123 00056",
      insuranceNumber: "DEC-2026-TR-005",
      certifications: ["RGE"],
    },
    {
      email: "fatima.plombier@demo.nova.fr",
      name: "Fatima Hassan",
      phone: "06 66 77 88 99",
      trade: "Plombier",
      description: "Plombière certifiée, spécialisée en débouchage de canalisations, installation sanitaire et détection de fuites.",
      hourlyRate: 70,
      city: "Bordeaux",
      postalCode: "33000",
      responseTime: "<1h",
      rating: 4.8,
      reviewCount: 91,
      missionCount: 91,
      isVerified: true,
      siret: "678 901 234 00067",
      insuranceNumber: "DEC-2026-FH-006",
      certifications: [],
    },
  ];

  const artisanUsers = await Promise.all(
    artisanData.map((a) =>
      prisma.user.create({
        data: {
          email: a.email,
          name: a.name,
          phone: a.phone,
          passwordHash,
          role: "ARTISAN",
          emailVerified: new Date(),
        },
      }),
    ),
  );

  const artisanProfiles = await Promise.all(
    artisanData.map((a, i) =>
      prisma.artisanProfile.create({
        data: {
          userId: artisanUsers[i]!.id,
          companyName: `${a.name.split(" ")[0]} ${a.trade}`,
          siret: a.siret,
          trade: a.trade,
          description: a.description,
          hourlyRate: a.hourlyRate,
          certifications: a.certifications,
          insuranceNumber: a.insuranceNumber,
          insuranceExpiry: new Date("2027-03-15"),
          rgeNumber: a.rgeNumber || null,
          city: a.city,
          postalCode: a.postalCode,
          responseTime: a.responseTime,
          rating: a.rating,
          reviewCount: a.reviewCount,
          missionCount: a.missionCount,
          isVerified: a.isVerified,
          isAvailable: true,
        },
      }),
    ),
  );

  // ━━━ DOCUMENTS ━━━
  for (const profile of artisanProfiles) {
    await prisma.document.createMany({
      data: [
        { artisanProfileId: profile.id, type: "SIRET", fileUrl: "/uploads/siret-placeholder.pdf", fileName: "extrait_siret.pdf", verified: true, verifiedAt: new Date() },
        { artisanProfileId: profile.id, type: "INSURANCE", fileUrl: "/uploads/decennale-placeholder.pdf", fileName: "attestation_decennale.pdf", verified: true, verifiedAt: new Date() },
        { artisanProfileId: profile.id, type: "IDENTITY", fileUrl: "/uploads/id-placeholder.pdf", fileName: "piece_identite.pdf", verified: true, verifiedAt: new Date() },
      ],
    });
  }

  // ━━━ MISSIONS ━━━
  const jmProfile = artisanProfiles[0]!;
  const sophieMProfile = artisanProfiles[1]!;
  const karimProfile = artisanProfiles[2]!;
  const thomasProfile = artisanProfiles[4]!;
  const fatimaProfile = artisanProfiles[5]!;

  const missions = await Promise.all([
    // Mission 1: Jean-Michel — Réparation fuite (COMPLETED)
    prisma.mission.create({
      data: {
        clientId: sophie.id,
        artisanId: jmProfile.id,
        type: "Réparation fuite",
        category: "Plomberie",
        description: "Réparation d'une fuite sous évier cuisine, remplacement du siphon et des joints.",
        status: "COMPLETED",
        address: "12 rue de Rivoli, 75004 Paris",
        scheduledDate: new Date("2026-03-15T14:00:00"),
        scheduledSlot: "14h00",
        amount: 320,
        completedAt: new Date("2026-03-15T16:30:00"),
      },
    }),
    // Mission 2: Sophie M. — Installation prise (COMPLETED)
    prisma.mission.create({
      data: {
        clientId: sophie.id,
        artisanId: sophieMProfile.id,
        type: "Installation prise électrique",
        category: "Électricité",
        description: "Installation d'une prise électrique dans la cuisine avec mise aux normes du circuit.",
        status: "COMPLETED",
        address: "12 rue de Rivoli, 75004 Paris",
        scheduledDate: new Date("2026-03-10T10:00:00"),
        scheduledSlot: "10h00",
        amount: 195,
        completedAt: new Date("2026-03-10T12:00:00"),
      },
    }),
    // Mission 3: Karim — Remplacement serrure (VALIDATED)
    prisma.mission.create({
      data: {
        clientId: pierre.id,
        artisanId: karimProfile.id,
        type: "Remplacement serrure",
        category: "Serrurerie",
        description: "Remplacement d'une serrure multipoints et installation d'un verrou de sécurité.",
        status: "VALIDATED",
        address: "8 avenue Montaigne, 75008 Paris",
        scheduledDate: new Date("2026-03-02T09:00:00"),
        scheduledSlot: "09h00",
        amount: 280,
        completedAt: new Date("2026-03-02T11:30:00"),
      },
    }),
    // Mission 4: Fatima — Débouchage (VALIDATED)
    prisma.mission.create({
      data: {
        clientId: amelie.id,
        artisanId: fatimaProfile.id,
        type: "Débouchage canalisation",
        category: "Plomberie",
        description: "Débouchage urgent d'une canalisation bouchée dans la salle de bain.",
        status: "VALIDATED",
        address: "25 cours de l'Intendance, 33000 Bordeaux",
        scheduledDate: new Date("2026-02-22T16:00:00"),
        scheduledSlot: "16h00",
        amount: 150,
        completedAt: new Date("2026-02-22T17:00:00"),
      },
    }),
    // Mission 5: Thomas — Fuite chauffe-eau (DISPUTED)
    prisma.mission.create({
      data: {
        clientId: pierre.id,
        artisanId: thomasProfile.id,
        type: "Fuite chauffe-eau",
        category: "Plomberie",
        description: "Intervention sur fuite au niveau du chauffe-eau, remplacement du groupe de sécurité.",
        status: "DISPUTED",
        address: "8 avenue Montaigne, 75008 Paris",
        scheduledDate: new Date("2026-02-18T11:00:00"),
        scheduledSlot: "11h00",
        amount: 450,
      },
    }),
  ]);

  // ━━━ DEVIS ━━━
  await Promise.all([
    prisma.devis.create({
      data: {
        missionId: missions[0]!.id,
        artisanId: jmProfile.id,
        clientId: sophie.id,
        number: "DEV-2026-078",
        items: [
          { label: "Remplacement siphon PVC", qty: 1, unitPrice: 45, total: 45 },
          { label: "Joints étanchéité (lot)", qty: 1, unitPrice: 15, total: 15 },
          { label: "Main d'œuvre (2h)", qty: 1, unitPrice: 130, total: 130 },
          { label: "Déplacement", qty: 1, unitPrice: 30, total: 30 },
        ],
        totalHT: 266.67,
        totalTTC: 320,
        tva: 53.33,
        status: "SIGNED",
        signedAt: new Date("2026-03-14"),
        validUntil: new Date("2026-04-14"),
      },
    }),
    prisma.devis.create({
      data: {
        missionId: missions[1]!.id,
        artisanId: sophieMProfile.id,
        clientId: sophie.id,
        number: "DEV-2026-065",
        items: [
          { label: "Prise électrique encastrée", qty: 1, unitPrice: 25, total: 25 },
          { label: "Câblage et raccordement", qty: 1, unitPrice: 45, total: 45 },
          { label: "Main d'œuvre (1h30)", qty: 1, unitPrice: 92.5, total: 92.5 },
        ],
        totalHT: 162.5,
        totalTTC: 195,
        tva: 32.5,
        status: "SIGNED",
        signedAt: new Date("2026-03-09"),
        validUntil: new Date("2026-04-09"),
      },
    }),
    prisma.devis.create({
      data: {
        missionId: missions[2]!.id,
        artisanId: karimProfile.id,
        clientId: pierre.id,
        number: "DEV-2026-055",
        items: [
          { label: "Serrure multipoints A2P", qty: 1, unitPrice: 120, total: 120 },
          { label: "Verrou de sécurité", qty: 1, unitPrice: 35, total: 35 },
          { label: "Main d'œuvre (2h30)", qty: 1, unitPrice: 78.33, total: 78.33 },
        ],
        totalHT: 233.33,
        totalTTC: 280,
        tva: 46.67,
        status: "SIGNED",
        signedAt: new Date("2026-02-28"),
        validUntil: new Date("2026-03-28"),
      },
    }),
  ]);

  // ━━━ PAYMENTS ━━━
  await Promise.all([
    prisma.payment.create({
      data: {
        missionId: missions[0]!.id,
        amount: 320,
        status: "RELEASED",
        escrowedAt: new Date("2026-03-14"),
        releasedAt: new Date("2026-03-16"),
        commissionAmount: 16,
        commissionRate: 0.05,
      },
    }),
    prisma.payment.create({
      data: {
        missionId: missions[1]!.id,
        amount: 195,
        status: "RELEASED",
        escrowedAt: new Date("2026-03-09"),
        releasedAt: new Date("2026-03-11"),
        commissionAmount: 9.75,
        commissionRate: 0.05,
      },
    }),
    prisma.payment.create({
      data: {
        missionId: missions[2]!.id,
        amount: 280,
        status: "RELEASED",
        escrowedAt: new Date("2026-02-28"),
        releasedAt: new Date("2026-03-03"),
        commissionAmount: 14,
        commissionRate: 0.05,
      },
    }),
    prisma.payment.create({
      data: {
        missionId: missions[3]!.id,
        amount: 150,
        status: "RELEASED",
        escrowedAt: new Date("2026-02-21"),
        releasedAt: new Date("2026-02-23"),
        commissionAmount: 7.5,
        commissionRate: 0.05,
      },
    }),
    prisma.payment.create({
      data: {
        missionId: missions[4]!.id,
        amount: 450,
        status: "ESCROWED",
        escrowedAt: new Date("2026-02-17"),
        commissionAmount: 22.5,
        commissionRate: 0.05,
      },
    }),
  ]);

  // ━━━ INVOICES ━━━
  await Promise.all([
    prisma.invoice.create({
      data: {
        missionId: missions[0]!.id,
        artisanId: jmProfile.id,
        number: "FAC-2026-125",
        items: [
          { label: "Remplacement siphon PVC", qty: 1, unitPrice: 45, total: 45 },
          { label: "Joints étanchéité (lot)", qty: 1, unitPrice: 15, total: 15 },
          { label: "Main d'œuvre (2h)", qty: 1, unitPrice: 130, total: 130 },
          { label: "Déplacement", qty: 1, unitPrice: 30, total: 30 },
        ],
        totalHT: 266.67,
        totalTTC: 320,
        tva: 53.33,
        paidAt: new Date("2026-03-16"),
      },
    }),
    prisma.invoice.create({
      data: {
        missionId: missions[1]!.id,
        artisanId: sophieMProfile.id,
        number: "FAC-2026-118",
        items: [
          { label: "Prise électrique encastrée", qty: 1, unitPrice: 25, total: 25 },
          { label: "Câblage et raccordement", qty: 1, unitPrice: 45, total: 45 },
          { label: "Main d'œuvre (1h30)", qty: 1, unitPrice: 92.5, total: 92.5 },
        ],
        totalHT: 162.5,
        totalTTC: 195,
        tva: 32.5,
        paidAt: new Date("2026-03-11"),
      },
    }),
    prisma.invoice.create({
      data: {
        missionId: missions[3]!.id,
        artisanId: fatimaProfile.id,
        number: "FAC-2026-127",
        items: [
          { label: "Débouchage canalisation", qty: 1, unitPrice: 95, total: 95 },
          { label: "Produit de traitement", qty: 1, unitPrice: 30, total: 30 },
        ],
        totalHT: 125,
        totalTTC: 150,
        tva: 25,
        paidAt: new Date("2026-02-23"),
      },
    }),
  ]);

  // ━━━ REVIEWS ━━━
  await Promise.all([
    prisma.review.create({
      data: {
        missionId: missions[0]!.id,
        userId: sophie.id,
        artisanProfileId: jmProfile.id,
        rating: 5,
        comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
      },
    }),
    prisma.review.create({
      data: {
        missionId: missions[1]!.id,
        userId: sophie.id,
        artisanProfileId: sophieMProfile.id,
        rating: 5,
        comment: "Intervention rapide et soignée. Le séquestre Nova m'a rassuré.",
      },
    }),
    prisma.review.create({
      data: {
        missionId: missions[2]!.id,
        userId: pierre.id,
        artisanProfileId: karimProfile.id,
        rating: 5,
        comment: "Karim est arrivé en moins de 30 minutes. Travail impeccable, serrure changée rapidement. Très rassurant.",
      },
    }),
    prisma.review.create({
      data: {
        missionId: missions[3]!.id,
        userId: amelie.id,
        artisanProfileId: fatimaProfile.id,
        rating: 4,
        comment: "Bon travail dans l'ensemble. Quelques finitions à revoir mais honnête et fiable.",
      },
    }),
  ]);

  // ━━━ NOTIFICATIONS ━━━
  const now = new Date();
  await prisma.notification.createMany({
    data: [
      // Client notifications (Sophie)
      {
        userId: sophie.id,
        type: "DEVIS_RECEIVED",
        title: "Nouveau devis reçu",
        body: "Jean-Michel P. vous a envoyé un devis pour \"Remplacement robinet\" — 236,50€ TTC",
        read: false,
        data: { missionId: missions[0]!.id, amount: 236.5 },
        createdAt: new Date(now.getTime() - 12 * 60 * 1000),
      },
      {
        userId: sophie.id,
        type: "MISSION_CONFIRMED",
        title: "Mission confirmée",
        body: "Votre rendez-vous avec Sophie M. est confirmé pour demain à 14h00",
        read: false,
        data: { missionId: missions[1]!.id },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: sophie.id,
        type: "PAYMENT_RELEASED",
        title: "Paiement validé par Nova",
        body: "Le paiement de 450,00€ pour la mission avec Amélie R. a été libéré",
        read: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: sophie.id,
        type: "WELCOME",
        title: "Bienvenue sur Nova",
        body: "Votre compte est vérifié. Vous pouvez maintenant chercher des artisans certifiés.",
        read: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
      // Artisan notifications (Jean-Michel)
      {
        userId: artisanUsers[0]!.id,
        type: "URGENT_REQUEST",
        title: "Nouvelle demande urgente",
        body: "Fuite d'eau urgente — Secteur Paris 9e — Intervention estimée 1h",
        read: false,
        data: { category: "Plomberie", sector: "Paris 9e" },
        createdAt: new Date(now.getTime() - 4 * 60 * 1000),
      },
      {
        userId: artisanUsers[0]!.id,
        type: "DEVIS_ACCEPTED",
        title: "Devis accepté",
        body: "Pierre M. a accepté votre devis #DEV-2026-089 — 236,50€ — Paiement bloqué en séquestre",
        read: false,
        data: { devisNumber: "DEV-2026-089", amount: 236.5 },
        createdAt: new Date(now.getTime() - 60 * 60 * 1000),
      },
      {
        userId: artisanUsers[0]!.id,
        type: "PAYMENT_RELEASED",
        title: "Paiement libéré",
        body: "Nova a validé la mission pour Amélie R. — 450,00€ seront virés sous 48h",
        read: false,
        data: { amount: 450 },
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
      {
        userId: artisanUsers[0]!.id,
        type: "APPOINTMENT_CONFIRMED",
        title: "Nouveau rendez-vous confirmé",
        body: "Luc D. — Diagnostic fuite, 18 mars à 11h, 5 rue de Charonne, Paris 11e",
        read: true,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: artisanUsers[0]!.id,
        type: "CERTIFICATION_RENEWED",
        title: "Certification renouvelée",
        body: "Votre certification Nova a été renouvelée jusqu'au 15 mars 2027",
        read: true,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ━━━ MESSAGES ━━━
  await prisma.message.createMany({
    data: [
      {
        missionId: missions[0]!.id,
        senderId: sophie.id,
        content: "Bonjour, j'ai une fuite sous l'évier de la cuisine. Est-ce que vous pourriez intervenir rapidement ?",
        createdAt: new Date("2026-03-14T09:00:00"),
      },
      {
        missionId: missions[0]!.id,
        senderId: artisanUsers[0]!.id,
        content: "Bonjour Sophie ! Bien sûr, je peux passer demain à 14h. Est-ce que cela vous convient ?",
        createdAt: new Date("2026-03-14T09:15:00"),
      },
      {
        missionId: missions[0]!.id,
        senderId: sophie.id,
        content: "Parfait, 14h c'est très bien. Merci !",
        createdAt: new Date("2026-03-14T09:20:00"),
      },
      {
        missionId: missions[0]!.id,
        senderId: artisanUsers[0]!.id,
        content: "Je vous envoie le devis tout de suite. L'intervention devrait durer environ 2h.",
        createdAt: new Date("2026-03-14T09:25:00"),
      },
    ],
  });

  // ━━━ MAINTENANCE CONTRACT ━━━
  await prisma.maintenanceContract.create({
    data: {
      clientId: sophie.id,
      artisanId: jmProfile.id,
      type: "BOILER",
      price: 149,
      frequency: "annual",
      status: "ACTIVE",
      nextVisitDate: new Date("2026-10-15"),
      startDate: new Date("2026-03-15"),
      endDate: new Date("2027-03-15"),
    },
  });

  // ━━━ REFERRAL ━━━
  await prisma.referral.create({
    data: {
      referrerId: sophie.id,
      referredId: amelie.id,
      code: "SOPHIE20",
      status: "COMPLETED",
      rewardAmount: 20,
      completedAt: new Date("2026-02-20"),
    },
  });
  await prisma.referral.create({
    data: {
      referrerId: sophie.id,
      code: "NOVA-SL-2026",
      status: "PENDING",
      rewardAmount: 20,
    },
  });

  console.log("✅ Seed completed!");
  console.log("   - 3 clients + 1 admin + 6 artisans");
  console.log("   - 5 missions (COMPLETED, VALIDATED, DISPUTED)");
  console.log("   - 3 devis, 5 payments, 3 invoices");
  console.log("   - 4 reviews, 9 notifications, 4 messages");
  console.log("   - 1 maintenance contract, 2 referrals");
  console.log("   - 18 documents (3 per artisan)");
  console.log("");
  console.log("   Demo login: sophie.client@demo.nova.fr / Demo1234!");
  console.log("   Demo login: jm.plombier@demo.nova.fr / Demo1234!");
  console.log("   Admin login: admin@nova.fr / Demo1234!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
