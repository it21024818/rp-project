import { customsearch } from '@googleapis/customsearch';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import { SearchResult } from './search-result';

@Injectable()
export class NewsSearchService {
  private readonly logger = new Logger(NewsSearchService.name);

  constructor(private readonly configServce: ConfigService) {}

  async performSearch(search: string): Promise<SearchResult[]> {
    this.logger.log(`Performing search for query '${search}'`);
    const response = await customsearch({ version: 'v1' }).cse.list({
      auth: this.configServce.get(ConfigKey.GOOGLE_API_KEY),
      cx: this.configServce.get(ConfigKey.GOOGLE_CUSTOM_SEARCH_ENGINE_ID),
      q: search,
      num: 5,
    });
    const items = response.data.items;
    if (items == undefined || items.length < 1) {
      this.logger.warn(`Found no valid search results for search '${search}'`);
      return [];
    }
    this.logger.log(`Found ${items.length} results for search '${search}'`);
    return items.map(
      item =>
        ({
          title: item.title,
          description: item.snippet,
          link: item.link,
          thumbnail: item?.pagemap?.['cse_thumbnail'],
        } as SearchResult),
    );
  }
}
