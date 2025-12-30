import { ApiProperty } from '@nestjs/swagger';
import { ReviewView } from 'src/reviews/views/review.view.js';

export class OutputReviewDto {
    @ApiProperty({
        name: 'id',
        description: 'Id of a review'
    })
    id?: string; 

    @ApiProperty({
        name: 'productSlug',
        description: 'Slug of a product'
    })
    productSlug: string;

    @ApiProperty({
        name: 'userName',
        description: 'Review\'s author name'
    })
    userName: string;
    
    @ApiProperty({
        name: 'aggregatedReviewScore',
        description: 'Aggregated user score of a review (total sum of upvotes/downvotes)',
        type: 'number'
    })
    aggregatedReviewScore: number;

    @ApiProperty({
        name: 'images',
        description: 'Image slugs',
        type: [String]
    })
    imageSlugs: string[];

    @ApiProperty({
        name: 'rating',
        description: 'Review\'s product rating',
        type: 'number'
    })
    rating: number;

    @ApiProperty({
        name: 'createdAt',
        description: 'Review creation date',
        type: 'string'
    })
    createdAt: string; 

    @ApiProperty({
        name: 'updatedAt',
        description: 'Last review update date',
        type: 'string'
    })
    updatedAt: string;

    @ApiProperty({
        name: 'text',
        description: 'Text of a review',
        type: 'string'
    })
    text: string;

    constructor(review: ReviewView) {
        this.id = review.id;
        this.productSlug = review.productSlug;
        this.userName = review.userName;
        this.aggregatedReviewScore = review.reviewVoteScore ?? 0;
        this.imageSlugs = [];
        if (review.images)
            this.imageSlugs = review.images.map(i => i.slug);
        this.rating = review.rating;
        this.createdAt = review.createdAt.toLocaleString();
        this.updatedAt = review.updatedAt.toLocaleString();
        this.text = review.text;
    }
}