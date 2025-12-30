import { ViewColumn, ViewEntity } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity.js';
import { VoteType } from '../entities/review-vote.entity.js';

@ViewEntity({
  name: 'review_view',
  expression: `
    SELECT
      r.id,
      r.rating,
      r.text,
      r.created_at AS "createdAt",
      r.updated_at AS "updatedAt",
      r."authorId",
      r."productId",
      
      u.name AS "userName",
      u.email AS "userEmail",
      
      p.slug AS "productSlug",
      
      COALESCE(
        SUM(
          CASE rv.vote
            WHEN '${VoteType.UPVOTE}'  THEN 1
            WHEN '${VoteType.DOWNVOTE}' THEN -1
            ELSE 0
          END
        ),
        0
      ) AS "reviewVoteScore",
      
      COALESCE(
        (
          SELECT json_agg(json_build_object('slug', ri.slug))
          FROM images ri
          WHERE ri."reviewId" = r.id
          AND ri.slug IS NOT NULL
        ),
        '[]'::json
      ) AS images
    
    FROM reviews r
    
    LEFT JOIN users u ON u.id = r."authorId"
    LEFT JOIN products p ON p.id = r."productId"
    LEFT JOIN review_votes rv ON rv."reviewId" = r.id
    
    GROUP BY 
      r.id, 
      r.rating, 
      r.text, 
      r.created_at, 
      r.updated_at,
      r."authorId",
      r."productId",
      u.name,
      u.email,
      p.slug
  `,
})
export class ReviewView {
  @ViewColumn()
  id: string;

  @ViewColumn()
  rating: number;

  @ViewColumn()
  text: string;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  authorId: string;

  @ViewColumn()
  productId: string;

  @ViewColumn()
  userName: string;

  @ViewColumn()
  userEmail: string;

  @ViewColumn()
  productSlug: string;

  @ViewColumn()
  reviewVoteScore: number;

  @ViewColumn()
  images: Array<{ slug: string }>; 

  public static generateFromEntity (entity: ReviewEntity) {
    const rv = new ReviewView();

    rv.id = entity.id;
    rv.productSlug = entity.product.slug; 
    rv.userName = entity.author.name;
    rv.userEmail = entity.author.email;
    rv.reviewVoteScore = 0;
    rv.text = entity.text;
    rv.rating = entity.rating;
    rv.images = entity.images;
    rv.createdAt = entity.createdAt;
    rv.updatedAt = entity.updatedAt;

    return rv;
  }
}
