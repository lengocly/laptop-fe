import axiosClient from './axiosClient';
export function getProductReviews(productId) {
    return axiosClient.get(`/products/${productId}/reviews`);
}
export function checkReviewEligibility(productId) {
    return axiosClient.get(`/products/${productId}/reviews/eligibility`);
}
export function submitProductReview(productId, payload) {
    return axiosClient.post(`/products/${productId}/reviews`, payload);
}

