import { Module } from "@nestjs/common";
import { NewsSearchService } from "./news-search.service";

@Module({
  providers: [NewsSearchService],
  exports: [NewsSearchService],
})
export class NewsSearchModule {}
