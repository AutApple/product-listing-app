import { Module } from '@nestjs/common';
import { QueryHelperService } from './services/QueryHelperService.js';

@Module({
    providers: [QueryHelperService],
    exports: [QueryHelperService]
})
export class CommonModule { }