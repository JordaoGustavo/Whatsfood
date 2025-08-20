'use client';

import { useState } from 'react';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// Sample menu data
const menuData: MenuItem[] = [
  // Burgers
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Beef patty, lettuce, tomato, onion, mayo',
    price: 12.99,
    category: 'Burgers',
  },
  {
    id: '2',
    name: 'Cheeseburger',
    description: 'Beef patty, cheese, lettuce, tomato, onion, mayo',
    price: 14.99,
    category: 'Burgers',
  },
  {
    id: '3',
    name: 'Bacon Burger',
    description: 'Beef patty, bacon, cheese, lettuce, tomato, onion',
    price: 16.99,
    category: 'Burgers',
  },
  
  // Pizza
  {
    id: '4',
    name: 'Margherita Pizza',
    description: 'Tomato sauce, mozzarella, fresh basil',
    price: 18.99,
    category: 'Pizza',
  },
  {
    id: '5',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, pepperoni',
    price: 22.99,
    category: 'Pizza',
  },
  {
    id: '6',
    name: 'Vegetarian Pizza',
    description: 'Tomato sauce, mozzarella, bell peppers, mushrooms, olives',
    price: 20.99,
    category: 'Pizza',
  },
  
  // Drinks
  {
    id: '7',
    name: 'Coca Cola',
    description: 'Classic soft drink - 350ml',
    price: 3.99,
    category: 'Drinks',
  },
  {
    id: '8',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice - 300ml',
    price: 5.99,
    category: 'Drinks',
  },
  {
    id: '9',
    name: 'Iced Coffee',
    description: 'Cold brew coffee with ice - 400ml',
    price: 4.99,
    category: 'Drinks',
  },
  
  // Desserts
  {
    id: '10',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 7.99,
    category: 'Desserts',
  },
  {
    id: '11',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with chocolate sauce and whipped cream',
    price: 6.99,
    category: 'Desserts',
  },
];

// Customer info interface
interface CustomerInfo {
  name: string;
  address: string;
  paymentMethod: string;
  phoneNumber: string;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    paymentMethod: '',
    phoneNumber: ''
  });

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(menuData.map(item => item.category)))];

  // Filter menu items by category
  const filteredMenu = selectedCategory === 'All' 
    ? menuData 
    : menuData.filter(item => item.category === selectedCategory);

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update customer info
  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate required fields
    if (!customerInfo.name.trim()) {
      alert('Please enter your name!');
      return;
    }
    if (!customerInfo.address.trim()) {
      alert('Please enter your address!');
      return;
    }
    if (!customerInfo.paymentMethod.trim()) {
      alert('Please select a payment method!');
      return;
    }
    if (!customerInfo.phoneNumber.trim()) {
      alert('Please enter a phone number!');
      return;
    }

    let message = '🍽️ *Food Order*%0A%0A';
    
    // Customer Information
    message += `👤 *Customer:* ${customerInfo.name}%0A`;
    message += `📍 *Address:* ${customerInfo.address}%0A`;
    message += `💳 *Payment:* ${customerInfo.paymentMethod}%0A`;
    message += `📱 *Phone:* ${customerInfo.phoneNumber}%0A%0A`;
    
    // Order items
    message += '*Order Details:*%0A';
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    message += `%0A*Total: $${total.toFixed(2)}*%0A%0A`;
    message += 'Thank you for your order! 😊';

    const whatsappUrl = `https://wa.me/${customerInfo.phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🍽️ WhatsFood Menu</h1>
          <p className="text-gray-600 mt-2">Delicious food, delivered with love</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Menu Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenu.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{item.category}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-xs">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>
                      
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => updateCustomerInfo('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address *
                        </label>
                        <textarea
                          id="address"
                          value={customerInfo.address}
                          onChange={(e) => updateCustomerInfo('address', e.target.value)}
                          placeholder="Enter your complete address"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Method *
                        </label>
                        <select
                          id="payment"
                          value={customerInfo.paymentMethod}
                          onChange={(e) => updateCustomerInfo('paymentMethod', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select payment method</option>
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="PIX">PIX</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={customerInfo.phoneNumber}
                          onChange={(e) => updateCustomerInfo('phoneNumber', e.target.value)}
                          placeholder="e.g., 5511999999999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Include country code (e.g., 55 for Brazil)</p>
                      </div>

                      <button
                        onClick={generateWhatsAppMessage}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <span>📱</span>
                        Send Order via WhatsApp
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
