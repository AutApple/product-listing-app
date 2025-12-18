import { ReviewEntity } from 'src/reviews/entities/review.entity.js';

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

    constructor(review: ReviewEntity) {
        this.id = review.id;
        this.productSlug = review.product.slug;
        this.userName = review.author.name;
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