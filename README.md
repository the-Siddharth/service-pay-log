# Joseph Store - Professional Digital Services Platform

A responsive web application for service marketplace with secure payments, order management, and admin dashboard.

## 🚀 Features

### Frontend (React + TypeScript)
- **Service Selection**: Browse and filter professional services
- **Guest Checkout**: No registration required
- **Coupon System**: Apply discount codes
- **Responsive Design**: Mobile and desktop optimized
- **Real-time UI**: Instant feedback and smooth animations

### Payment Integration
- **Razorpay**: Secure payment gateway for Indian users
- **UPI Support**: Direct UPI payments
- **Multiple Payment Methods**: Cards, net banking, wallets

### Admin Dashboard
- **Order Management**: View and update order status
- **Password Protection**: Simple admin authentication
- **Order Analytics**: Track pending, processing, completed orders
- **Customer Details**: Full order and customer information

### Backend Integration (Supabase Ready)
- **Email Notifications**: Automated customer and seller emails
- **Google Sheets Logging**: Track all orders and payments
- **Order Status Management**: Update order status in real-time

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation
- React Query for state management

**Backend Integration:**
- Supabase Edge Functions (replaces Express.js)
- Razorpay SDK
- Google Sheets API
- Nodemailer for emails

## 🎨 Design System

The app features a gaming-inspired dark theme with:
- Orange/amber primary colors (#FF6B1A)
- Dark blue background (#1E293B)
- Gaming-style animations and hover effects
- Mobile-first responsive design
- Custom button variants (gaming, premium)

## 📱 Pages & Components

### Main Pages
- **Homepage** (`/`): Service browsing and checkout
- **Admin Dashboard** (`/admin`): Order management (password: admin123)

### Key Components
- **ServiceCard**: Display service details with pricing
- **CheckoutSidebar**: Customer details and payment form
- **Navbar**: Navigation with admin access
- **AdminPage**: Order management dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development
The app runs on `http://localhost:8080` by default.

## 🔧 Backend Setup (Supabase Integration)

Since this is a Lovable project, use Supabase Edge Functions for backend functionality:

### 1. Payment Processing (Edge Function)
```typescript
// supabase/functions/process-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "https://esm.sh/razorpay@2.8.6"

serve(async (req) => {
  const { amount, currency, customer } = await req.json()
  
  const razorpay = new Razorpay({
    key_id: Deno.env.get('RAZORPAY_KEY_ID'),
    key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
  })
  
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `order_${Date.now()}`,
  })
  
  return new Response(JSON.stringify(order))
})
```

### 2. Email Notifications
```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, html } = await req.json()
  
  // Use Supabase's built-in email or external service
  // Implementation depends on your email provider
})
```

### 3. Google Sheets Integration
```typescript
// supabase/functions/log-to-sheets/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const orderData = await req.json()
  
  // Use Google Sheets API to log order data
  // Requires Google Service Account credentials
})
```

## 🔐 Environment Variables

Set up these secrets in Supabase:

```env
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
GOOGLE_SHEETS_PRIVATE_KEY=xxx
GOOGLE_SHEETS_CLIENT_EMAIL=xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📊 Services Configuration

Edit `src/data/services.ts` to customize available services:

```typescript
export const services: Service[] = [
  {
    id: "web-design-basic",
    name: "Basic Website Design",
    price: 25000,
    originalPrice: 35000,
    category: "Web Design",
    features: ["Responsive Design", "5 Pages", "Basic SEO"]
  }
  // Add more services...
]
```

## 🎯 Deployment

### Frontend (Vercel/Netlify)
The frontend is automatically deployed through Lovable. For custom deployment:

```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend (Supabase)
Edge functions are automatically deployed when you push to your Supabase project.

## 🔒 Admin Access

- URL: `/admin`
- Password: `admin123` (change in production)
- Features: View orders, update status, customer details

## 📝 Customization

### Adding New Services
1. Edit `src/data/services.ts`
2. Add service details with pricing
3. Services appear automatically

### Modifying Coupon Codes
Edit the `validCoupons` object in `CheckoutSidebar.tsx`:

```typescript
const validCoupons = {
  'WELCOME10': { discount: 10, type: 'percentage' },
  'SAVE500': { discount: 500, type: 'fixed' }
}
```

### Styling Changes
- Colors: Edit `src/index.css` CSS variables
- Components: Modify `tailwind.config.ts`
- Gaming theme: Update gradient and shadow values

## 🐛 Troubleshooting

### Common Issues
1. **Payment not working**: Check Razorpay credentials
2. **Admin not accessible**: Verify password in `AdminPage.tsx`
3. **Styling broken**: Check Tailwind configuration

### Development Tips
- Use browser dev tools for responsive testing
- Check console for JavaScript errors
- Verify environment variables in Supabase

## 📈 Next Steps

1. **Production Setup**:
   - Change admin password
   - Set up real payment credentials
   - Configure email service

2. **Features to Add**:
   - User authentication
   - Order tracking for customers
   - Service delivery management
   - Review and rating system

3. **Scaling**:
   - Database optimization
   - CDN for static assets
   - Caching for better performance

## 📄 License

This project is built with Lovable and follows their terms of service.

## 🤝 Support

For technical issues:
1. Check the troubleshooting section
2. Review Lovable documentation
3. Contact support through Lovable platform
