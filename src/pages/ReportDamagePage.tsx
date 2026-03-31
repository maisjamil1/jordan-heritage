import { useState, useCallback } from 'react';
import { Shield } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DamageForm } from '@/components/report/DamageForm';
import { ConfirmationScreen } from '@/components/report/ConfirmationScreen';

interface SubmittedReport {
  referenceNumber: string;
  siteName: string;
  damageType: string;
  description: string;
  photoName: string | null;
}

function generateReferenceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `DMG-${year}${month}${day}-${random}`;
}

export function ReportDamagePage(): React.ReactElement {
  const [submittedReport, setSubmittedReport] = useState<SubmittedReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    (data: { siteName: string; damageType: string; description: string; photo: File | null; location: string; phone: string }) => {
      setIsSubmitting(true);

      // Simulate a 1.5s server delay
      setTimeout(() => {
        const referenceNumber = generateReferenceNumber();
        setSubmittedReport({
          referenceNumber,
          siteName: data.siteName,
          damageType: data.damageType,
          description: data.description,
          photoName: data.photo?.name ?? null,
        });
        setIsSubmitting(false);
        // Scroll to top after submission
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    },
    []
  );

  const handleNewReport = useCallback(() => {
    setSubmittedReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <SectionHeader
          icon={Shield}
          title="حارس التراث"
          subtitle="الإبلاغ عن الأضرار - ساهم في حماية التراث الأثري الأردني بالإبلاغ عن أي ضرر أو تعدٍّ على المواقع الأثرية"
        />

        {/* Form / Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden">
          {/* Orange gradient header stripe */}
          <div className="h-2 gradient-orange" />

          <div className="p-6 md:p-8">
            {submittedReport ? (
              <ConfirmationScreen
                referenceNumber={submittedReport.referenceNumber}
                submittedData={{
                  siteName: submittedReport.siteName,
                  damageType: submittedReport.damageType,
                  description: submittedReport.description,
                  photoName: submittedReport.photoName,
                }}
                onNewReport={handleNewReport}
              />
            ) : (
              <DamageForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
          </div>
        </div>

        {/* Info hint below form */}
        {!submittedReport && (
          <p className="text-center text-xs text-muted-custom mt-6 animate-fade-in-up">
            جميع البلاغات تتم مراجعتها من قبل دائرة الآثار العامة الأردنية
          </p>
        )}
      </div>
    </section>
  );
}
