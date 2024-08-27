import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Migration as MigrationEntity } from 'src/migrations/migration.schema';

const MIGRATION_MODEL_FIELD_NAME = 'migrationModel';

export function Migration(key: string) {
  const injectModel = InjectModel(Migration.name);
  return (target: any, _propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    injectModel(target, MIGRATION_MODEL_FIELD_NAME);
    const logger = new Logger('Migration'); // For logging migration execution
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]) {
      // Arrow notation doesnt work here WTF
      try {
        const migrationModel: Model<MigrationEntity> = this[MIGRATION_MODEL_FIELD_NAME];

        // Check if this migration has run before
        const existingMigrationRecord = await migrationModel.findOne({ key });
        if (existingMigrationRecord) {
          logger.warn(`SKIPPED [${key}] in class [${target.constructor.name}]`);
        } else {
          // Run migration
          const result = await originalMethod.apply(this, args);
          logger.log(`EXECUTED [${key}] in class [${target.constructor.name}]`);

          // Save migration record
          await new migrationModel({
            createdAt: new Date(),
            createdBy: 'MIGRATION',
            className: target.constructor.name,
            key: key,
          }).save();

          return result;
        }
      } catch (error) {
        logger.error(`FAILED [${key}] in class [${target.constructor.name}]`, error.message, error.stack);
      }
    };
  };
}
