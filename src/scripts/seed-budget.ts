import mongoose from "mongoose";
import dotenv from "dotenv";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";

// Load .env.local so process.env.MONGODB_URI is available
dotenv.config({ path: ".env.local" });

const budgetRanges = [
  {
    slug: "under-30-lakh",
    label: "Under ₹30 Lakh",
    minPrice: 0,
    maxPrice: 3000000,
    description: "Explore affordable housing options in Indore under ₹30 Lakh. Find budget-friendly flats, plots, and villas in developing localities with good future growth potential.",
    heroHeading: "Best Areas in Indore Under ₹30 Lakh",
    metaTitle: "Best Areas in Indore Under ₹30 Lakh – Affordable Properties 2026",
    metaDescription: "Discover budget-friendly areas in Indore under ₹30 Lakh. View top localities, property prices, investment scores, and expert recommendations for affordable housing.",
    whyThisBudget: "This budget range is ideal for first-time homebuyers and small investors looking for affordable entry points in Indore's real estate market. You can find 1-2 BHK flats and small plots in developing corridors with strong growth potential.",
    tipForBuyers: "Focus on areas with upcoming metro connectivity and new infrastructure projects for maximum appreciation.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 1,
  },
  {
    slug: "30-to-50-lakh",
    label: "₹30 Lakh – ₹50 Lakh",
    minPrice: 3000000,
    maxPrice: 5000000,
    description: "Find quality residential properties in Indore between ₹30L and ₹50L. Well-connected areas with good social infrastructure and rental demand.",
    heroHeading: "Best Areas in Indore Between ₹30L–₹50L",
    metaTitle: "Best Areas in Indore Between ₹30–50 Lakh – Mid-Range Properties 2026",
    metaDescription: "Explore mid-range areas in Indore between ₹30–50 Lakh. Compare investment scores, family scores, and find the best locality for your budget.",
    whyThisBudget: "This is one of the most active segments in Indore's property market. You can find 2-3 BHK flats and medium-sized plots in well-established neighborhoods with good schools, hospitals, and connectivity.",
    tipForBuyers: "Look for areas near IT parks and educational hubs — they offer excellent rental yields and resale value.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 2,
  },
  {
    slug: "50-to-80-lakh",
    label: "₹50 Lakh – ₹80 Lakh",
    minPrice: 5000000,
    maxPrice: 8000000,
    description: "Premium residential options in Indore between ₹50L and ₹80L. Well-developed areas with excellent connectivity and lifestyle amenities.",
    heroHeading: "Best Areas in Indore Between ₹50L–₹80L",
    metaTitle: "Best Areas in Indore Between ₹50–80 Lakh – Premium Properties 2026",
    metaDescription: "Discover premium areas in Indore between ₹50–80 Lakh. View investment scores, family ratings, and property prices in top localities.",
    whyThisBudget: "This budget opens doors to Indore's most sought-after residential corridors. You can find 3 BHK flats, independent floors, and premium plots in areas with top-rated schools, hospitals, and shopping districts.",
    tipForBuyers: "Prioritize areas with low traffic congestion and good metro connectivity for a better lifestyle experience.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 3,
  },
  {
    slug: "80-lakh-to-1-crore",
    label: "₹80 Lakh – ₹1 Crore",
    minPrice: 8000000,
    maxPrice: 10000000,
    description: "Discover high-value properties in Indore between ₹80L and ₹1 Cr. Prime locations with strong appreciation potential and premium amenities.",
    heroHeading: "Best Areas in Indore Between ₹80L–₹1 Cr",
    metaTitle: "Best Areas in Indore Between ₹80 Lakh–₹1 Crore – Prime Properties 2026",
    metaDescription: "Explore prime areas in Indore between ₹80 Lakh and ₹1 Crore. Compare top localities for investment, family living, and premium amenities.",
    whyThisBudget: "In this range, you can access Indore's most prestigious residential areas. Options include premium 3-4 BHK apartments, luxury villas, and large plots in the city's most desirable neighborhoods with world-class infrastructure.",
    tipForBuyers: "Consider areas close to the proposed metro routes and the Super Corridor — these offer the best long-term appreciation.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 4,
  },
  {
    slug: "1-to-1-5-crore",
    label: "₹1 Crore – ₹1.5 Crore",
    minPrice: 10000000,
    maxPrice: 15000000,
    description: "Explore luxury properties in Indore between ₹1 Cr and ₹1.5 Cr. Elite addresses with superior construction quality and exclusive amenities.",
    heroHeading: "Best Areas in Indore Between ₹1Cr–₹1.5 Cr",
    metaTitle: "Best Areas in Indore Between ₹1–1.5 Crore – Luxury Properties 2026",
    metaDescription: "Find luxury areas in Indore between ₹1–1.5 Crore. View elite neighborhoods, premium property options, and investment insights.",
    whyThisBudget: "This budget grants you entry into Indore's most exclusive neighborhoods. You can own luxury villas, premium builder floors, and high-end apartments in areas known for their greenery, low density, and premium social infrastructure.",
    tipForBuyers: "Insist on RERA-approved projects and check the builder's track record before investing in this segment.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 5,
  },
  {
    slug: "above-1-5-crore",
    label: "Above ₹1.5 Crore",
    minPrice: 15000000,
    maxPrice: 999999999,
    description: "Discover ultra-premium properties in Indore above ₹1.5 Cr. The city's most prestigious addresses with bespoke living experiences.",
    heroHeading: "Premium Areas in Indore Above ₹1.5 Crore",
    metaTitle: "Best Premium Areas in Indore Above ₹1.5 Crore – Luxury Real Estate 2026",
    metaDescription: "Explore ultra-luxury areas in Indore above ₹1.5 Crore. View elite neighborhoods, premium villas, and high-end investment opportunities.",
    whyThisBudget: "In this ultra-premium segment, you can acquire the finest properties Indore has to offer — luxury villas, penthouses, and large farm plots in the city's most coveted locations with unparalleled amenities and privacy.",
    tipForBuyers: "Work with a local real estate advisor who specializes in luxury properties to find off-market deals and get the best value.",
    recommendedAreas: [],
    isActive: true,
    sortOrder: 6,
  },
];

const MONGO_URI = process.env.MONGODB_URI;

async function connectForSeed() {
  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not set in .env.local");
  }
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
}

async function run() {
  console.log("[seed:budget] Starting budget range seeding...\n");

  // 1. Check MongoDB configuration
  if (!MONGO_URI) {
    console.error("[seed:budget] ✘ MONGODB_URI is not set in .env.local");
    console.error("[seed:budget]   Add MONGODB_URI to your .env.local file and try again.");
    process.exit(1);
  }
  console.log("[seed:budget] ✓ MONGODB_URI is configured");

  // 2. Connect to database
  try {
    await connectForSeed();
    console.log("[seed:budget] ✓ Database connected");
  } catch (err) {
    console.error("[seed:budget] ✘ Database connection failed:", (err as Error).message);
    process.exit(1);
  }

  // 3. Check existing records
  const existingDocs = await BudgetRangeModel.find({}).select("slug").lean();
  const existingSlugs = new Set(existingDocs.map((d) => d.slug));

  console.log(`[seed:budget]   Existing records found: ${existingSlugs.size}\n`);

  // 4. Process each budget range
  let inserted = 0;
  let skipped = 0;

  for (const range of budgetRanges) {
    if (existingSlugs.has(range.slug)) {
      console.log(`  ─ Skipped  "${range.label}" (slug "${range.slug}" already exists)`);
      skipped++;
      continue;
    }

    try {
      await BudgetRangeModel.create(range);
      console.log(`  ✓ Inserted "${range.label}" (slug: ${range.slug})`);
      inserted++;
    } catch (err) {
      console.error(`  ✘ Failed to insert "${range.label}":`, (err as Error).message);
    }
  }

  // 5. Summary
  console.log(`\n[seed:budget] ─────────────────────────────`);
  console.log(`[seed:budget]   Total records in seed:  ${budgetRanges.length}`);
  console.log(`[seed:budget]   Inserted:               ${inserted}`);
  console.log(`[seed:budget]   Skipped (already exist): ${skipped}`);
  console.log(`[seed:budget]   Failed:                 ${budgetRanges.length - inserted - skipped}`);
  console.log(`[seed:budget] ─────────────────────────────`);

  // 6. Verify final count
  const totalAfter = await BudgetRangeModel.countDocuments();
  console.log(`[seed:budget]   Total records in DB:    ${totalAfter}`);
  console.log(`[seed:budget] ─────────────────────────────`);

  // 7. Disconnect
  await mongoose.disconnect();
  console.log("\n[seed:budget] ✓ Database disconnected");
  console.log("[seed:budget] ✓ Seed complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error("\n[seed:budget] ✘ Unhandled error:", err);
  process.exit(1);
});
