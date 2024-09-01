export class NewsSourceDto {
  name: string;
  identifications: string[];
  domain: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  archived?: boolean;
}
