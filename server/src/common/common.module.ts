import { Module } from '@nestjs/common';
import { QueryHelperService } from './services/query-helper.service.js';

@Module({
    providers: [QueryHelperService],
    exports: [QueryHelperService]
})
export class CommonModule { }