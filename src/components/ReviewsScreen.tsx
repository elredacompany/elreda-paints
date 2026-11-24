import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  Quote,
  Sparkles,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  Send,
} from 'lucide-react';
import { REVIEWS_DATA } from '../data/trustData';
import { ReviewItem, Screen } from '../types';
import { fetchReviewsFromFirestore, createReviewInFirestore } from '../services/firebase';

interface ReviewsScreenProps {
  onBackToHome: () => void;
  onNavigateToContact: () => void;
  onNavigate: (screen: Screen) => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  onBackToHome,
  onNavigateToContact,
  onNavigate,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [showAddReviewModal, setShowAddReviewModal] = useState<boolean>(false);
  const [newReviewerName, setNewReviewerName] = useState<string>('');
  const [newReviewerProject, setNewReviewerProject] = useState<string>('');
  const [newReviewerComment, setNewReviewerComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchReviewsFromFirestore().then((res) => {
      if (isMounted && res.data.length > 0) {
        setReviews(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerComment.trim() || isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError(null);

    try {
      const result = await createReviewInFirestore({
        name: newReviewerName.trim(),
        project: newReviewerProject.trim() || 'تشطيب دهانات سكنية',
        location: 'القاهرة',
        rating: newRating,
        comment: newReviewerComment.trim(),
      });

      if (result.success && result.data) {
        setReviews((prev) => [result.data!, ...prev]);
        setShowAddReviewModal(false);
        setNewReviewerName('');
        setNewReviewerProject('');
        setNewReviewerComment('');
        setNewRating(5);
        setSubmittedFeedback(true);
        setTimeout(() => setSubmittedFeedback(false), 3000);
      } else {
        setReviewError('تعذر نشر التقييم حالياً، يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setReviewError('حدث خطأ أثناء حفظ التقييم، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 text-[#1c1917] max-w-4xl mx-auto">
      {/* 1. Header with Back Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#c87a3e]/30 shadow-xl shadow-[#c87a3e]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black shadow-md shadow-[#c87a3e]/25 shrink-0">
            <Star className="w-6 h-6 stroke-[2.3] fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#a85a22] bg-[#faf5f0] border border-[#c87a3e]/30 px-2.5 py-0.5 rounded-full shadow-sm">
                تقييمات حقيقية 100%
              </span>
              <span className="text-xs text-[#78716c] font-medium">سجل الثقة والأمانة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c1917] mt-1">
              آراء عملائنا وتجاربهم
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c]">
              شهادات عملائنا السابقين الذين وثقوا في شركة الرضا للدهانات والديكورات
            </p>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white hover:bg-[#faf5f0] text-[#a85a22] border border-[#c87a3e]/30 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </button>
      </div>

      {/* 2. Trust Metrics Summary Banner */}
      <div className="bg-[#faf5f0] p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/35 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="text-center p-3 bg-white rounded-2xl border border-[#c87a3e]/30 shrink-0 min-w-[90px] shadow-sm">
            <span className="text-3xl sm:text-4xl font-black text-[#a85a22]">
              4.9
            </span>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-[10px] text-[#78716c] block mt-1 font-medium">من 5 نجوم</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-[#1c1917]">
              ثقة نعتز بها في كل شقة وفيلا
            </h2>
            <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed max-w-md">
              نلتزم بأعلى معايير النظافة والالتزام بالمواعيد المحددة واستخدام الخامات الأصلية مع ضمان جودة يدوم لسنوات.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddReviewModal(true)}
            className="px-4 py-3 rounded-2xl bg-white hover:bg-[#faf5f0] text-[#a85a22] text-xs sm:text-sm font-extrabold border border-[#c87a3e]/30 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#a85a22]" />
            <span>أضف تقييمك</span>
          </button>

          <button
            onClick={onNavigateToContact}
            className="px-5 py-3 rounded-2xl copper-btn-gradient text-white font-black text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-md shadow-[#c87a3e]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>طلب معاينة لشقتك</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {submittedFeedback && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>شكراً لك! تم إضافة تقييمك بنجاح وسيظهر لجميع العملاء.</span>
        </div>
      )}

      {/* 3. Add Review Form */}
      {showAddReviewModal && (
        <form
          onSubmit={handleAddReview}
          className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#c87a3e]/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <h3 className="font-extrabold text-[#1c1917] text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#a85a22]" />
              <span>مشاركة تجربة تشطيبك مع شركة الرضا</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddReviewModal(false)}
              className="text-xs text-[#78716c] hover:text-[#1c1917]"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1c1917] mb-1">
                اسمك الكريم <span className="text-[#a85a22]">*</span>
              </label>
              <input
                type="text"
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                placeholder="مثال: أ. محمد عبد الله"
                className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-[#1c1917] focus:outline-none focus:border-[#a85a22] shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c1917] mb-1">
                نوع المشروع أو المنطقة
              </label>
              <input
                type="text"
                value={newReviewerProject}
                onChange={(e) => setNewReviewerProject(e.target.value)}
                placeholder="مثال: تشطيب شقة بالتجمع الخامس"
                className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-[#1c1917] focus:outline-none focus:border-[#a85a22] shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c1917] mb-1">
              التقييم (النجوم)
            </label>
            <div className="flex items-center gap-1.5 p-2 bg-[#faf5f0] rounded-xl border border-[#c87a3e]/25 w-max">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 text-amber-500 hover:scale-115 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#a85a22] mr-2">{newRating} من 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1c1917] mb-1">
              رأيك في جودة الشغل والمواعيد <span className="text-[#a85a22]">*</span>
            </label>
            <textarea
              rows={3}
              value={newReviewerComment}
              onChange={(e) => setNewReviewerComment(e.target.value)}
              placeholder="اكتب تجربتك مع فريق وصناع شركة الرضا..."
              className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-xs font-medium text-[#1c1917] focus:outline-none focus:border-[#a85a22] shadow-sm"
              required
            ></textarea>
          </div>

          {reviewError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold">
              {reviewError}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddReviewModal(false)}
              className="px-4 py-2.5 rounded-xl bg-[#faf5f0] text-[#78716c] hover:text-[#1c1917] text-xs font-bold border border-neutral-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-5 py-2.5 rounded-xl copper-btn-gradient text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingReview ? 'جاري النشر...' : 'نشر التقييم فوراً'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Client Reviews Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-[#1c1917] flex items-center gap-2 px-1">
          <ThumbsUp className="w-4 h-4 text-[#a85a22]" />
          <span>تجارب موثقة من أصحاب الشقق والفلل:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#c87a3e]/25 hover:border-[#a85a22] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-3.5 group relative overflow-hidden"
            >
              <Quote className="absolute top-4 left-4 w-10 h-10 text-neutral-200 pointer-events-none group-hover:text-[#c87a3e]/20 transition-colors" />

              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl copper-btn-gradient text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-[#1c1917] text-sm sm:text-base group-hover:text-[#a85a22] transition-colors">
                        {rev.name}
                      </h4>
                      {rev.verified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>عميل معتمد</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#78716c] font-medium block mt-0.5">
                      {rev.project} • {rev.location}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-500 shrink-0 bg-[#faf5f0] px-2 py-1 rounded-xl border border-[#c87a3e]/20 shadow-sm">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              {/* Review Comment Body */}
              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed font-medium pt-1">
                "{rev.comment}"
              </p>

              {/* Footer info */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#78716c] font-medium">
                <span className="flex items-center gap-1 text-[#a85a22]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a85a22]" />
                  <span>تم التنفيذ بواسطة فريق شركة الرضا</span>
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
