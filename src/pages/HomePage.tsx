import { useState } from "react";
import { services, categories } from "@/data/services";
import { Service, CustomerDetails } from "@/types";
import { ServiceCard } from "@/components/ServiceCard";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-services.jpg";

export const HomePage = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredServices = services.filter(service => {
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Scroll to checkout on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToPayment = async (customerDetails: CustomerDetails, couponCode?: string) => {
    if (!selectedService) return;

    setIsProcessing(true);
    
    try {
      // Here you would integrate with Razorpay
      // For now, we'll simulate the payment process
      
      toast({
        title: "Payment Integration",
        description: "Razorpay integration will be set up in the backend. This is a demo.",
      });

      console.log('Payment Details:', {
        service: selectedService,
        customer: customerDetails,
        couponCode,
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Professional digital services" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/95 to-background/90" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary border border-primary/30 px-6 py-3 rounded-full text-sm mb-8 shadow-lg">
              <Zap className="w-4 h-4" />
              Professional Services at Your Fingertips
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Choose Your Perfect
              <br />
              <span className="text-primary">Digital Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              From stunning websites to powerful mobile apps, get professional services delivered with quality and speed. 
              Pay securely with UPI and track your project progress in real-time.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Badge variant="secondary" className="px-6 py-3 text-base backdrop-blur-sm bg-secondary/80">
                🔒 Secure UPI Payments
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 text-base backdrop-blur-sm bg-secondary/80">
                👨‍💻 Expert Developers
              </Badge>
              <Badge variant="secondary" className="px-6 py-3 text-base backdrop-blur-sm bg-secondary/80">
                ⚡ Fast Delivery
              </Badge>
            </div>
            <Button 
              size="lg" 
              variant="gaming" 
              className="text-lg px-8 py-6 rounded-xl shadow-2xl"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Services List */}
            <div className="flex-1">
              {/* Filters */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory('')}
                  >
                    All Services
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onSelect={handleServiceSelect}
                    isSelected={selectedService?.id === service.id}
                  />
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Checkout Sidebar */}
            <div id="checkout">
              <CheckoutSidebar
                selectedService={selectedService}
                onProceedToPayment={handleProceedToPayment}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your projects completed within the promised timeline with regular updates.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">Pay securely through UPI, cards, or net banking with Razorpay integration.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Quality Assurance</h3>
              <p className="text-muted-foreground">Every project goes through rigorous quality checks before delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};