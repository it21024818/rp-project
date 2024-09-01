export class SearchResultDto {
  title: string;
  description: string;
  link: string;
  thumbnail?: {
    width: number;
    height: number;
    src: string;
  };
}
