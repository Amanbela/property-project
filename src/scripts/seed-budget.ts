import { connectForWrites } from "@/infrastructure/db/connection";
import { BudgetRangeModel } from "@/features/budget/models/BudgetRange";

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
    isActive: true,
    sortOrder: 6,
  },
];

async function run() {
  await connectForWrites();

  let count = 0;
  for (const range of budgetRanges) {
    await BudgetRangeModel.findOneAndUpdate(
      { slug: range.slug },
      { $setOnInsert: range },
      { upsert: true }
    );
    count++;
  }

  console.log(`Seeded ${count} budget ranges (skipped existing slugs).`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
