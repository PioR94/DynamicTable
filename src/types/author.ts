import { Book } from './book';

export interface Author {
  id: string;
  name: string;
  url: string;
  slug: string;
  books: Book[];
}
