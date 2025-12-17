import { ReviewEntity } from 'src/reviews/entities/review.entity.js';
import { UserEntity } from 'src/users/entities/user.entity.js';

export class OutputReviewDto {
    id?: string; 
    productSlug: string; 
    userName: string;
    aggregatedVotes: number;
    images: string[];
    rating: number;
    createdAt: string; 
    updatedAt: string;
    text: string;

    constructor(review: ReviewEntity) {
        this.productSlug = review.product.slug;
        this.userName = review.author.name;
        this.aggregatedVotes = 0; //FIXME: aggregatedVotes logic
        this.images = [];
        if (review.images)
            this.images = review.images.map(i => i.url);
        this.rating = review.rating;
        this.createdAt = review.createdAt.toLocaleString();
        this.updatedAt = review.updatedAt.toLocaleString();
        this.text = review.text;
    }
}