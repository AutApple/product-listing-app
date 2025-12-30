import { GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../config/error-messages.config.js';

@Injectable()
export class ImagesS3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    constructor(
        private readonly configService: ConfigService
    ) {
        const awsRegion: string | undefined = this.configService.get<string>('AWS_REGION');
        const awsAccessKey: string | undefined = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const awsSecretAccessKey: string | undefined = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const awsBucket: string | undefined = this.configService.get<string>('AWS_S3_BUCKET');
        const awsEndpoint: string | undefined = this.configService.get<string>('AWS_ENDPOINT');

        if (!awsRegion || !awsAccessKey || !awsSecretAccessKey || !awsBucket || !awsEndpoint)
            throw new Error('Missing AWS config in .env file');

        this.bucketName = awsBucket;

        this.s3Client = new S3Client({
            region: awsRegion,
            endpoint: awsEndpoint,
            credentials: {
                accessKeyId: awsAccessKey,
                secretAccessKey: awsSecretAccessKey,
            },
            forcePathStyle: true,
        });
    }

    async upload(file: Express.Multer.File): Promise<string> {
        if (!file)
            throw new BadRequestException(ERROR_MESSAGES.NO_FILE_PROVIDED());
        const key = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        });
        await this.s3Client.send(command);
        return key;
    }

