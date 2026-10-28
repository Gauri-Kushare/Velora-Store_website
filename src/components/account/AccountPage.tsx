import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { isSupabaseConfigured } from '../../services/supabase';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, loginUser, registerUser, logoutUser, orders, formatPrice, navigateTo, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  // Sign-in form state if logged out
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    if (authPassword.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authMode === 'signin') {
        await loginUser(authEmail, authPassword);
      } else {
        await registerUser({
          email: authEmail,
          password: authPassword,
          firstName: authFirstName.trim() || 'Atelier',
          lastName: authLastName.trim() || 'Client',
        });
      }
    } catch {
      showToast('Authentication encountered an issue. Using offline access.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setAuthEmail('eleanor.vance@atelier-velora.com');
    setAuthPassword('Velora2026!');
    setAuthMode('signin');
  };

  return (
    <div className="bg-ivory min-h-screen pt-4 sm:pt-6 pb-24">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-luxury text-charcoal/50 mb-6 sm:mb-8">
          <ol className="flex items-center gap-2">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-charcoal transition-colors">
                Home
              </button>
            </li>
            <li>/</li>
            <li className="text-charcoal font-medium">My Account</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-accent-border pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
              {user.isLoggedIn ? user.tier || 'ATELIER CLIENT' : 'CLIENT PORTAL'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal tracking-tight">
              {user.isLoggedIn ? `Welcome, ${user.name}` : 'Sign In to Your Account'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-charcoal/70 font-light">
              {user.isLoggedIn
                ? 'Review your past orders, manage delivery addresses, and view your saved pieces.'
                : 'Access your private order history and saved pieces.'}
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-ivory-200 border border-accent-border text-[10px] uppercase tracking-luxury text-charcoal/70 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                {isSupabaseConfigured() ? 'Supabase Auth Protected' : 'Atelier Express JWT Auth'}
              </span>
            </div>
          </div>

          {user.isLoggedIn && (
            <button
              onClick={logoutUser}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-charcoal/60 hover:text-charcoal underline underline-offset-4 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          )}
        </div>

        {/* IF USER NOT LOGGED IN */}
        {!user.isLoggedIn ? (
          <div className="max-w-md mx-auto bg-ivory-50 border border-accent-border p-8 shadow-soft my-10">
            <div className="flex border-b border-accent-border mb-6 text-xs uppercase tracking-luxury">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${
                  authMode === 'signin'
                    ? 'border-charcoal text-charcoal font-semibold'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${
                  authMode === 'register'
                    ? 'border-charcoal text-charcoal font-semibold'
                    : 'border-transparent text-charcoal/50 hover:text-charcoal'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authFirstName}
                      onChange={(e) => setAuthFirstName(e.target.value)}
                      placeholder="Eleanor"
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authLastName}
                      onChange={(e) => setAuthLastName(e.target.value)}
                      placeholder="Vance"
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. eleanor.vance@atelier-velora.com"
                    className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none pl-9"
                  />
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none pl-9"
                  />
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors mt-2 disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Connecting with Atelier...'
                  : authMode === 'signin'
                  ? 'Sign In to Account'
                  : 'Create Atelier Account'}
              </button>

              <button
                type="button"
                onClick={fillDemoAccount}
                className="w-full py-2 text-[11px] uppercase tracking-luxury text-charcoal/60 hover:text-charcoal bg-ivory border border-accent-border/70 hover:border-charcoal transition-colors"
              >
                Auto-fill Seeded Demo Account (Eleanor Vance)
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-accent-border/60 text-center">
              <p className="text-[11px] text-charcoal/60 font-light">
                Need personal shopping advice?{' '}
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-charcoal underline underline-offset-4 font-medium"
                >
                  Contact Client Services
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* LOGGED IN ACCOUNT DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 bg-ivory-50 border border-accent-border p-4 divide-y divide-accent-border/60">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-luxury font-medium transition-colors text-left ${
                  activeTab === 'orders' ? 'bg-charcoal text-ivory font-semibold' : 'text-charcoal hover:bg-ivory-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Order History ({orders.length})</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-luxury font-medium transition-colors text-left ${
                  activeTab === 'addresses' ? 'bg-charcoal text-ivory font-semibold' : 'text-charcoal hover:bg-ivory-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-3 text-xs uppercase tracking-luxury font-medium transition-colors text-left ${
                  activeTab === 'profile' ? 'bg-charcoal text-ivory font-semibold' : 'text-charcoal hover:bg-ivory-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Client Profile</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('wishlist')}
                className="w-full flex items-center justify-between p-3 text-xs uppercase tracking-luxury font-medium text-charcoal hover:bg-ivory-200 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-sand-dark" />
                  <span>Personal Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal font-normal">Past Orders</h2>
                    <p className="text-xs text-charcoal/60 font-light mt-1">
                      Pieces created, inspected, and delivered by our atelier.
                    </p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 text-center bg-ivory-50 border border-accent-border">
                      <Package className="w-8 h-8 text-charcoal/30 mx-auto mb-2" />
                      <p className="text-xs text-charcoal/70 font-light">You have no recorded orders yet.</p>
                      <button
                        onClick={() => navigateTo('shop')}
                        className="mt-4 px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800"
                      >
                        Explore Pieces
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const isExpanded = selectedOrderDetails === order.id;

                        return (
                          <div
                            key={order.id}
                            className="bg-ivory-50 border border-accent-border overflow-hidden transition-all shadow-sm"
                          >
                            {/* Order Header Summary Bar */}
                            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent-border/70 bg-ivory-100">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-semibold text-charcoal tracking-wider">
                                    {order.id}
                                  </span>
                                  <span className="text-[11px] px-2.5 py-0.5 bg-sand-subtle/80 text-charcoal font-medium border border-sand-dark/30">
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs text-charcoal/60 font-light mt-1">
                                  Placed on {order.date} · {order.items.length}{' '}
                                  {order.items.length === 1 ? 'piece' : 'pieces'}
                                </p>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-5">
                                <div className="text-right">
                                  <span className="text-xs text-charcoal/50 block font-light">Total Amount</span>
                                  <span className="text-sm font-semibold text-charcoal">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>

                                <button
                                  onClick={() => setSelectedOrderDetails(isExpanded ? null : order.id)}
                                  className="px-3 py-1.5 border border-accent-border text-xs uppercase tracking-luxury text-charcoal hover:border-charcoal transition-colors font-medium bg-ivory"
                                >
                                  {isExpanded ? 'Hide Details' : 'View Order'}
                                </button>
                              </div>
                            </div>

                            {/* Order Items Preview (always visible) */}
                            <div className="p-5 sm:p-6 divide-y divide-accent-border/60">
                              {order.items.map((item) => (
                                <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-14 h-18 object-cover bg-ivory-200 border border-accent-border flex-shrink-0"
                                    />
                                    <div>
                                      <h4 className="font-serif text-base text-charcoal font-medium">
                                        {item.name}
                                      </h4>
                                      <p className="text-xs text-charcoal/60 font-light mt-0.5">
                                        {item.color} · Size {item.size} · Quantity {item.quantity}
                                      </p>
                                    </div>
                                  </div>

                                  <span className="text-xs font-semibold text-charcoal">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Collapsible Details */}
                            {isExpanded && (
                              <div className="p-5 sm:p-6 bg-ivory-200/40 border-t border-accent-border/70 space-y-4 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-charcoal/80">
                                  <div>
                                    <strong className="font-medium text-charcoal block mb-1">
                                      Shipping Address
                                    </strong>
                                    <p className="font-light leading-relaxed">
                                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                      <br />
                                      {order.shippingAddress.address}
                                      {order.shippingAddress.apartment && <>, {order.shippingAddress.apartment}</>}
                                      <br />
                                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                    </p>
                                  </div>

                                  <div>
                                    <strong className="font-medium text-charcoal block mb-1">
                                      Delivery & Payment
                                    </strong>
                                    <p className="font-light leading-relaxed">
                                      Method: {order.deliveryMethod}
                                      <br />
                                      Payment: {order.paymentMethod}
                                      {order.giftNote && (
                                        <>
                                          <br />
                                          <span className="italic">Gift note: "{order.giftNote}"</span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-3 border-t border-accent-border flex justify-end gap-3">
                                  <button
                                    onClick={() => showToast(`Invoice downloaded for Order ${order.id}`)}
                                    className="text-xs underline underline-offset-4 text-charcoal/70 hover:text-charcoal"
                                  >
                                    Download Tax Invoice (PDF)
                                  </button>
                                  <button
                                    onClick={() => navigateTo('contact')}
                                    className="text-xs underline underline-offset-4 text-charcoal/70 hover:text-charcoal"
                                  >
                                    Request Return / Exchange
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl text-charcoal font-normal">Saved Delivery Addresses</h2>
                      <p className="text-xs text-charcoal/60 font-light mt-1">
                        Addresses used for effortless one-click checkout.
                      </p>
                    </div>
                    <button
                      onClick={() => showToast('Address creation: Enter your new address at next checkout.')}
                      className="px-4 py-2 border border-accent-border bg-ivory text-xs uppercase tracking-luxury text-charcoal hover:border-charcoal font-medium"
                    >
                      + Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-ivory-50 border border-charcoal relative space-y-2">
                      <span className="text-[10px] uppercase tracking-luxury px-2 py-0.5 bg-charcoal text-ivory font-medium inline-block">
                        Default Atelier Delivery
                      </span>
                      <h3 className="font-serif text-lg text-charcoal font-medium pt-1">
                        Eleanor Vance
                      </h3>
                      <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                        42 Altamount Road, Cumballa Hill
                        <br />
                        Apartment 8B, The Residence
                        <br />
                        Mumbai, Maharashtra 400026
                        <br />
                        India
                      </p>
                      <p className="text-xs text-charcoal/60 pt-1">Phone: +91 98201 44520</p>
                      <div className="pt-3 flex gap-4 text-xs">
                        <button
                          onClick={() => showToast('Address updated.')}
                          className="text-charcoal underline underline-offset-4 hover:text-sand-dark"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-ivory-50 border border-accent-border space-y-2">
                      <span className="text-[10px] uppercase tracking-luxury px-2 py-0.5 bg-ivory-200 text-charcoal/70 font-medium inline-block">
                        Holiday Residence
                      </span>
                      <h3 className="font-serif text-lg text-charcoal font-medium pt-1">
                        Eleanor Vance
                      </h3>
                      <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                        Villa Palmeto, Assagao Badem Road
                        <br />
                        North Goa, Goa 403507
                        <br />
                        India
                      </p>
                      <p className="text-xs text-charcoal/60 pt-1">Phone: +91 98201 44520</p>
                      <div className="pt-3 flex gap-4 text-xs">
                        <button
                          onClick={() => showToast('Address updated.')}
                          className="text-charcoal underline underline-offset-4 hover:text-sand-dark"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CLIENT PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal font-normal">Personal Information</h2>
                    <p className="text-xs text-charcoal/60 font-light mt-1">
                      Manage your profile and atelier communications.
                    </p>
                  </div>

                  <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-5 max-w-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full bg-ivory border border-accent-border px-3.5 py-2 text-xs text-charcoal outline-none focus:border-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                          Client Membership
                        </label>
                        <input
                          type="text"
                          disabled
                          defaultValue={user.tier || 'Atelier Member'}
                          className="w-full bg-ivory-200/60 border border-accent-border px-3.5 py-2 text-xs text-charcoal/60 outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full bg-ivory border border-accent-border px-3.5 py-2 text-xs text-charcoal outline-none focus:border-charcoal"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-luxury text-charcoal/80 font-medium mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone || '+91 98201 44520'}
                        className="w-full bg-ivory border border-accent-border px-3.5 py-2 text-xs text-charcoal outline-none focus:border-charcoal"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => showToast('Profile preferences updated successfully.')}
                        className="px-6 py-2.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
