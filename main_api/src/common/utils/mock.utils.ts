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
      deleteMany: jest.fn(),
      create: jest.fn(),
      exec: jest.fn(),
    };
  }

  static mockClass<T>(clazz: new (...args: any) => T): T {
    const methods = Object.getOwnPropertyNames(clazz.prototype);
    const object = methods.reduce(
      (prev, crnt) => ({
        ...prev,
        [crnt]: jest.fn(),
      }),
      {} as T,
    );
    return object;
  }
}
