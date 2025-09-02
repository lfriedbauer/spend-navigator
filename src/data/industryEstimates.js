export const INDUSTRY_ESTIMATES = {
  manufacturing: {
    label: "Manufacturing",
    indirectSpendRate: 0.125, // 12.5%
    indirectSpendRange: "10-15%",
    tailSpendAreas: [
      "MRO supplies under $10K",
      "Small parts and consumables", 
      "Spot freight",
      "Packaging materials",
      "Safety equipment"
    ]
  },
  healthcare: {
    label: "Healthcare", 
    indirectSpendRate: 0.225, // 22.5%
    indirectSpendRange: "20-25%",
    tailSpendAreas: [
      "Medical supplies under $10K",
      "Administrative services",
      "Non-clinical equipment", 
      "Office supplies",
      "Small IT purchases"
    ]
  },
  technology: {
    label: "Technology",
    indirectSpendRate: 0.20, // 20%
    indirectSpendRange: "15-25%", 
    tailSpendAreas: [
      "SaaS subscriptions under $10K",
      "Contractor services",
      "Cloud overages",
      "Marketing tools", 
      "Office equipment"
    ]
  },
  financialServices: {
    label: "Financial Services",
    indirectSpendRate: 0.30, // 30%
    indirectSpendRange: "25-35%",
    tailSpendAreas: [
      "Professional services under $10K", 
      "Compliance tools",
      "Office supplies",
      "Marketing services",
      "IT peripherals"
    ]
  },
  retail: {
    label: "Retail",
    indirectSpendRate: 0.15, // 15%
    indirectSpendRange: "10-20%",
    tailSpendAreas: [
      "Store supplies",
      "Spot logistics", 
      "Marketing materials",
      "Maintenance supplies",
      "Seasonal items"
    ]
  },
  energy: {
    label: "Energy",
    indirectSpendRate: 0.18, // 18%
    indirectSpendRange: "15-22%",
    tailSpendAreas: [
      "Safety equipment",
      "Regulatory compliance tools",
      "Maintenance supplies",
      "IT systems", 
      "Environmental services"
    ]
  },
  construction: {
    label: "Construction",
    indirectSpendRate: 0.12, // 12%
    indirectSpendRange: "8-15%",
    tailSpendAreas: [
      "Equipment rental",
      "Safety supplies",
      "Small tools and materials",
      "Insurance services",
      "Subcontractor services"
    ]
  },
  nonprofit: {
    label: "Non-profit", 
    indirectSpendRate: 0.22, // 22%
    indirectSpendRange: "18-25%",
    tailSpendAreas: [
      "Program supplies",
      "Fundraising materials", 
      "IT services",
      "Facility costs",
      "Professional development"
    ]
  },
  education: {
    label: "Education",
    indirectSpendRate: 0.20, // 20%
    indirectSpendRange: "15-25%",
    tailSpendAreas: [
      "Teaching supplies",
      "Technology equipment",
      "Facility maintenance",
      "Food services",
      "Transportation services"
    ]
  }
};

export const INDUSTRY_OPTIONS = Object.entries(INDUSTRY_ESTIMATES).map(([key, value]) => ({
  key,
  label: value.label
}));