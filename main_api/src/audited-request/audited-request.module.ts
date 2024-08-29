import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuditedRequestController } from './audited-request.controller';
import { AuditedRequest, AuditedRequestSchema } from './audited-request.schema';
import { AuditedRequestService } from './audited-request.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditedRequest.name, schema: AuditedRequestSchema }]), AuthModule],
  providers: [AuditedRequestService],
  exports: [MongooseModule, AuditedRequestService], // If we dont export this the DI fails
  controllers: [AuditedRequestController],
})
export class AuditedRequestModule {}
