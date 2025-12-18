import { ReviewView } from 'src/reviews/views/review.view.js';

export class OutputReviewDto {
    id?: string; 
    productSlug: string; 
    userName: string;
    aggregatedReviewScore: number;
    images: string[];
    rating: number;
    createdAt: string; 
    updatedAt: string;
    text: string;

    constructor(review: ReviewView) {
        this.id = review.id;
        this.productSlug = review.productSlug;
        this.userName = review.userName;
        this.aggregatedReviewScore = review.reviewVoteScore ?? 0;
        this.images = [];
        if (review.images)
            this.images = review.images.map(i => i.url);
        this.rating = review.rating;
        this.createdAt = review.createdAt.toLocaleString();
        this.updatedAt = review.updatedAt.toLocaleString();
        this.text = review.text;
    }
}