import { useState, useRef, useCallback, useMemo } from 'react';
import { Camera, Upload, X, Loader2, AlertTriangle, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import sitesData from '@/data/sites.json';
import type { Site } from '@/lib/types';

const DAMAGE_TYPES = [
  { value: 'unauthorized-construction', label: 'بناء غير مرخص' },
  { value: 'unauthorized-excavation', label: 'حفر غير مرخص' },
  { value: 'site-damage', label: 'تلف في الموقع' },
  { value: 'artifact-theft', label: 'سرقة آثار' },
  { value: 'intentional-vandalism', label: 'تخريب متعمد' },
  { value: 'other', label: 'أخرى' },
] as const;

interface DamageFormData {
  siteName: string;
  damageType: string;
  description: string;
  photo: File | null;
  location: string;
  phone: string;
}

interface FormErrors {
  siteName?: string;
  damageType?: string;
  description?: string;
}

interface DamageFormProps {
  onSubmit: (data: DamageFormData) => void;
  isSubmitting: boolean;
}

export function DamageForm({ onSubmit, isSubmitting }: DamageFormProps): React.ReactElement {
  const [formData, setFormData] = useState<DamageFormData>({
    siteName: '',
    damageType: '',
    description: '',
    photo: null,
    location: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sites = useMemo(() => sitesData as Site[], []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.siteName) {
      newErrors.siteName = 'يرجى اختيار الموقع';
    }
    if (!formData.damageType) {
      newErrors.damageType = 'يرجى اختيار نوع الضرر';
    }
    if (!formData.description) {
      newErrors.description = 'يرجى إدخال وصف الضرر';
    } else if (formData.description.length < 10) {
      newErrors.description = 'يجب أن يكون الوصف 10 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.siteName, formData.damageType, formData.description]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    },
    [validateForm, onSubmit, formData]
  );

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFormData((prev) => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const removePhoto = useCallback(() => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} بايت`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} كيلوبايت`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} ميغابايت`;
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="damage-report-form">
      {/* Site Name Select */}
      <div className="space-y-2">
        <Label htmlFor="site-name" className="text-sm font-semibold text-heading">
          <MapPin className="size-4 text-orange" />
          اسم الموقع <span className="text-danger">*</span>
        </Label>
        <Select
          value={formData.siteName}
          onValueChange={(value: string) => {
            setFormData((prev) => ({ ...prev, siteName: value }));
            if (errors.siteName) setErrors((prev) => ({ ...prev, siteName: undefined }));
          }}
        >
          <SelectTrigger
            id="site-name"
            className={`w-full h-11 text-base ${errors.siteName ? 'border-danger ring-danger/20 ring-2' : ''}`}
          >
            <SelectValue placeholder="اختر الموقع الأثري" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.name}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.siteName && (
          <p className="text-sm text-danger flex items-center gap-1.5 animate-fade-in-up">
            <AlertTriangle className="size-3.5" />
            {errors.siteName}
          </p>
        )}
      </div>

      {/* Damage Type Select */}
      <div className="space-y-2">
        <Label htmlFor="damage-type" className="text-sm font-semibold text-heading">
          <AlertTriangle className="size-4 text-orange" />
          نوع الضرر <span className="text-danger">*</span>
        </Label>
        <Select
          value={formData.damageType}
          onValueChange={(value: string) => {
            setFormData((prev) => ({ ...prev, damageType: value }));
            if (errors.damageType) setErrors((prev) => ({ ...prev, damageType: undefined }));
          }}
        >
          <SelectTrigger
            id="damage-type"
            className={`w-full h-11 text-base ${errors.damageType ? 'border-danger ring-danger/20 ring-2' : ''}`}
          >
            <SelectValue placeholder="اختر نوع الضرر" />
          </SelectTrigger>
          <SelectContent>
            {DAMAGE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.label}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.damageType && (
          <p className="text-sm text-danger flex items-center gap-1.5 animate-fade-in-up">
            <AlertTriangle className="size-3.5" />
            {errors.damageType}
          </p>
        )}
      </div>

      {/* Description Textarea */}
      <div className="space-y-2">
        <Label htmlFor="damage-description" className="text-sm font-semibold text-heading">
          <Camera className="size-4 text-orange" />
          وصف الضرر <span className="text-danger">*</span>
        </Label>
        <Textarea
          id="damage-description"
          placeholder="صف الضرر بالتفصيل..."
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }));
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          className={`min-h-[120px] text-base leading-relaxed ${errors.description ? 'border-danger ring-danger/20 ring-2' : ''}`}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-sm text-danger flex items-center gap-1.5 animate-fade-in-up">
              <AlertTriangle className="size-3.5" />
              {errors.description}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-custom">
            {formData.description.length} حرف
          </span>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-heading">
          <Camera className="size-4 text-orange" />
          صورة الضرر
          <span className="text-xs text-muted-custom font-normal me-1">(اختياري)</span>
        </Label>
        
        {!photoPreview ? (
          <div
            role="button"
            tabIndex={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 px-6 cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-orange bg-orange/10 scale-[1.01]'
                : 'border-gray-300 hover:border-orange/50 hover:bg-orange/5'
            }`}
            id="photo-upload-zone"
          >
            <div className={`p-4 rounded-full transition-colors duration-300 ${
              isDragOver ? 'bg-orange/20' : 'bg-gray-100'
            }`}>
              <Upload className={`size-8 transition-colors duration-300 ${
                isDragOver ? 'text-orange' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-heading">
                اسحب الصورة هنا أو انقر للاختيار
              </p>
              <p className="text-xs text-muted-custom mt-1">
                يُفضل إرفاق صورة واضحة للضرر
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
            <img
              src={photoPreview}
              alt="معاينة صورة الضرر"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-3 start-3 p-2 rounded-full bg-black/60 text-white hover:bg-danger transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="إزالة الصورة"
              id="remove-photo-btn"
            >
              <X className="size-4" />
            </button>
            {formData.photo && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-medium">{formData.photo.name}</p>
                <p className="text-white/70 text-xs">{formatFileSize(formData.photo.size)}</p>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="photo-file-input"
        />
      </div>

      {/* Optional: Location */}
      <div className="space-y-2">
        <Label htmlFor="user-location" className="text-sm font-semibold text-heading">
          <MapPin className="size-4 text-blue" />
          موقعك الحالي
          <span className="text-xs text-muted-custom font-normal me-1">(اختياري)</span>
        </Label>
        <Input
          id="user-location"
          placeholder="مثلاً: عمّان - الوسط البلد"
          value={formData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          className="h-11 text-base"
        />
      </div>

      {/* Optional: Phone */}
      <div className="space-y-2">
        <Label htmlFor="user-phone" className="text-sm font-semibold text-heading">
          <Phone className="size-4 text-blue" />
          رقم الهاتف
          <span className="text-xs text-muted-custom font-normal me-1">(اختياري)</span>
        </Label>
        <Input
          id="user-phone"
          type="tel"
          placeholder="07XXXXXXXX"
          value={formData.phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="h-11 text-base"
          dir="ltr"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-bold gradient-orange text-white rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl shadow-orange/25 disabled:opacity-60"
        id="submit-damage-report"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" />
            جارٍ إرسال البلاغ...
          </span>
        ) : (
          'إرسال البلاغ'
        )}
      </Button>
    </form>
  );
}
