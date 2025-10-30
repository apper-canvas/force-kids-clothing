import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useCart } from "@/App";
import orderService from "@/services/api/orderService";

const CheckoutPage = () => {
  const navigate = useNavigate();
const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit-card"
  });

  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
  };

  const validateZipCode = (zip) => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., 555-123-4567)";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Street address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        items: cartItems.map(item => ({
          productId: item.Id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor
        })),
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: formData.paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const createdOrder = await orderService.create(orderData);
      setOrderNumber(createdOrder.orderNumber);
      
      clearCart();

      setCurrentStep(3);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.info(`apper_info: Got this error in checkout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <ApperIcon name="ShoppingCart" size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before checking out
            </p>
            <Button onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Back to Shop</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-4">
            Checkout
          </h1>
          
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    step
                  )}
                </div>
                <div className="flex-1 ml-4">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Shipping"}
                    {step === 2 && "Payment"}
                    {step === 3 && "Confirmation"}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 ml-4 rounded ${
                      currentStep > step ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
                    Shipping Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className={errors.firstName ? "border-error" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-error text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className={errors.lastName ? "border-error" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-error text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@example.com"
                        className={errors.email ? "border-error" : ""}
                      />
                      {errors.email && (
                        <p className="text-error text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="555-123-4567"
                        className={errors.phone ? "border-error" : ""}
                      />
                      {errors.phone && (
                        <p className="text-error text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className={errors.address ? "border-error" : ""}
                      />
                      {errors.address && (
                        <p className="text-error text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="New York"
                          className={errors.city ? "border-error" : ""}
                        />
                        {errors.city && (
                          <p className="text-error text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="NY"
                          className={errors.state ? "border-error" : ""}
                        />
                        {errors.state && (
                          <p className="text-error text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="10001"
                          className={errors.zipCode ? "border-error" : ""}
                        />
                        {errors.zipCode && (
                          <p className="text-error text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNextStep} size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
{currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-display font-bold text-gray-800 mb-6">
                    Review Your Order
                  </h2>
                  
                  <div className="bg-info/10 border-2 border-info rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <ApperIcon name="Info" size={20} className="text-info mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          Demo Mode
                        </p>
                        <p className="text-sm text-gray-600">
                          This is a demonstration checkout. No actual payment will be processed. 
                          Select your preferred payment method and click "Place Order" to complete your demo order.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
                    <div className="space-y-4 mb-4">
                      {cartItems.map((item) => (
                        <div key={`${item.Id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Package" size={32} className="text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                              {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                              <p>Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 pt-2 mt-2">
                        <span className="text-gray-800">Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Select Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.button
                        type="button"
                        onClick={() => handlePaymentMethodChange("credit-card")}
                        className={`relative border-2 rounded-lg p-6 text-left transition-all ${
                          formData.paymentMethod === "credit-card"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="credit-card"
                            checked={formData.paymentMethod === "credit-card"}
                            onChange={() => handlePaymentMethodChange("credit-card")}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <ApperIcon 
                                name="CreditCard" 
                                size={24} 
                                className={formData.paymentMethod === "credit-card" ? "text-primary" : "text-gray-600"}
                              />
                              <span className="font-semibold text-gray-800">Credit Card</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Pay securely with your credit or debit card
                            </p>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => handlePaymentMethodChange("paypal")}
                        className={`relative border-2 rounded-lg p-6 text-left transition-all ${
                          formData.paymentMethod === "paypal"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={formData.paymentMethod === "paypal"}
                            onChange={() => handlePaymentMethodChange("paypal")}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <ApperIcon 
                                name="DollarSign" 
                                size={24} 
                                className={formData.paymentMethod === "paypal" ? "text-primary" : "text-gray-600"}
                              />
                              <span className="font-semibold text-gray-800">PayPal</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Fast and secure payment with PayPal
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                  {/* Shipping Address Review */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>{formData.address}</p>
                      <p>
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                      <p>{formData.country}</p>
                      <p className="pt-2">{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePreviousStep}
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      size="lg"
                      className="flex-1"
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}

{currentStep === 3 && (
                <div className="py-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Check" size={32} className="text-success" />
                    </div>
                    
                    <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
                      Order Confirmed!
                    </h2>
                    
                    <p className="text-gray-600 mb-4">
                      Thank you for your order. We've sent a confirmation email to{" "}
                      <span className="font-medium">{formData.email}</span>
                    </p>

                    <div className="bg-background rounded-lg p-4 inline-block">
                      <p className="text-sm text-gray-600 mb-1">Order Number</p>
                      <p className="text-lg font-bold text-primary">{orderNumber}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
                    
                    {/* Items */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={`${item.Id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ApperIcon name="Package" size={24} className="text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                            <div className="text-sm text-gray-600 space-y-1 mt-1">
                              {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                              {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                              <p>Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Summary */}
                    <div className="border-t-2 border-gray-200 pt-4 space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 pt-2 mt-2">
                        <span className="text-gray-800">Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t-2 border-gray-200 pt-4 mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-800">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p>{formData.address}</p>
                        <p>
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p>{formData.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t-2 border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Payment Method</h4>
                      <div className="flex items-center gap-2">
                        <ApperIcon 
                          name={formData.paymentMethod === "credit-card" ? "CreditCard" : "DollarSign"} 
                          size={20} 
                          className="text-gray-600"
                        />
                        <span className="text-sm text-gray-600">
                          {formData.paymentMethod === "credit-card" ? "Credit Card" : "PayPal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </Button>
                    <Button onClick={() => navigate("/")}>
                      View Order Details
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
{cartItems.map((item) => (
                  <div key={`${item.Id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.images?.[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.selectedSize} • {item.selectedColor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-800">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-display font-bold text-gray-800">
                    Total
                  </span>
                  <span className="font-display font-bold text-primary text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;