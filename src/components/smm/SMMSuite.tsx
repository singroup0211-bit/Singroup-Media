import React, { useState, useMemo } from 'react';
import {
  Share2,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Image as ImageIcon,
  DollarSign,
  User,
  Filter,
  Download,
  X,
  Play,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  SMMCampaign,
  SMMContentItem,
  RetainerPackage,
  SocialPlatform,
  CampaignStatus,
  ContentItemStatus,
  CAMPAIGN_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
  RETAINER_PACKAGE_LABELS,
} from '../../types';
import { SinGroupLogo } from '../common/SinGroupLogo';

const CONTENT_WORKFLOW_COLUMNS: { id: ContentItemStatus; label: string; badgeColor: string }[] = [
  { id: 'Idea', label: 'İdeya və Beyin Həmləsi', badgeColor: 'bg-slate-800 text-slate-300' },
  { id: 'Scripting', label: 'Kopiraytinq və Ssenari', badgeColor: 'bg-blue-500/20 text-blue-300' },
  { id: 'Shooting', label: 'Çəkiliş və İstehsalat', badgeColor: 'bg-purple-500/20 text-purple-300' },
  { id: 'Editing', label: 'Montaj və Hərəkətli Qrafika', badgeColor: 'bg-amber-500/20 text-amber-300' },
  { id: 'Approved', label: 'Müştəri Təsdiqi', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
  { id: 'Scheduled', label: 'Yayıma Hazır / Növbə', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'Published', label: 'Canlı / Paylaşıldı', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
];

export const SMMSuite: React.FC = () => {
  const {
    campaigns,
    addCampaign,
    updateCampaign,
    contentCalendar,
    addContentItem,
    updateContentItem,
    searchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'calendar'>('campaigns');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isAddCampaignModalOpen, setIsAddCampaignModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);

  // Add Campaign form state
  const [campBrand, setCampBrand] = useState('');
  const [campPackage, setCampPackage] = useState<RetainerPackage>('Growth Pro');
  const [campPlatforms, setCampPlatforms] = useState<SocialPlatform[]>(['Instagram', 'TikTok']);
  const [campCreator, setCampCreator] = useState('');
  const [campMediaBuyer, setCampMediaBuyer] = useState('');
  const [campPostQuota, setCampPostQuota] = useState('24');
  const [campReelQuota, setCampReelQuota] = useState('12');
  const [campAdBudget, setCampAdBudget] = useState('3000');
  const [campAudience, setCampAudience] = useState('');
  const [campErrors, setCampErrors] = useState<{ [key: string]: string }>({});

  // Add Content Item form state
  const [cntTitle, setCntTitle] = useState('');
  const [cntCampaignId, setCntCampaignId] = useState(campaigns[0]?.id || '');
  const [cntPlatform, setCntPlatform] = useState<SocialPlatform>('Instagram');
  const [cntType, setCntType] = useState<'Reel' | 'Carousel' | 'Static Post' | 'Story' | 'Shorts'>('Reel');
  const [cntDate, setCntDate] = useState(new Date().toISOString().split('T')[0]);
  const [cntStatus, setCntStatus] = useState<ContentItemStatus>('Idea');
  const [cntCreator, setCntCreator] = useState('');
  const [cntCaption, setCntCaption] = useState('');

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedCreator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedMediaBuyer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPlatform =
        platformFilter === 'All' || c.platforms.includes(platformFilter as SocialPlatform);

      const matchStatus = statusFilter === 'All' || c.campaignStatus === statusFilter;

      return matchSearch && matchPlatform && matchStatus;
    });
  }, [campaigns, searchQuery, platformFilter, statusFilter]);

  // Aggregate metrics
  const totalPostsDelivered = campaigns.reduce((acc, c) => acc + c.postsPublished, 0);
  const totalPostsQuota = campaigns.reduce((acc, c) => acc + c.monthlyPostQuota, 0);
  const totalAdBudget = campaigns.reduce((acc, c) => acc + c.adBudgetAllocated, 0);
  const totalAdSpent = campaigns.reduce((acc, c) => acc + c.adBudgetSpent, 0);

  // Handle Campaign Submit
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!campBrand.trim()) errors.brand = 'Brendin adı tələb olunur';
    if (!campCreator.trim()) errors.creator = 'Kontent menecer tələb olunur';
    if (!campMediaBuyer.trim()) errors.mediaBuyer = 'Media buyer mütəxəssis tələb olunur';
    if (campPlatforms.length === 0) errors.platforms = 'Ən azı bir sosial platforma seçin';

    if (Object.keys(errors).length > 0) {
      setCampErrors(errors);
      return;
    }

    addCampaign({
      brandName: campBrand.trim(),
      retainerPackage: campPackage,
      platforms: campPlatforms,
      assignedCreator: campCreator.trim(),
      assignedMediaBuyer: campMediaBuyer.trim(),
      monthlyPostQuota: Number(campPostQuota) || 24,
      postsPublished: 0,
      reelsQuota: Number(campReelQuota) || 12,
      reelsPublished: 0,
      adBudgetAllocated: Number(campAdBudget) || 2000,
      adBudgetSpent: 0,
      campaignStatus: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      renewalDate: '2026-12-31',
      targetAudience: campAudience.trim() || 'Azərbaycan və Qafqaz regionu üzrə hədəf istehlakçı auditoriyası',
      engagementRate: 4.8,
    });

    setCampBrand('');
    setCampCreator('');
    setCampMediaBuyer('');
    setCampAudience('');
    setCampErrors({});
    setIsAddCampaignModalOpen(false);
  };

  // Handle Content Item Submit
  const handleCreateContentItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cntTitle.trim()) return;

    const chosenCampaign = campaigns.find((c) => c.id === cntCampaignId) || campaigns[0];

    addContentItem({
      campaignId: chosenCampaign?.id || 'SMM-201',
      brandName: chosenCampaign?.brandName || 'Sin Group Müştərisi',
      title: cntTitle.trim(),
      platform: cntPlatform,
      contentType: cntType,
      scheduledDate: cntDate,
      status: cntStatus,
      creator: cntCreator.trim() || chosenCampaign?.assignedCreator || 'Kontent Komandası',
      captionPreview: cntCaption.trim() || 'Sin Group Medya studiyasından tezliklə yeni yaradıcı layihə...',
    });

    setCntTitle('');
    setCntCaption('');
    setIsAddContentModalOpen(false);
  };

  const togglePlatformCheckbox = (platform: SocialPlatform) => {
    setCampPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div id="smm-suite-module" className="space-y-6 pb-12">
      {/* Header with Sin Group Medya Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner shrink-0">
            <SinGroupLogo variant="icon" size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
                Sin Group Medya • Yaradıcı Media
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Sosial Media Marketinq və Hədəfli Reklamlar</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              SMM və Rəqəmsal Marketinq Paneli
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Müştəri kampaniya paketləri, aylıq kontent planı və post kvotalarının idarə edilməsi.
            </p>
          </div>
        </div>

        {/* View Switchers & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              id="smm-tab-campaigns-btn"
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Müştəri Kampaniyaları</span>
            </button>
            <button
              id="smm-tab-calendar-btn"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kontent İş Axını</span>
            </button>
          </div>

          {activeTab === 'campaigns' ? (
            <button
              id="add-smm-campaign-btn"
              onClick={() => setIsAddCampaignModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Müqavilə Əlavə Et</span>
            </button>
          ) : (
            <button
              id="add-content-item-btn"
              onClick={() => setIsAddContentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Kontent Əlavə Et</span>
            </button>
          )}
        </div>
      </div>

      {/* SMM Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Aylıq Kvota İcrası
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-white">
              {totalPostsDelivered} / {totalPostsQuota}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {Math.round((totalPostsDelivered / (totalPostsQuota || 1)) * 100)}% İcra Olunub
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
              style={{ width: `${Math.round((totalPostsDelivered / (totalPostsQuota || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Meta və TikTok Reklam Xərcləri
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-white">
              ${totalAdSpent.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              ayrılmış ${totalAdBudget.toLocaleString()} məbləğindən
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              style={{ width: `${Math.round((totalAdSpent / (totalAdBudget || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Orta İştirak Səviyyəsi (Engagement)
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-rose-400">5.4%</span>
            <span className="text-xs text-emerald-400 font-semibold">+1.2% benchmark</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Instagram Reels, Karusel və TikTok üzrə
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Aktiv Müqavilələr
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-black text-white">{campaigns.length} Brend</span>
            <span className="text-xs text-amber-400 font-semibold">100% Qrafikə Uyğun</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Təyin olunmuş media buyer və kontent yaradıcıları
          </p>
        </div>
      </div>

      {activeTab === 'campaigns' ? (
        /* Client Campaign Tracking Cards & Detailed Table */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Platforma Filtri:</span>
              {[
                { id: 'All', label: 'Hamısı' },
                { id: 'Instagram', label: 'Instagram' },
                { id: 'TikTok', label: 'TikTok' },
                { id: 'LinkedIn', label: 'LinkedIn' },
                { id: 'YouTube', label: 'YouTube' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    platformFilter === p.id
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {filteredCampaigns.length} Müqavilə
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampaigns.map((camp) => {
              const postProgress = Math.round((camp.postsPublished / (camp.monthlyPostQuota || 1)) * 100);
              const reelProgress = Math.round((camp.reelsPublished / (camp.reelsQuota || 1)) * 100);
              const budgetProgress = Math.round((camp.adBudgetSpent / (camp.adBudgetAllocated || 1)) * 100);

              return (
                <div
                  key={camp.id}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Brand and Package */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {camp.id}
                        </span>
                        <h3 className="text-base font-black text-white mt-0.5">{camp.brandName}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {RETAINER_PACKAGE_LABELS[camp.retainerPackage] || camp.retainerPackage}
                      </span>
                    </div>

                    {/* Social Platforms */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {camp.platforms.map((plat) => (
                        <span
                          key={plat}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>

                    {/* Deliverables Quota Status Tracker */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 mb-4">
                      {/* Post Quota */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">Post Kvotası İcrası</span>
                          <span className="font-bold text-slate-200">
                            {camp.postsPublished} / {camp.monthlyPostQuota} paylaşıldı
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${postProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Reels Quota */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">Reels / Shorts Kvotası</span>
                          <span className="font-bold text-slate-200">
                            {camp.reelsPublished} / {camp.reelsQuota} hazırlandı
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${reelProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Ad Budget Spent */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400 font-medium">Xərclənən Reklam Büdcəsi</span>
                          <span className="font-bold text-emerald-400">
                            ${camp.adBudgetSpent.toLocaleString()} / ${camp.adBudgetAllocated.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${budgetProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Assigned Personnel */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">
                          Kontent Menecer:
                        </span>
                        <span className="font-medium text-slate-200 truncate block">
                          {camp.assignedCreator}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500">
                          Media Buyer:
                        </span>
                        <span className="font-medium text-slate-200 truncate block">
                          {camp.assignedMediaBuyer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Müqavilə Statusu:</span>
                    <select
                      value={camp.campaignStatus}
                      onChange={(e) =>
                        updateCampaign(camp.id, { campaignStatus: e.target.value as CampaignStatus })
                      }
                      className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-semibold focus:outline-none focus:border-rose-500"
                    >
                      <option value="Active">Aktiv</option>
                      <option value="Content Approval">Kontent Təsdiqi</option>
                      <option value="Paused">Dayandırılıb</option>
                      <option value="Completed">Tamamlanıb</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Monthly Content Calendar / Workflow Board */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Aylıq Kontent Təqvimi və Studiya İş Axını</h3>
              <p className="text-xs text-slate-400">
                İdeya mərhələsindən müştəri təsdiqinə və paylaşıma qədər yaradıcı prosesi izləyin.
              </p>
            </div>

            <button
              onClick={() => setIsAddContentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Kontent Əlavə Et</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
            {CONTENT_WORKFLOW_COLUMNS.map((col) => {
              const colItems = contentCalendar.filter((item) => item.status === col.id);
              return (
                <div
                  key={col.id}
                  className="rounded-2xl bg-slate-900/50 border border-slate-800 p-3 min-h-[500px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 truncate">{col.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${col.badgeColor}`}>
                      {colItems.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colItems.length === 0 ? (
                      <div className="h-24 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-[11px] text-center p-2">
                        <span>Kontent yoxdur</span>
                      </div>
                    ) : (
                      colItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-bold text-rose-400 truncate">
                              {item.brandName}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {item.platform}
                            </span>
                          </div>

                          <h5 className="font-bold text-white text-xs leading-snug line-clamp-2">
                            {item.title}
                          </h5>

                          <p className="text-slate-400 text-[10px] mt-1.5 line-clamp-2 leading-tight italic">
                            "{item.captionPreview}"
                          </p>

                          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">{item.scheduledDate}</span>
                            <span className="text-slate-300 font-medium">{item.creator}</span>
                          </div>

                          {/* Quick Stage Change */}
                          <div className="mt-2 pt-1.5 border-t border-slate-800/40">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateContentItem(item.id, {
                                  status: e.target.value as ContentItemStatus,
                                })
                              }
                              className="w-full text-[10px] bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-slate-300"
                            >
                              <option value="Idea">İdeya</option>
                              <option value="Scripting">Ssenari</option>
                              <option value="Shooting">Çəkiliş</option>
                              <option value="Editing">Montaj</option>
                              <option value="Approved">Təsdiqləndi</option>
                              <option value="Scheduled">Növbədə</option>
                              <option value="Published">Paylaşıldı</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add SMM Campaign Modal */}
      {isAddCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <SinGroupLogo variant="icon" size="sm" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Yeni SMM Müqaviləsi Əlavə Et</h3>
                  <p className="text-xs text-slate-400">Sin Group Medya Yaradıcı Rəqəmsal Xidmətlər</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCampaignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Brendin Adı *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Baku Premium Auto Lounge"
                    value={campBrand}
                    onChange={(e) => setCampBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {campErrors.brand && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{campErrors.brand}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Müqavilə Paketi
                  </label>
                  <select
                    value={campPackage}
                    onChange={(e) => setCampPackage(e.target.value as RetainerPackage)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Starter Brand">Başlanğıc Brend (14 Post)</option>
                    <option value="Growth Pro">İnkişaf Pro (24 Post + 12 Reels)</option>
                    <option value="Enterprise Scale">Korporativ Miqyas (32 Post + 16 Reels)</option>
                    <option value="Custom 360°">Fərdi 360° Tam Media Həlli</option>
                  </select>
                </div>
              </div>

              {/* Platform selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Əhatə Olunan Sosial Platformalar *
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Facebook'] as SocialPlatform[]).map(
                    (plat) => (
                      <label
                        key={plat}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          campPlatforms.includes(plat)
                            ? 'bg-rose-600/20 border-rose-500 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={campPlatforms.includes(plat)}
                          onChange={() => togglePlatformCheckbox(plat)}
                          className="hidden"
                        />
                        <span>{plat}</span>
                      </label>
                    )
                  )}
                </div>
                {campErrors.platforms && (
                  <span className="text-[10px] text-rose-400 mt-1 block">{campErrors.platforms}</span>
                )}
              </div>

              {/* Assigned Team */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Təhkim Olunmuş Kontent Menecer *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Nigar Səmədova"
                    value={campCreator}
                    onChange={(e) => setCampCreator(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {campErrors.creator && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{campErrors.creator}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Təhkim Olunmuş Media Buyer *
                  </label>
                  <input
                    type="text"
                    placeholder="məs. Rəşad Ələkbərov"
                    value={campMediaBuyer}
                    onChange={(e) => setCampMediaBuyer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  {campErrors.mediaBuyer && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{campErrors.mediaBuyer}</span>
                  )}
                </div>
              </div>

              {/* Monthly Quota & Ad Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Aylıq Post Kvotası
                  </label>
                  <input
                    type="number"
                    value={campPostQuota}
                    onChange={(e) => setCampPostQuota(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Aylıq Reels Kvotası
                  </label>
                  <input
                    type="number"
                    value={campReelQuota}
                    onChange={(e) => setCampReelQuota(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Reklam Büdcəsi ($ / ay)
                  </label>
                  <input
                    type="number"
                    value={campAdBudget}
                    onChange={(e) => setCampAdBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Hədəf Kütlə və Demoqrafiya
                </label>
                <input
                  type="text"
                  placeholder="məs. Gənc mütəxəssislər (22-40), premium alıcılar"
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCampaignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40"
                >
                  Müqavilə Yarat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Content Item Modal */}
      {isAddContentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <SinGroupLogo variant="icon" size="sm" />
                <h3 className="text-base font-bold text-white">Yeni Studiya Kontenti Əlavə Et</h3>
              </div>
              <button
                onClick={() => setIsAddContentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContentItem} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Kontentin Başlığı / İdeya *
                </label>
                <input
                  type="text"
                  placeholder="məs. Qürub Çağı Dron Çəkilişi və Şəhər Mənzərəsi"
                  value={cntTitle}
                  onChange={(e) => setCntTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Brend Kampaniyası
                  </label>
                  <select
                    value={cntCampaignId}
                    onChange={(e) => setCntCampaignId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sosial Platforma</label>
                  <select
                    value={cntPlatform}
                    onChange={(e) => setCntPlatform(e.target.value as SocialPlatform)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Kontent Formatı
                  </label>
                  <select
                    value={cntType}
                    onChange={(e) => setCntType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Reel">Reel / Video</option>
                    <option value="Carousel">Karusel</option>
                    <option value="Static Post">Statik Post</option>
                    <option value="Story">Story / Hekayə</option>
                    <option value="Shorts">Shorts / Qısa Video</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    İş Axını Mərhələsi
                  </label>
                  <select
                    value={cntStatus}
                    onChange={(e) => setCntStatus(e.target.value as ContentItemStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Idea">İdeya</option>
                    <option value="Scripting">Ssenari</option>
                    <option value="Shooting">Çəkiliş</option>
                    <option value="Editing">Montaj</option>
                    <option value="Approved">Təsdiqləndi</option>
                    <option value="Scheduled">Növbədə</option>
                    <option value="Published">Paylaşıldı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Post Mətni / Giriş (Hook) İcmalı
                </label>
                <textarea
                  rows={2}
                  placeholder="İlk 3 saniyəlik giriş fikri və cəlbedici post mətni..."
                  value={cntCaption}
                  onChange={(e) => setCntCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddContentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/40"
                >
                  Kontenti Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
