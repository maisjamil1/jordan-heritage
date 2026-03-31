import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Copy, FileText, Image, MapPin, AlertTriangle, Home, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmittedData {
  siteName: string;
  damageType: string;
  description: string;
  photoName: string | null;
}

interface ConfirmationScreenProps {
  referenceNumber: string;
  submittedData: SubmittedData;
  onNewReport: () => void;
}

export function ConfirmationScreen({
  referenceNumber,
  submittedData,
  onNewReport,
}: ConfirmationScreenProps): React.ReactElement {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const copyReferenceNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = referenceNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [referenceNumber]);

  const truncatedDescription =
    submittedData.description.length > 50
      ? `${submittedData.description.slice(0, 50)}...`
      : submittedData.description;

  return (
    <div className="text-center space-y-8">
      {/* Success Icon with Pulse Animation */}
      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-28 rounded-full bg-success/10 animate-ping" />
        </div>
        <div className="relative z-10 p-5 rounded-full bg-gradient-to-br from-success to-emerald-600 shadow-lg shadow-success/30">
          <CheckCircle2 className="size-14 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Success Message */}
      <div
        className={`space-y-2 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-heading">
          تم إرسال البلاغ بنجاح
        </h2>
        <p className="text-body text-base">
          شكراً لك على المساهمة في حماية التراث الأردني
          - لقد حصلت عل ١٠ نقاط
        </p>
      </div>

      {/* Reference Number Card */}
      <div
        className={`bg-gradient-to-br from-orange/5 to-blue/5 rounded-2xl p-6 border border-orange/20 transition-all duration-700 delay-200 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-sm text-muted-custom mb-2">رقم المرجع الخاص بك</p>
        <div className="flex items-center justify-center gap-3">
          <span
            className="text-3xl md:text-4xl font-black text-orange tracking-wider font-mono"
            dir="ltr"
            id="reference-number"
          >
            {referenceNumber}
          </span>
          <button
            type="button"
            onClick={copyReferenceNumber}
            className="p-2 rounded-lg hover:bg-orange/10 transition-colors cursor-pointer"
            title="نسخ رقم المرجع"
            id="copy-reference-btn"
          >
            <Copy className={`size-5 transition-colors ${copied ? 'text-success' : 'text-orange'}`} />
          </button>
        </div>
        {copied && (
          <p className="text-sm text-success mt-2 animate-fade-in-up">تم النسخ ✓</p>
        )}
        <p className="text-xs text-muted-custom mt-3 flex items-center justify-center gap-1.5">
          <AlertTriangle className="size-3.5 text-warning" />
          احتفظ برقم المرجع لمتابعة حالة البلاغ
        </p>
      </div>

      {/* Submitted Data Summary */}
      <div
        className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-700 delay-400 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-heading">ملخص البلاغ</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <SummaryRow
            icon={MapPin}
            label="الموقع"
            value={submittedData.siteName}
            iconColor="text-orange"
          />
          <SummaryRow
            icon={AlertTriangle}
            label="نوع الضرر"
            value={submittedData.damageType}
            iconColor="text-danger"
          />
          <SummaryRow
            icon={FileText}
            label="الوصف"
            value={truncatedDescription}
            iconColor="text-blue"
          />
          {submittedData.photoName && (
            <SummaryRow
              icon={Image}
              label="الصورة"
              value={submittedData.photoName}
              iconColor="text-success"
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Button
          onClick={onNewReport}
          variant="outline"
          className="flex-1 h-12 text-base font-bold rounded-xl gap-2 border-orange text-orange hover:bg-orange/5 cursor-pointer"
          id="new-report-btn"
        >
          <PlusCircle className="size-5" />
          إبلاغ جديد
        </Button>
        <Button
          onClick={() => navigate('/')}
          className="flex-1 h-12 text-base font-bold gradient-blue text-white rounded-xl gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          id="go-home-btn"
        >
          <Home className="size-5" />
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );
}

/* ─── Summary Row Helper ─── */
import type { LucideIcon } from 'lucide-react';

interface SummaryRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColor: string;
}

function SummaryRow({ icon: Icon, label, value, iconColor }: SummaryRowProps): React.ReactElement {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <Icon className={`size-4 shrink-0 ${iconColor}`} />
      <span className="text-sm text-muted-custom shrink-0">{label}:</span>
      <span className="text-sm font-medium text-heading truncate">{value}</span>
    </div>
  );
}
