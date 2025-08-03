import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Eye, 
  CheckCircle, 
  Clock, 
  Play, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  game_id: string;
  server: string;
  service_name: string;
  service_description?: string;
  amount: number;
  payment_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DatabaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // In a real app, you'd compare hashed passwords
      // For demo, we'll use a simple comparison
      if (password === 'admin123') {
        setIsAuthenticated(true);
        toast({
          title: 'Login Successful',
          description: 'Welcome to the admin dashboard',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load orders: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update order status: ' + error.message,
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
      processing: { variant: 'secondary' as const, icon: Play, color: 'text-blue-600' },
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const processing = orders.filter(order => order.status === 'processing').length;
    const completed = orders.filter(order => order.status === 'completed').length;
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.amount, 0);

    return { total, pending, processing, completed, totalRevenue };
  };

  const stats = getOrderStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Default: username = admin, password = admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage orders and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Play className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Game ID</TableHead>
                  <TableHead>Server</TableHead>
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
                    <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.game_id}</TableCell>
                    <TableCell>{order.server}</TableCell>
                    <TableCell>{order.service_name}</TableCell>
                    <TableCell>{formatPrice(order.amount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">Customer Information</h4>
                                  <p>Name: {selectedOrder.customer_name}</p>
                                  <p>Email: {selectedOrder.customer_email}</p>
                                  <p>Phone: {selectedOrder.customer_phone}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Game Information</h4>
                                  <p>Game ID: {selectedOrder.game_id}</p>
                                  <p>Server: {selectedOrder.server}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Order Information</h4>
                                  <p>Service: {selectedOrder.service_name}</p>
                                  <p>Description: {selectedOrder.service_description}</p>
                                  <p>Amount: {formatPrice(selectedOrder.amount)}</p>
                                  <p>Payment ID: {selectedOrder.payment_id || 'N/A'}</p>
                                  <p>Status: {selectedOrder.status}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                                    size="sm"
                                    disabled={selectedOrder.status !== 'pending'}
                                  >
                                    Start Processing
                                  </Button>
                                  <Button 
                                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                                    variant="outline"
                                    size="sm"
                                    disabled={selectedOrder.status === 'completed'}
                                  >
                                    Mark Complete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {order.status === 'pending' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            size="sm"
                            variant="outline"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {order.status !== 'completed' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            size="sm"
                            variant="outline"
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
            {orders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No orders found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { AdminPage };
export default AdminPage;