import { Model } from 'mongoose';
import { PageRequest } from '../dtos/page-request.dto';
import { QueryUtil } from './query.util';
import { PageUtil } from './page.util';

export class MongooseUtil {
  static async getDocumentPage<T>(
    model: Model<T>,
    { pageNum = 1, pageSize = 10, filter, sort }: PageRequest,
  ) {
    try {
      const [content, totalDocuments] = await Promise.all([
        model
          .find(QueryUtil.buildQueryFromFilter(filter))
          .sort(QueryUtil.buildSort(sort))
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize),
        model.count(),
      ]);
      const jsonContent = content.map((doc) => doc.toJSON());
      const page = PageUtil.buildPage(jsonContent, {
        pageNum,
        pageSize,
        totalDocuments,
        sort,
      });
      return page;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
