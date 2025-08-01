import { Service } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  isSelected?: boolean;
}

export const ServiceCard = ({ service, onSelect, isSelected }: ServiceCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = service.originalPrice 
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : null;

  return (
    <Card className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
      isSelected ? 'ring-2 ring-primary shadow-lg shadow-primary/30' : ''
    }`} onClick={() => onSelect(service)}>
      {discountPercentage && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="destructive" className="bg-gaming-orange text-primary-foreground">
            {discountPercentage}% OFF
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
              {service.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1 line-clamp-2">
              {service.description}
            </CardDescription>
          </div>
          {isSelected && (
            <div className="flex-shrink-0 ml-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {service.category}
            </Badge>
            {discountPercentage && (
              <div className="flex items-center gap-1 text-gaming-orange">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Popular</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-lg font-bold text-foreground">
              {formatPrice(service.price)}
              {service.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatPrice(service.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            {service.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-3 h-3 text-gaming-green" />
                <span>{feature}</span>
              </div>
            ))}
            {service.features.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{service.features.length - 3} more features
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className={`w-full ${isSelected ? 'bg-primary' : ''}`} 
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? 'Selected' : 'Select Service'}
        </Button>
      </CardFooter>
    </Card>
  );
};