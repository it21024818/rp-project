import { PageMetadata } from './page-metadata.dto';

export type Page<T> = {
  content: T[];
  metadata: PageMetadata;
};
