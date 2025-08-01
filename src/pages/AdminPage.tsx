import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Order } from "@/types";
import { Eye, CheckCircle, Clock, AlertCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "admin123"; // In production, use proper authentication

export const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data for demo
  const mockOrders: Order[] = [
    {
      id: "ORD001",
      customer: {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        additionalInfo: "Need modern design with mobile responsiveness"
      },
      items: [{
        service: {
          id: "web-design-basic",
          name: "Basic Website Design",
          description: "Professional website design with up to 5 pages",
          price: 25000,
          originalPrice: 35000,
          category: "Web Design",
          features: ["Responsive Design", "5 Pages", "Basic SEO", "Mobile Optimized", "Contact Form"]
        },
        quantity: 1
      }],
      total: 25000,
      discount: 2500,
      finalAmount: 22500,
      couponCode: "WELCOME10",
      status: "pending",
      paymentId: "pay_ABC123",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "ORD002",
      customer: {
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "+91 8765432109",
        additionalInfo: "E-commerce functionality required"
      },
      items: [{
        service: {
          id: "web-design-premium",
          name: "Premium Website Design",
          description: "Advanced website with custom features and CMS",
          price: 50000,
          category: "Web Design",
          features: ["Custom Design", "10+ Pages", "CMS Integration", "Advanced SEO", "E-commerce Ready", "24/7 Support"]
        },
        quantity: 1
      }],
      total: 50000,
      discount: 0,
      finalAmount: 50000,
      status: "processing",
      paymentId: "pay_XYZ456",
      createdAt: "2024-01-14T15:45:00Z",
      updatedAt: "2024-01-15T09:20:00Z"
    },
    {
      id: "ORD003",
      customer: {
        name: "Amit Kumar",
        email: "amit@example.com",
        phone: "+91 7654321098",
        additionalInfo: "Cross-platform app for Android and iOS"
      },
      items: [{
        service: {
          id: "app-development-basic",
          name: "Mobile App - Basic",
          description: "Simple mobile app for Android and iOS",
          price: 75000,
          originalPrice: 100000,
          category: "App Development",
          features: ["Cross Platform", "Basic Features", "App Store Submission", "3 Months Support"]
        },
        quantity: 1
      }],
      total: 75000,
      discount: 11250,
      finalAmount: 63750,
      couponCode: "NEWUSER",
      status: "completed",
      paymentId: "pay_DEF789",
      createdAt: "2024-01-10T12:00:00Z",
      updatedAt: "2024-01-13T16:30:00Z"
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setOrders(mockOrders);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Welcome Admin",
        description: "You have successfully logged in to the admin panel.",
      });
    } else {
      toast({
        title: "Invalid Password",
        description: "Please enter the correct admin password.",
        variant: "destructive",
      });
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      processing: { variant: "default" as const, icon: AlertCircle, text: "Processing" },
      completed: { variant: "default" as const, icon: CheckCircle, text: "Completed" },
      cancelled: { variant: "destructive" as const, icon: AlertCircle, text: "Cancelled" }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Login to Admin Panel
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and track service requests</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-orange">
                {orders.filter(o => o.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-blue">
                {orders.filter(o => o.status === 'processing').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gaming-green">
                {orders.filter(o => o.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              View and manage all service orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.items[0]?.service.name}</div>
                        <div className="text-sm text-muted-foreground">{order.items[0]?.service.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(order.finalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                              <DialogDescription>
                                Complete order information and customer details
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">Customer Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                                      <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                      <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                      {selectedOrder.customer.additionalInfo && (
                                        <p><strong>Notes:</strong> {selectedOrder.customer.additionalInfo}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Order Summary</h4>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Service:</strong> {selectedOrder.items[0]?.service.name}</p>
                                      <p><strong>Category:</strong> {selectedOrder.items[0]?.service.category}</p>
                                      <p><strong>Amount:</strong> {formatPrice(selectedOrder.total)}</p>
                                      {selectedOrder.discount > 0 && (
                                        <p><strong>Discount:</strong> -{formatPrice(selectedOrder.discount)}</p>
                                      )}
                                      <p><strong>Final Amount:</strong> {formatPrice(selectedOrder.finalAmount)}</p>
                                      <p><strong>Payment ID:</strong> {selectedOrder.paymentId}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {selectedOrder.status !== 'completed' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                                    >
                                      Mark as Completed
                                    </Button>
                                  )}
                                  {selectedOrder.status === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                                    >
                                      Start Processing
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {order.status !== 'completed' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};