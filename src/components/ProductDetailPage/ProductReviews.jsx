import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import {
    getProductReviews,
    checkReviewEligibility,
    submitProductReview,
} from '@/apis/reviewsService';
import styles from './styles.module.scss';
const RATING_LABELS = {
    5: 'Tuyệt vời',
    4: 'Hài lòng',
    3: 'Bình thường',
    2: 'Không hài lòng',
    1: 'Rất tệ',
};
const EMPTY_STATS = {
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    four_plus_count: 0,
    verified_count: 0,
    satisfied_percent: 0,
};
function formatReviewDate(iso) {
    return new Date(iso).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
function renderStars(rating, size = 'md') {
    const full = Math.round(rating);
    return (
        <span className={size === 'lg' ? styles.starsLg : styles.starsMd} aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= full ? styles.starFilled : styles.starEmpty}>
                    ★
                </span>
            ))}
        </span>
    );
}
function ProductReviews({ productId, onStatsChange }) {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(EMPTY_STATS);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eligibility, setEligibility] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filterStar, setFilterStar] = useState('all');
    const [form, setForm] = useState({ rating: 0, title: '', content: '' });
    const loadReviews = async (cancelledRef) => {
        setLoading(true);
        try {
            const { data } = await getProductReviews(productId);
            if (cancelledRef?.current) return;
            setStats(data.stats ?? EMPTY_STATS);
            setReviews(data.reviews ?? []);
            onStatsChange?.(data.stats ?? EMPTY_STATS);
        } catch {
            if (!cancelledRef?.current) {
                setError('Không tải được đánh giá.');
            }
        } finally {
            if (!cancelledRef?.current) {
                setLoading(false);
            }
        }
    };
    const loadEligibility = async () => {
        if (!isAuthenticated) {
            setEligibility(null);
            return;
        }
        try {
            const { data } = await checkReviewEligibility(productId);
            setEligibility(data);
        } catch {
            setEligibility(null);
        }
    };
    useEffect(() => {
        const cancelledRef = { current: false };
        setTab('overview');
        setShowForm(false);
        setForm({ rating: 0, title: '', content: '' });
        setError('');
        loadReviews(cancelledRef);
        return () => {
            cancelledRef.current = true;
        };
    }, [productId]);
    useEffect(() => {
        if (!authLoading) {
            loadEligibility();
        }
    }, [productId, isAuthenticated, authLoading]);
    const sortedReviews = useMemo(() => {
        let list = [...reviews];
        if (filterStar !== 'all') {
            list = list.filter((r) => r.rating === Number(filterStar));
        }
        if (sortBy === 'highest') {
            list.sort((a, b) => b.rating - a.rating || new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === 'lowest') {
            list.sort((a, b) => a.rating - b.rating || new Date(b.created_at) - new Date(a.created_at));
        } else {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        return list;
    }, [reviews, sortBy, filterStar]);
    const handleWriteReview = () => {
        if (!isAuthenticated) {
            setToast('Vui lòng đăng nhập để đánh giá sản phẩm.');
            setTimeout(() => setToast(''), 3000);
            return;
        }
        if (eligibility?.can_review) {
            setTab('all');
            setShowForm(true);
            return;
        }
        setToast(eligibility?.message || 'Bạn chưa đủ điều kiện để đánh giá sản phẩm này.');
        setTimeout(() => setToast(''), 3500);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.rating < 1) {
            setError('Vui lòng chọn số sao đánh giá.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const { data } = await submitProductReview(productId, form);
            setToast(data.message);
            setShowForm(false);
            setForm({ rating: 0, title: '', content: '' });
            setEligibility({ can_review: false, reason: 'already_reviewed' });
            await loadReviews();
            setTab('all');
            setTimeout(() => setToast(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không gửi được đánh giá.');
        } finally {
            setSubmitting(false);
        }
    };
    const maxDist = Math.max(...Object.values(stats.distribution || {}), 1);
    return (
        <section className={styles.reviewsCard} id="reviews">
            <h2 className={styles.sectionTitle}>Đánh giá từ khách hàng</h2>
            <div className={styles.reviewTabs}>
                <button
                    type="button"
                    className={tab === 'overview' ? styles.reviewTabActive : styles.reviewTab}
                    onClick={() => setTab('overview')}
                >
                    Tổng quan đánh giá
                </button>
                <button
                    type="button"
                    className={tab === 'all' ? styles.reviewTabActive : styles.reviewTab}
                    onClick={() => setTab('all')}
                >
                    Tất cả đánh giá ({stats.total})
                </button>
            </div>
            {toast && <p className={styles.reviewToast}>{toast}</p>}
            {loading ? (
                <p className={styles.reviewsPlaceholder}>Đang tải đánh giá…</p>
            ) : tab === 'overview' ? (
                <div className={styles.reviewOverview}>
                    <div className={styles.reviewSummary}>
                        <p className={styles.reviewAvg}>{stats.average.toFixed(1)}</p>
                        {renderStars(stats.average, 'lg')}
                        <p className={styles.reviewCount}>{stats.total} đánh giá</p>
                    </div>
                    <div className={styles.reviewBars}>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className={styles.reviewBarRow}>
                                <span className={styles.reviewBarLabel}>{star} sao</span>
                                <div className={styles.reviewBarTrack}>
                                    <div
                                        className={styles.reviewBarFill}
                                        style={{
                                            width: `${((stats.distribution[star] || 0) / maxDist) * 100}%`,
                                        }}
                                    />
                                </div>
                                <span className={styles.reviewBarCount}>
                                    {stats.distribution[star] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                    {stats.total > 0 && (
                        <div className={styles.reviewMeta}>
                            <span>{stats.satisfied_percent}% Hài lòng</span>
                            <span>{stats.four_plus_count} 4+ sao</span>
                            <span>{stats.verified_count} Đã mua hàng</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.reviewAll}>
                    {showForm && eligibility?.can_review && (
                        <form className={styles.reviewForm} onSubmit={handleSubmit}>
                            <h4 className={styles.reviewFormTitle}>Viết đánh giá của bạn</h4>
                            {error && <p className={styles.err}>{error}</p>}
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Đánh giá sao <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.starPicker}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={
                                                star <= form.rating
                                                    ? styles.starPickerActive
                                                    : styles.starPickerBtn
                                            }
                                            onClick={() => setForm((f) => ({ ...f, rating: star }))}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    {form.rating > 0 && (
                                        <span className={styles.starPickerLabel}>
                                            {form.rating} sao — {RATING_LABELS[form.rating]}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="review-title">
                                    Tiêu đề đánh giá <span className={styles.required}>*</span>
                                </label>
                                <input
                                    id="review-title"
                                    className={styles.formInput}
                                    maxLength={100}
                                    placeholder="Nhập tiêu đề cho đánh giá của bạn"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, title: e.target.value }))
                                    }
                                    required
                                />
                                <span className={styles.charCount}>{form.title.length}/100</span>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="review-content">
                                    Nội dung đánh giá <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    id="review-content"
                                    className={styles.formTextarea}
                                    maxLength={1000}
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    value={form.content}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, content: e.target.value }))
                                    }
                                    required
                                />
                                <span className={styles.charCount}>{form.content.length}/1000</span>
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.btnCancel}
                                    onClick={() => setShowForm(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnSubmitReview}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang gửi…' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </form>
                    )}
                    <div className={styles.reviewListHeader}>
                        <div className={styles.reviewListTitleRow}>
                            <h3 className={styles.reviewSubTitle}>
                                Đánh giá sản phẩm ({stats.total})
                            </h3>
                            {!showForm && eligibility?.can_review && (
                                <button
                                    type="button"
                                    className={styles.btnWriteReview}
                                    onClick={handleWriteReview}
                                >
                                    Viết đánh giá
                                </button>
                            )}
                        </div>
                        <div className={styles.reviewFilters}>
                            <select
                                className={styles.reviewSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="highest">Cao nhất</option>
                                <option value="lowest">Thấp nhất</option>
                            </select>
                            <select
                                className={styles.reviewSelect}
                                value={filterStar}
                                onChange={(e) => setFilterStar(e.target.value)}
                            >
                                <option value="all">Tất cả sao</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                        </div>
                    </div>
                    {sortedReviews.length === 0 ? (
                        <p className={styles.reviewsPlaceholder}>
                            Chưa có đánh giá nào cho sản phẩm này
                        </p>
                    ) : (
                        <ul className={styles.reviewList}>
                            {sortedReviews.map((review) => (
                                <li key={review.id} className={styles.reviewItem}>
                                    <div className={styles.reviewItemHead}>
                                        <div className={styles.reviewAvatar}>
                                            {review.user?.name?.charAt(0)?.toLowerCase() ?? '?'}
                                        </div>
                                        <div>
                                            <p className={styles.reviewUserName}>
                                                {review.user?.name ?? 'Khách'}
                                            </p>
                                            <div className={styles.reviewItemMeta}>
                                                {renderStars(review.rating)}
                                                <span>{formatReviewDate(review.created_at)}</span>
                                                {review.is_verified_purchase && (
                                                    <span className={styles.badgePurchased}>
                                                        Đã mua hàng
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className={styles.reviewTitle}>{review.title}</p>
                                    <p className={styles.reviewContent}>{review.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
}
export default ProductReviews;

