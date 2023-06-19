import axios from 'axios';
import { Book } from '../types/book';
import { Author } from '../types/author';
import { Format } from '../types/format';

const { v4: uuid } = require('uuid');

export const getAuthorsData = async (): Promise<Author[]> => {
  try {
    const response = await axios.get('https://wolnelektury.pl/api/authors/');

    const authorsData = await Promise.all(
      response.data.map(async (author: Author) => {
        return {
          id: uuid(),
          name: author.name,
          url: author.url,
          slug: author.slug,
          books: [],
        };
      }),
    );
    const authorsFiltered = authorsData.filter((author) => author !== undefined);
    return authorsFiltered;
  } catch (error) {
    console.log(error);
  }
};

export const getBooksData = async (slug: string): Promise<Book[]> => {
  try {
    const response = await axios.get(`https://wolnelektury.pl/api/authors/${slug}/books/`);
    return response.data.map((book: Book) => ({
      full_sort_key: book.full_sort_key,
      kind: book.kind,
      title: book.title,
      author: book.author,
      href: book.href,
      epoch: book.epoch,
      genres: book.genres,
      simple_thumb: book.simple_thumb,
      slug: book.slug,
    }));
  } catch (error) {
    console.error(error);
  }
};

export const getFormatsData = async (slug: string): Promise<Format> => {
  try {
    const response = await axios.get(`https://wolnelektury.pl/api/books/${slug}/`);
    return {
      pdf: response.data.pdf,
      epub: response.data.epub,
      mobi: response.data.mobi,
    };
  } catch (error) {
    return error;
  }
};
