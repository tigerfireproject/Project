
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Calendar as CalendarIcon, Plus, Fuel, Wrench, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ExpenseData {
  id: string;
  busNumber: string;
  category: 'fuel' | 'maintenance' | 'insurance' | 'registration' | 'other';
  amount: number;
  date: string;
  description: string;
  receipt?: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newExpense, setNewExpense] = useState({
    busNumber: '',
    category: 'fuel' as const,
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
  });

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem('busExpenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }

    // Load buses from localStorage
    const storedBuses = localStorage.getItem('buses');
    if (storedBuses) {
      setBuses(JSON.parse(storedBuses));
    }
  }, []);

  const handleAddExpense = () => {
    if (!newExpense.busNumber || !newExpense.amount || !newExpense.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const expense: ExpenseData = {
      id: Date.now().toString(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };

    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    localStorage.setItem('busExpenses', JSON.stringify(updatedExpenses));

    setNewExpense({
      busNumber: '',
      category: 'fuel',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
    });
    setShowAddExpense(false);
    toast.success('Expense added successfully');
  };

  const calculateTotalByPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      switch (period) {
        case 'daily':
          return expenseDate.toDateString() === now.toDateString();
        case 'weekly':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return expenseDate >= weekAgo;
        case 'monthly':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return expenseDate >= monthAgo;
        default:
          return true;
      }
    });
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByCategory = () => {
    const categories = ['fuel', 'maintenance', 'insurance', 'registration', 'other'];
    return categories.map(category => ({
      category,
      amount: expenses
        .filter(expense => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0)
    }));
  };

  const getExpensesByBus = () => {
    const busExpenses = buses.map(bus => ({
      busNumber: bus.busNumber,
      amount: expenses
        .filter(expense => expense.busNumber === bus.busNumber)
        .reduce((total, expense) => total + expense.amount, 0)
    }));
    return busExpenses.filter(item => item.amount > 0);
  };

  const getExpensesTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    return last7Days.map(date => ({
      date: format(new Date(date), 'MMM dd'),
      amount: expenses
        .filter(expense => expense.date === date)
        .reduce((total, expense) => total + expense.amount, 0)
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fuel': return <Fuel className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel': return 'text-blue-600';
      case 'maintenance': return 'text-orange-600';
      case 'insurance': return 'text-green-600';
      case 'registration': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bus Expenses</h1>
          <p className="text-gray-600">Track and manage daily, weekly, and monthly bus expenses</p>
        </div>
        <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expenseBusNumber">Bus Number *</Label>
                <Select value={newExpense.busNumber} onValueChange={(value) => setNewExpense({...newExpense, busNumber: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.busNumber}>
                        {bus.busNumber} - {bus.route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={newExpense.category} onValueChange={(value: any) => setNewExpense({...newExpense, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fuel">Fuel</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="expenseDate">Date *</Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Enter expense description"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddExpense} className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Expense
                </Button>
                <Button variant="outline" onClick={() => setShowAddExpense(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Daily Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold">${calculateTotalByPeriod('daily').toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold">${calculateTotalByPeriod('weekly').toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold">${calculateTotalByPeriod('monthly').toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="bus">By Bus</TabsTrigger>
          <TabsTrigger value="recent">Recent Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getExpensesTrend()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getExpensesByCategory()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bus">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Bus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getExpensesByBus()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="busNumber" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No expenses recorded</p>
              ) : (
                <div className="space-y-4">
                  {expenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full bg-gray-100 ${getCategoryColor(expense.category)}`}>
                            {getCategoryIcon(expense.category)}
                          </div>
                          <div>
                            <p className="font-medium">Bus {expense.busNumber}</p>
                            <p className="text-sm text-gray-600">{expense.description}</p>
                            <p className="text-xs text-gray-500">{format(new Date(expense.date), 'PPP')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 capitalize">{expense.category}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
