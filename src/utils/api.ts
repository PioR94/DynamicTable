import axios from 'axios';
import { Book } from '../types/book';

export const getBooksData = async (): Promise<Book[]> => {
  try {
    const response = await axios.get('https://wolnelektury.pl/api/epochs/renesans/books/');
    return response.data.map((book: any) => ({
      id: book.full_sort_key,
      kind: book.kind,
      title: book.title,
      author: book.author,
      href: book.href,
      epoch: book.epoch,
      genres: book.genres,
      img: book.simple_thumb,
      //  epub:
      // mobi: string;
      // pdf: string;
    }));
  } catch (error) {
    console.error(error);
  }
};
