import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings, HeroDesignSettings, MegaMenuDesignSettings, FooterDesignSettings } from '../../types';
import { adminAuthService } from '../../services/adminAuthService';
import {
  Sparkles,
  Layout,
  Menu,
  Sliders,
  Upload,
  Check,
  Eye,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';

export const StoreDesignStudio: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'megamenu' | 'footer' | 'global'>('hero');
  const [designForm, setDesignForm] = useState<StoreSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload helper
  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroDesktop' | 'heroMobile' | 'megaPromo' | 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await adminAuthService.uploadImage(base64Data, file.name, `Design Studio: ${field}`);
        if (res.success && res.url) {
          if (field === 'heroDesktop') {
            setDesignForm((prev) => ({
              ...prev,
              heroDesign: {
                ...(prev.heroDesign || settings.heroDesign!),
                desktopImage: res.url!,
              },
            }));
          } else if (field === 'heroMobile') {
            setDesignForm((prev) => ({
              ...prev,
              heroDesign: {
                ...(prev.heroDesign || settings.heroDesign!),
                mobileImage: res.url!,
              },
            }));
          } else if (field === 'megaPromo') {
            setDesignForm((prev) => ({
              ...prev,
              megaMenuDesign: {
                ...(prev.megaMenuDesign || settings.megaMenuDesign!),
                promoImage: res.url!,
              },
            }));
          } else if (field === 'logo') {
            setDesignForm((prev) => ({
              ...prev,
              logoUrl: res.url!,
            }));
          } else if (field === 'favicon') {
            setDesignForm((prev) => ({
              ...prev,
              faviconUrl: res.url!,
            }));
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(designForm);

    // Persist to backend API as well
    const token = adminAuthService.getToken();
    if (token) {
      try {
        await fetch('/api/store/design', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(designForm),
        });
      } catch (err) {
        console.warn('Backend design persist warning:', err);
      }
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const hero = designForm.heroDesign || settings.heroDesign!;
  const mega = designForm.megaMenuDesign || settings.megaMenuDesign!;
  const footer = designForm.footerDesign || settings.footerDesign!;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E0D5] space-y-6 shadow-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A25828]">
                Theme &amp; Experience Studio
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Live Storefront Connected
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#221C18] mt-1">
              Dashboard-Controlled Store Design
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Customize Homepage Hero, Mega Menus, Footer Columns, and Brand Assets without touching code.
            </p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Changes live on storefront!</span>
            </div>
          )}
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('hero')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'hero'
                ? 'bg-[#A25828] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Homepage Hero Banner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('megamenu')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'megamenu'
                ? 'bg-[#A25828] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Menu className="w-3.5 h-3.5" />
            <span>2. Mega Menu &amp; Spotlight</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('footer')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'footer'
                ? 'bg-[#A25828] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>3. Footer Columns &amp; Links</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('global')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'global'
                ? 'bg-[#A25828] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>4. Global Brand &amp; Announcement</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* TAB 1: HOMEPAGE HERO */}
          {activeSubTab === 'hero' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#A25828]" />
                <div className="space-y-1">
                  <span className="font-bold block">Recommended Hero Banner Dimensions</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong>Desktop Viewport:</strong> 1920 &times; 800px (16:7 aspect ratio), WebP/PNG, max 600KB.<br />
                    <strong>Mobile Viewport:</strong> 750 &times; 900px (5:6 aspect ratio) for crisp mobile presentation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Hero Main Heading *</label>
                  <input
                    type="text"
                    required
                    value={hero.heading}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        heroDesign: { ...hero, heading: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7] text-xs font-serif font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Subheading Kicker</label>
                  <input
                    type="text"
                    value={hero.subheading}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        heroDesign: { ...hero, subheading: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7] text-xs font-bold text-[#A25828]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Hero Body Description</label>
                <textarea
                  rows={3}
                  value={hero.description}
                  onChange={(e) =>
                    setDesignForm({
                      ...designForm,
                      heroDesign: { ...hero, description: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-[#D5C7B7] text-xs leading-relaxed"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Desktop Hero Image URL (1920 &times; 800px)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hero.desktopImage}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, desktopImage: e.target.value },
                        })
                      }
                      className="flex-1 p-2.5 rounded-xl border border-stone-300 font-mono text-[11px]"
                    />
                    <label className="bg-[#A25828] hover:bg-[#8A461A] text-white px-3 py-2.5 rounded-xl font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, 'heroDesktop')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Mobile Hero Image URL (750 &times; 900px, optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hero.mobileImage || ''}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, mobileImage: e.target.value },
                        })
                      }
                      className="flex-1 p-2.5 rounded-xl border border-stone-300 font-mono text-[11px]"
                      placeholder="Same as desktop if empty"
                    />
                    <label className="bg-[#A25828] hover:bg-[#8A461A] text-white px-3 py-2.5 rounded-xl font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, 'heroMobile')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Hero Image Alt Text (SEO)</label>
                <input
                  type="text"
                  value={hero.imageAlt}
                  onChange={(e) =>
                    setDesignForm({
                      ...designForm,
                      heroDesign: { ...hero, imageAlt: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E0D5] space-y-2">
                  <span className="font-bold text-stone-800 block text-xs">Primary CTA Button</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={hero.primaryCtaText}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="p-2 rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Destination Link (/category/sofas)"
                      value={hero.primaryCtaLink}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, primaryCtaLink: e.target.value },
                        })
                      }
                      className="p-2 rounded-lg border border-stone-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E0D5] space-y-2">
                  <span className="font-bold text-stone-800 block text-xs">Secondary CTA Button</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Button Text"
                      value={hero.secondaryCtaText}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="p-2 rounded-lg border border-stone-300 bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Destination Link (/category/beds-bed-frames)"
                      value={hero.secondaryCtaLink}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          heroDesign: { ...hero, secondaryCtaLink: e.target.value },
                        })
                      }
                      className="p-2 rounded-lg border border-stone-300 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E0D5]">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={hero.showTrustBadges}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        heroDesign: { ...hero, showTrustBadges: e.target.checked },
                      })
                    }
                    className="rounded text-[#A25828]"
                  />
                  <span>Show 10-Year Guarantee &amp; Free Delivery Badges</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={hero.isVisible}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        heroDesign: { ...hero, isVisible: e.target.checked },
                      })
                    }
                    className="rounded text-[#A25828]"
                  />
                  <span>Hero Section Visible</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: MEGA MENU */}
          {activeSubTab === 'megamenu' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#A25828]" />
                <div className="space-y-1">
                  <span className="font-bold block">Mega Menu Promotional Spotlight Standards</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong>Promotional Portrait Banner:</strong> 600 &times; 800px (3:4 ratio), WebP/PNG, max 300KB.
                  </p>
                </div>
              </div>

              {/* Spotlight Banner Card */}
              <div className="p-4 rounded-2xl border border-[#E8E0D5] bg-[#FAF8F5] space-y-3">
                <h4 className="font-bold text-stone-900 text-xs">Menu Promotional Spotlight Card</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Spotlight Title</label>
                    <input
                      type="text"
                      value={mega.promoTitle}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          megaMenuDesign: { ...mega, promoTitle: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Spotlight Tag / Badge</label>
                    <input
                      type="text"
                      value={mega.promoTag}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          megaMenuDesign: { ...mega, promoTag: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold text-[#A25828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Spotlight Photo URL (600 &times; 800px)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mega.promoImage}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          megaMenuDesign: { ...mega, promoImage: e.target.value },
                        })
                      }
                      className="flex-1 p-2.5 rounded-xl border border-stone-300 bg-white font-mono text-[11px]"
                    />
                    <label className="bg-[#A25828] hover:bg-[#8A461A] text-white px-3 py-2.5 rounded-xl font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, 'megaPromo')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={mega.promoLink}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          megaMenuDesign: { ...mega, promoLink: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={mega.promoDescription}
                      onChange={(e) =>
                        setDesignForm({
                          ...designForm,
                          megaMenuDesign: { ...mega, promoDescription: e.target.value },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOOTER */}
          {activeSubTab === 'footer' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Footer Brand Story / About Paragraph
                </label>
                <textarea
                  rows={3}
                  value={footer.aboutText}
                  onChange={(e) =>
                    setDesignForm({
                      ...designForm,
                      footerDesign: { ...footer, aboutText: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-[#D5C7B7] text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Telephone Support Helpline</label>
                  <input
                    type="text"
                    value={footer.phone}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        footerDesign: { ...footer, phone: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Official WhatsApp</label>
                  <input
                    type="text"
                    value={footer.whatsapp}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        footerDesign: { ...footer, whatsapp: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Support Email</label>
                  <input
                    type="email"
                    value={footer.email}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        footerDesign: { ...footer, email: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Dewsbury Workshop Address</label>
                  <input
                    type="text"
                    value={footer.address}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        footerDesign: { ...footer, address: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Copyright Notice Text</label>
                <input
                  type="text"
                  value={footer.copyrightText}
                  onChange={(e) =>
                    setDesignForm({
                      ...designForm,
                      footerDesign: { ...footer, copyrightText: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#D5C7B7]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL SETTINGS */}
          {activeSubTab === 'global' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#A25828]" />
                <div className="space-y-1">
                  <span className="font-bold block">Brand Asset Dimensions</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong>Header/Footer Logo:</strong> 400 &times; 100px (4:1 transparent PNG).<br />
                    <strong>Browser Favicon:</strong> 64 &times; 64px or 32 &times; 32px ICO / PNG.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={designForm.brandName}
                    onChange={(e) => setDesignForm({ ...designForm, brandName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D5C7B7] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Official Logo URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={designForm.logoUrl || ''}
                      onChange={(e) => setDesignForm({ ...designForm, logoUrl: e.target.value })}
                      className="flex-1 p-2.5 rounded-xl border border-stone-300 font-mono text-[11px]"
                    />
                    <label className="bg-[#A25828] hover:bg-[#8A461A] text-white px-3 py-2.5 rounded-xl font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(e, 'logo')}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Logo Preview */}
              {designForm.logoUrl && (
                <div className="p-3 bg-stone-900 rounded-2xl inline-flex items-center justify-center">
                  <img src={designForm.logoUrl} alt="Logo Preview" className="h-10 object-contain" />
                </div>
              )}

              {/* Top Announcement Bar */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E0D5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs">Top Header Announcement Bar</span>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={designForm.isPromoBannerActive}
                      onChange={(e) =>
                        setDesignForm({ ...designForm, isPromoBannerActive: e.target.checked })
                      }
                      className="rounded text-[#A25828]"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={designForm.promoBannerText}
                      onChange={(e) =>
                        setDesignForm({ ...designForm, promoBannerText: e.target.value })
                      }
                      placeholder="e.g. Autumn Living Event: Up to 40% off + Free UK Delivery over £150"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={designForm.announcementLink}
                      onChange={(e) =>
                        setDesignForm({ ...designForm, announcementLink: e.target.value })
                      }
                      placeholder="/shop"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#A25828] hover:bg-[#8A461A] text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Apply Store Design</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
