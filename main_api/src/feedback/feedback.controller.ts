import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { PageRequest } from "src/common/dtos/page-request.dto";
import { ValidateObjectIdPipe } from "src/common/pipes/validate-object-id.pipe";
import { FlatUser } from "src/users/user.schema";
import { User } from "src/common/decorators/user.decorator";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "src/common/dtos/create-feedback-dto";

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get(":id")
  async getfeedback(@Param("id", ValidateObjectIdPipe) id: string) {
    return await this.feedbackService.getFeedback(id);
  }

  @Delete(":id")
  async deletefeedback(@Param("id", ValidateObjectIdPipe) id: string) {
    return await this.feedbackService.deleteFeedback(id);
  }

  @Post()
  async createfeedback(
    @User("_id") userId: string,
    @Query("prediction-id", ValidateObjectIdPipe) predictionId: string,
    @Body()
    { details, reaction }: CreateFeedbackDto
  ) {
    return await this.feedbackService.createFeedback(
      details,
      reaction,
      predictionId,
      userId
    );
  }

  @Put(":id")
  async updateFeedback(
    @Param("id", ValidateObjectIdPipe) id: string,
    @User("_id") userId: string,
    @Body()
    { details, reaction }: CreateFeedbackDto
  ) {
    return await this.feedbackService.updateFeedback(
      id,
      reaction,
      details,
      userId
    );
  }

  @Get("search")
  async getfeedbackPage(@Body() pageRequest: PageRequest) {
    return await this.feedbackService.getFeedbackPage(pageRequest);
  }
}
