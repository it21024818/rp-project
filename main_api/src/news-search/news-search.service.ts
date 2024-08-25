import { Injectable, Logger } from "@nestjs/common";
import { customsearch } from "@googleapis/customsearch";
import { SearchResult } from "./search-result";

@Injectable()
export class NewsSearchService {
  private readonly logger = new Logger(NewsSearchService.name);

  async performSearch(search: string): Promise<SearchResult[]> {
    this.logger.log(`Performing search for query '${search}'`);
    const response = await customsearch({ version: "v1" }).cse.list({
      auth: "",
      cx: "",
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
      (item) =>
        ({
          title: item.title,
          description: item.snippet,
          link: item.link,
          thumbnail: item?.pagemap?.["cse_thumbnail"],
        } as SearchResult)
    );
  }
}
