export class MockUtils {
  static mockModel(value: any) {
    return {
      new: jest.fn().mockResolvedValue(value),
      constructor: jest.fn().mockResolvedValue(value),
      findById: jest.fn(),
      aggregate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    };
  }
}
