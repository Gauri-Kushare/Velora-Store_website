import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Phone, Clock, MapPin, Send, MessageSquare, Check, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigateTo, showToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Styling Consultation',
    orderNumber: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in your name, email and message.');
      return;
    }

    setIsSubmitted(true);
    showToast('Your message has been received by our Client Services concierge.');
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
            <li className="text-charcoal font-medium">Client Services & Concierge</li>
          </ol>
        </nav>

        {/* Title */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal/60 font-semibold block mb-2">
            HERE TO ASSIST
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-charcoal tracking-tight">
            Client Services & Concierge
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
            Whether you require personal styling advice, assistance with garment sizing, or updates regarding an atelier dispatch, our dedicated team is at your disposal.
          </p>
        </div>

        {/* Contact Grid: Direct Channels + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-20 border-b border-accent-border">
          {/* Direct channels & atelier hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl text-charcoal font-normal border-b border-accent-border pb-3">
                Direct Atelier Channels
              </h2>

              <div className="space-y-5 text-xs text-charcoal/80 font-light">
                <div className="flex items-start gap-3.5">
                  <Mail className="w-4 h-4 text-sand-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-charcoal block">Email Inquiries</span>
                    <a
                      href="mailto:care@velora.com"
                      className="text-charcoal underline underline-offset-4 hover:text-sand-dark"
                    >
                      care@velora.com
                    </a>
                    <p className="text-[11px] text-charcoal/50 mt-0.5">
                      Average response time: within 4 business hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-4 h-4 text-sand-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-charcoal block">Telephone & WhatsApp Concierge</span>
                    <a
                      href="tel:+912249108800"
                      className="text-charcoal underline underline-offset-4 hover:text-sand-dark"
                    >
                      +91 (022) 4910 8800
                    </a>
                    <p className="text-[11px] text-charcoal/50 mt-0.5">
                      Direct consultation with our senior fit advisors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-4 h-4 text-sand-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-charcoal block">Concierge Desk Hours</span>
                    <p className="leading-relaxed">
                      Monday to Saturday: 9:30 AM – 7:30 PM IST
                      <br />
                      Sunday: 11:00 AM – 5:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Showroom appointment block */}
            <div className="bg-ivory-50 border border-accent-border p-6 sm:p-8 space-y-3">
              <span className="text-[10px] uppercase tracking-luxury text-sand-dark font-semibold block">
                PRIVATE CONSULTATION
              </span>
              <h3 className="font-serif text-xl text-charcoal font-medium">
                Atelier Showroom Appointments
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                Experience our fabrics in person. Private fitting appointments may be reserved at our Mumbai atelier or New Delhi gallery space.
              </p>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7 bg-ivory-50 border border-accent-border p-6 sm:p-10 shadow-soft">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-sand-subtle flex items-center justify-center mx-auto text-charcoal">
                  <Check className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal font-normal">
                  Thank you for reaching out.
                </h3>
                <p className="text-xs text-charcoal/70 font-light max-w-sm mx-auto leading-relaxed">
                  Your message has been assigned to a client advisor. We will review your inquiry and respond to {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      topic: 'Styling Consultation',
                      orderNumber: '',
                      message: '',
                    });
                  }}
                  className="mt-4 px-6 py-2.5 border border-accent-border text-xs uppercase tracking-luxury text-charcoal hover:border-charcoal"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal font-normal">Send an Atelier Message</h3>
                  <p className="text-xs text-charcoal/60 font-light mt-1">
                    Fill out the form below and an advisor will be in touch with you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal font-medium mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. eleanor@velora.com"
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal font-medium mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    >
                      <option value="Styling Consultation">Personal Styling Consultation</option>
                      <option value="Sizing Advice">Size & Fit Advisory</option>
                      <option value="Order Tracking">Order & Dispatch Status</option>
                      <option value="Returns & Exchanges">Returns or Exchange Request</option>
                      <option value="Bespoke Tailoring">Custom Atelier Inquiry</option>
                      <option value="Press & Editorial">Press & Partnerships</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-luxury text-charcoal font-medium mb-1.5">
                      Order Number (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. VEL-849201"
                      className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-charcoal font-medium mb-1.5">
                    How Can We Assist? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share any details regarding the silhouette, fit, or special delivery requirements..."
                    className="w-full bg-ivory border border-accent-border focus:border-charcoal px-3.5 py-2.5 text-xs text-charcoal outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-luxury font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Atelier</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Physical Atelier Showroom Locations */}
        <div className="pt-16 sm:pt-20">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50 font-medium block mb-1">
              PHYSICAL GALLERIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              Visit our ateliers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 bg-ivory-50 border border-accent-border space-y-3">
              <span className="text-[10px] uppercase tracking-luxury text-sand-dark font-medium">FLAGSHIP</span>
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                Mumbai Atelier & Salons
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                42 Altamount Road, Cumballa Hill
                <br />
                Mumbai, Maharashtra 400026
              </p>
              <p className="text-xs text-charcoal/60 pt-1">
                Hours: Tuesday to Sunday, 11:00 AM – 7:30 PM (By private appointment)
              </p>
            </div>

            <div className="p-6 sm:p-8 bg-ivory-50 border border-accent-border space-y-3">
              <span className="text-[10px] uppercase tracking-luxury text-sand-dark font-medium">GALLERY</span>
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                New Delhi Design Gallery
              </h3>
              <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                12 Dr. APJ Abdul Kalam Road, Aurangzeb Lane
                <br />
                New Delhi, 110011
              </p>
              <p className="text-xs text-charcoal/60 pt-1">
                Hours: Monday to Saturday, 10:30 AM – 7:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
