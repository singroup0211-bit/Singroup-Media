import React from 'react';
import {
  Code2,
  Share2,
  TrendingUp,
  GraduationCap,
  X,
  Plus,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppModule } from '../../types';
import { SinGroupLogo } from './SinGroupLogo';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCreateModal: React.FC<QuickCreateModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentModule } = useApp();

  if (!isOpen) return null;

  const handleSelect = (module: AppModule) => {
    setCurrentModule(module);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <SinGroupLogo variant="icon" size="sm" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sürətli Əməliyyat Yaradıcısı</h3>
              <p className="text-xs text-slate-400">Başlamaq istədiyiniz əməliyyatı seçin</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          <button
            onClick={() => handleSelect('dev-hub')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                  Yeni Proqram Layihəsi
                </h4>
                <p className="text-[11px] text-slate-400">
                  Veb, Daxili ERP/CRM və ya Mobil tətbiq həlli
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleSelect('smm')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                  Yeni SMM Kampaniyası
                </h4>
                <p className="text-[11px] text-slate-400">
                  Sosial media paylaşımları, reels kvotası &amp; reklamlar
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleSelect('sales')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Yeni Satış Təması / Müştəri
                </h4>
                <p className="text-[11px] text-slate-400">
                  Əlaqə cəhdini və ya korporativ müştərini qeyd edin
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleSelect('academy')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Akademiya Tələbəsi Qeydiyyatı
                </h4>
                <p className="text-[11px] text-slate-400">
                  SMM, Data Analitikası və ya AI qrupuna təyin edin
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleSelect('payroll')}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Əməkhaqqı və Faiz Hesablanması
                </h4>
                <p className="text-[11px] text-slate-400">
                  20% Satış, 10% Veb (Front/Back) və 40% Müəllimlər üzrə hesablama
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
