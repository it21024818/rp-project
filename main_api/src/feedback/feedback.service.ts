import { BadRequestException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackDetails } from 'src/common/dtos/feedback-details.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { Reaction } from 'src/common/enums/reaction.enum';
import { CoreService } from 'src/core/core.service';
import { Prediction } from 'src/prediction/prediction.schema';
import { PredictionService } from 'src/prediction/prediction.service';
import { Feedback, FeedbackDocument } from './feedback.schema';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    private coreService: CoreService,
    @Inject(forwardRef(() => PredictionService))
    private predictionService: PredictionService,
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<Feedback>,
  ) {}

  async getFeedback(id: string) {
    this.logger.log(`Attempting to find feedback with id ${id}`);
    const foundFeedback = await this.feedbackModel.findById(id);

    if (foundFeedback == null) {
      this.logger.warn(`Could not find an existing Feedback with id '${id}'`);
      throw new BadRequestException(ErrorMessage.FEEDBACK_NOT_FOUND, {
        description: `Feedback with id '${id}' was not found`,
      });
    }

    return foundFeedback;
  }

  async getFeedbackDetails(id: string): Promise<[Feedback, Prediction]> {
    const feedback = await this.getFeedback(id);
    const prediction = await this.predictionService.getPrediction(feedback.predictionId);
    return [feedback, prediction];
  }

  async getByCreatedBy(createdBy: string) {
    this.logger.log(`Attempting to find feedback that were created by ${createdBy}`);
    const foundPredictions = await this.feedbackModel.find({ createdBy });
    this.logger.log(`Found ${foundPredictions.length} feedback that were created by ${createdBy}`);
    return foundPredictions;
  }

  async getFeedbackByPredictionId(id: string) {
    this.logger.log(`Attempting to find feedback with prediction-id ${id}`);
    const foundFeedback = await this.feedbackModel.find({ predictionId: id });
    return foundFeedback;
  }

  async deleteFeedback(id: string) {
    this.logger.log(`Attempting to find Feedback with id '${id}'`);
    const deletedFeedback = await this.feedbackModel.findByIdAndDelete(id);

    if (deletedFeedback === null) {
      this.logger.warn(`Could not find an existing Feedback with id '${id}'`);
      throw new BadRequestException(ErrorMessage.FEEDBACK_NOT_FOUND, {
        description: `Feedback with id '${id}' was not found`,
      });
    }

    this.logger.log(`Deleted Feedback with id '${id}'`);
  }

  async deleteFeedbackByPredictionId(id: string) {
    this.logger.log(`Attempting to delete feedback(s) with prediction id'${id}'`);
    const deletedFeedback = await this.feedbackModel.deleteMany({ predictionId: id });
    this.logger.log(`Deleted ${deletedFeedback.deletedCount} feedback(s) with id '${id}'`);
  }

  async createFeedback(
    feedback: FeedbackDetails,
    reaction: Reaction,
    predictionId: string,
    userId: string,
  ): Promise<FeedbackDocument> {
    this.logger.log(`Creating new Feedback record from user ${userId} for prediction ${predictionId}`);

    this.predictionService.getPrediction(predictionId);
    this.logger.log(`Validating prediction ${predictionId} exists`);

    const feedbackMatch = await this.feedbackModel.findOne({
      predictionId,
      createdBy: userId,
    });
    if (feedbackMatch) {
      this.logger.warn(`Feedback ${feedbackMatch.id} has already been left by user ${userId}`);
      throw new BadRequestException(ErrorMessage.FEEDBACK_ALREADY_EXISTS, {
        description: `Feedback ${feedbackMatch.id} has already been left by user ${userId}`,
      });
    }

    const newFeedback: Feedback = {
      createdAt: new Date(),
      createdBy: userId,
      details: feedback,
      reaction: reaction,
      predictionId: predictionId,
    };

    const savedFeedback = await new this.feedbackModel(newFeedback).save();
    return savedFeedback;
  }

  async updateFeedback(id: string, reaction: Reaction, feedback: FeedbackDetails, userId: string) {
    this.logger.log(`Updating feedback record ${id}`);

    const existingFeedback = await this.getFeedback(id);
    if (existingFeedback.createdBy != userId) {
      this.logger.warn(`Feedback ${existingFeedback.id} does not belong to user ${userId}`);
      throw new BadRequestException(ErrorMessage.OWNERSHIP_NOT_VERIFIED, {
        description: `Feedback ${existingFeedback.id} does not belong to user ${userId}`,
      });
    }

    existingFeedback.reaction = reaction;
    existingFeedback.details = feedback;
    const savedFeedback = await existingFeedback.save();

    return savedFeedback;
  }

  async getFeedbackPage(pageRequest: PageRequest) {
    return await this.coreService.getDocumentPage(this.feedbackModel, pageRequest);
  }

  async getAnalytics(
    startDate: Date,
    endDate: Date,
    frequency: Frequency,
  ): Promise<TimeBasedAnalytics<'good' | 'bad'>> {
    return await this.coreService.getOptimizedTimeBasedAnalytics({
      model: this.feedbackModel,
      options: {
        startDate,
        endDate,
        frequency,
      },
      fields: {
        bad: { path: 'reaction', value: Reaction.BAD },
        good: { path: 'reaction', value: Reaction.GOOD },
      },
    });
  }
}
