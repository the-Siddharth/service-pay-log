import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "web-design-basic",
    name: "Basic Website Design",
    description: "Professional website design with up to 5 pages",
    price: 25000,
    originalPrice: 35000,
    category: "Web Design",
    features: ["Responsive Design", "5 Pages", "Basic SEO", "Mobile Optimized", "Contact Form"]
  },
  {
    id: "web-design-premium",
    name: "Premium Website Design",
    description: "Advanced website with custom features and CMS",
    price: 50000,
    originalPrice: 70000,
    category: "Web Design",
    features: ["Custom Design", "10+ Pages", "CMS Integration", "Advanced SEO", "E-commerce Ready", "24/7 Support"]
  },
  {
    id: "web-design-enterprise",
    name: "Enterprise Website Solution",
    description: "Complete enterprise solution with custom development",
    price: 100000,
    originalPrice: 150000,
    category: "Web Design",
    features: ["Unlimited Pages", "Custom Development", "API Integration", "Advanced Analytics", "Priority Support", "1 Year Maintenance"]
  },
  {
    id: "app-development-basic",
    name: "Mobile App - Basic",
    description: "Simple mobile app for Android and iOS",
    price: 75000,
    originalPrice: 100000,
    category: "App Development",
    features: ["Cross Platform", "Basic Features", "App Store Submission", "3 Months Support"]
  },
  {
    id: "app-development-advanced",
    name: "Mobile App - Advanced",
    description: "Feature-rich mobile app with backend integration",
    price: 150000,
    originalPrice: 200000,
    category: "App Development",
    features: ["Custom Backend", "Payment Integration", "Push Notifications", "Admin Panel", "6 Months Support"]
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing Package",
    description: "Complete digital marketing solution for 3 months",
    price: 30000,
    originalPrice: 45000,
    category: "Marketing",
    features: ["Social Media Management", "Google Ads", "Content Creation", "SEO Optimization", "Analytics Reports"]
  },
  {
    id: "logo-branding",
    name: "Logo & Brand Identity",
    description: "Professional logo design and brand guidelines",
    price: 15000,
    originalPrice: 25000,
    category: "Design",
    features: ["Custom Logo", "Brand Guidelines", "Business Card Design", "Letterhead Design", "Social Media Kit"]
  },
  {
    id: "consultation",
    name: "Technical Consultation",
    description: "1-hour technical consultation session",
    price: 5000,
    category: "Consultation",
    features: ["Video Call", "Technical Advice", "Project Planning", "Technology Recommendations", "Follow-up Email"]
  }
];

export const categories = Array.from(new Set(services.map(service => service.category)));