import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditedRequest, AuditedRequestSchema } from './audited-request.schema';
import { AuditedRequestService } from './audited-request.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditedRequest.name, schema: AuditedRequestSchema }])],
  providers: [AuditedRequestService],
})
export class AuditedRequestModule {}
