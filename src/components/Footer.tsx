import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setRoute, settings, activeCategories } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E0D5] text-[#4A3E37]">
      {/* 4 Feature Trust Badges Bar (Matches bottom strip in screenshot) */}
      <div className="border-b border-[#E8E0D5] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {/* Free Shipping */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#A25828] shrink-0 border border-[#E8E0D5]">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#221C18]">Free UK Delivery</h4>
                <p className="text-xs text-[#736961] mt-0.5">On all orders over £{settings.freeDeliveryThreshold}</p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#A25828] shrink-0 border border-[#E8E0D5]">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#221C18]">30-Day Comfort Trial</h4>
                <p className="text-xs text-[#736961] mt-0.5">Hassle-free UK returns policy</p>
              </div>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#A25828] shrink-0 border border-[#E8E0D5]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#221C18]">Secure Payment</h4>
                <p className="text-xs text-[#736961] mt-0.5">100% encrypted Stripe & Klarna</p>
              </div>
            </div>

            {/* UK Support */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center text-[#A25828] shrink-0 border border-[#E8E0D5]">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#221C18]">UK Customer Support</h4>
                <p className="text-xs text-[#736961] mt-0.5">Mon–Sat 9am–6pm helpline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address Column (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="footer" />

            {settings.footerDesign?.aboutText && (
              <p className="text-xs text-[#524842] leading-relaxed">
                {settings.footerDesign.aboutText}
              </p>
            )}

            <div className="space-y-2 text-xs text-[#524842] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A25828] shrink-0 mt-0.5" />
                <span>{settings.footerDesign?.address || settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A25828] shrink-0" />
                <a href={`tel:${(settings.footerDesign?.phone || settings.phone).replace(/\s+/g, '')}`} className="hover:text-[#A25828] underline">
                  {settings.footerDesign?.phone || settings.phone}
                </a>
                <span className="text-stone-400">·</span>
                <a
                  href={`https://wa.me/${(settings.footerDesign?.whatsapp || settings.whatsapp || '447923119077').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  WhatsApp Us
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A25828] shrink-0" />
                <a href={`mailto:${settings.footerDesign?.email || settings.email}`} className="hover:text-[#A25828]">
                  {settings.footerDesign?.email || settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#A25828] shrink-0" />
                <span>{settings.footerDesign?.openingHours || settings.businessHours}</span>
              </div>
            </div>

            {/* Social Media Links */}
            {(settings.footerDesign?.socialInstagram || settings.footerDesign?.socialFacebook || settings.footerDesign?.socialPinterest) && (
              <div className="flex items-center gap-3 pt-2 text-xs">
                {settings.footerDesign?.socialInstagram && (
                  <a
                    href={settings.footerDesign.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A786A] hover:text-[#A25828] font-medium"
                  >
                    Instagram
                  </a>
                )}
                {settings.footerDesign?.socialFacebook && (
                  <a
                    href={settings.footerDesign.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A786A] hover:text-[#A25828] font-medium"
                  >
                    Facebook
                  </a>
                )}
                {settings.footerDesign?.socialPinterest && (
                  <a
                    href={settings.footerDesign.socialPinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8A786A] hover:text-[#A25828] font-medium"
                  >
                    Pinterest
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#221C18] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/category/sofas"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'category', categorySlug: 'sofas' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Handcrafted Sofas
                </a>
              </li>
              <li>
                <a
                  href="/category/sofas/corner-sofas"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'category', categorySlug: 'sofas', subcategorySlug: 'corner-sofas' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Corner &amp; Chaise Sofas
                </a>
              </li>
              <li>
                <a
                  href="/category/sofas/3-seater-sofas"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'category', categorySlug: 'sofas', subcategorySlug: '3-seater-sofas' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  3-Seater Living Room Sofas
                </a>
              </li>
              <li>
                <a
                  href="/category/beds"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'category', categorySlug: 'beds' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Bespoke Ottoman Beds
                </a>
              </li>
              <li>
                <a
                  href="/category/beds/upholstered-beds"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'category', categorySlug: 'beds', subcategorySlug: 'upholstered-beds' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Upholstered Wingback Beds
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'shop' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer font-semibold text-[#A25828] block"
                >
                  Shop All Collections &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#221C18] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="/delivery"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'delivery' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  UK Delivery &amp; White Glove
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'returns' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  30-Day Comfort Trial &amp; Returns
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'account' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Track Order &amp; Dispatch
                </a>
              </li>
              <li>
                <a
                  href="/wishlist"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'wishlist' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Saved Wishlist
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'faqs' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setRoute({ name: 'contact' });
                  }}
                  className="hover:text-[#A25828] transition-colors cursor-pointer block"
                >
                  Contact Dewsbury Showroom
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Buying Guides */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#221C18] mb-4">
              Join Our Circle
            </h4>
            <p className="text-xs text-[#6B6159] leading-relaxed mb-3">
              Subscribe for exclusive fabric previews, seasonal sales, and British interior inspiration.
            </p>
            {newsletterSubscribed ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! You are subscribed to Plush Comfort updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-[#D5C7B7] text-[#221C18] placeholder-stone-400 focus:outline-none focus:border-[#A25828]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#A25828] text-white hover:bg-[#8A461A] text-xs font-semibold py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <div className="pt-4">
              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  setRoute({ name: 'blog' });
                }}
                className="text-xs font-semibold text-[#A25828] hover:underline block"
              >
                Read UK Buying Guides &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Payment Badges & Copyright */}
        <div className="border-t border-[#E8E0D5] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8A786A]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              {settings.footerDesign?.copyrightText || `© ${new Date().getFullYear()} Plush Comfort UK. All rights reserved.`}
            </span>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                setRoute({ name: 'privacy' });
              }}
              className="hover:text-[#221C18] transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                setRoute({ name: 'terms' });
              }}
              className="hover:text-[#221C18] transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/cookies"
              onClick={(e) => {
                e.preventDefault();
                setRoute({ name: 'cookies' });
              }}
              className="hover:text-[#221C18] transition-colors cursor-pointer"
            >
              Cookie Policy
            </a>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
            <span className="px-2 py-1 bg-white rounded border border-[#E8E0D5]">Visa</span>
            <span className="px-2 py-1 bg-white rounded border border-[#E8E0D5]">Mastercard</span>
            <span className="px-2 py-1 bg-white rounded border border-[#E8E0D5]">Klarna</span>
            <span className="px-2 py-1 bg-white rounded border border-[#E8E0D5]">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
