import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CustomerDetails, Service, CouponCode } from "@/types";
import { Check, Tag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutSidebarProps {
  selectedService: Service | null;
  onProceedToPayment: (orderData: {
    gameId: string;
    server: string;
    customerDetails: CustomerDetails;
    service: Service;
    finalAmount: number;
    couponCode?: string;
  }) => void;
  isProcessing?: boolean;
}

export const CheckoutSidebar = ({ selectedService, onProceedToPayment, isProcessing }: CheckoutSidebarProps) => {
  const { toast } = useToast();
  const [gameId, setGameId] = useState('');
  const [server, setServer] = useState('');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    additionalInfo: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Mock coupon codes for demo
  const validCoupons: Record<string, CouponCode> = {
    'WELCOME10': { code: 'WELCOME10', discount: 10, type: 'percentage', isValid: true },
    'SAVE500': { code: 'SAVE500', discount: 500, type: 'fixed', isValid: true },
    'NEWUSER': { code: 'NEWUSER', discount: 15, type: 'percentage', isValid: true },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon || !selectedService) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (selectedService.price * appliedCoupon.discount) / 100;
    } else {
      return Math.min(appliedCoupon.discount, selectedService.price);
    }
  };

  const getFinalAmount = () => {
    if (!selectedService) return 0;
    return selectedService.price - calculateDiscount();
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const coupon = validCoupons[couponCode.toUpperCase()];
    
    if (coupon) {
      setAppliedCoupon(coupon);
      toast({
        title: "Coupon Applied!",
        description: `You saved ${coupon.type === 'percentage' ? `${coupon.discount}%` : formatPrice(coupon.discount)}`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
    
    setIsValidatingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: "No Service Selected",
        description: "Please select a service before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!gameId || !server || !customerDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in Game ID, Server, and Phone Number.",
        variant: "destructive",
      });
      return;
    }

    onProceedToPayment({
      gameId,
      server,
      customerDetails,
      service: selectedService,
      finalAmount: getFinalAmount(),
      couponCode: appliedCoupon?.code
    });
  };

  if (!selectedService) {
    return (
      <Card className="w-full lg:w-96 lg:sticky lg:top-4">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Select a service to continue
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-96 lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Selected Service */}
        <div className="space-y-3">
          <h3 className="font-semibold">Selected Service</h3>
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-sm font-medium">{selectedService.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{selectedService.category}</div>
            <div className="text-lg font-bold mt-2">{formatPrice(selectedService.price)}</div>
          </div>
        </div>

        <Separator />

        {/* Game Details Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Game Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="gameId">Game ID *</Label>
              <Input
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter your Mobile Legends Game ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="server">Server *</Label>
              <Input
                id="server"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="Enter your Server ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Notes</Label>
              <Textarea
                id="additionalInfo"
                value={customerDetails.additionalInfo}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any specific notes..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Coupon Code */}
          <div className="space-y-3">
            <h3 className="font-semibold">Coupon Code</h3>
            {!appliedCoupon ? (
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={validateCoupon}
                  disabled={!couponCode.trim() || isValidatingCoupon}
                >
                  {isValidatingCoupon ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gaming-green/10 border border-gaming-green/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-gaming-green" />
                  <span className="text-sm font-medium">{appliedCoupon.code}</span>
                  <Badge variant="secondary" className="text-xs">
                    -{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : formatPrice(appliedCoupon.discount)}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={removeCoupon}>
                  Remove
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(selectedService.price)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-gaming-green">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(calculateDiscount())}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(getFinalAmount())}</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Order...
            </>
          ) : (
            `Pay ${formatPrice(getFinalAmount())} via WhatsApp`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};