import { IsArray, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    productSlug: string;
    
    @IsNumber()
    @Max(5.0)
    @Min(1.0)
    rating: number;
 
    @IsString()
    text: string; 

    @IsArray()
    @IsString({each: true}) // FIXME: IsUrl in production
    images: string[];
}
