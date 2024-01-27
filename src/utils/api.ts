import axios from 'axios';
import { Book } from '../types/book';
import { Author } from '../types/author';
import { Format } from '../types/format';
import { BASE_URL } from './constants';

const { v4: uuid } = require('uuid');

export const getAuthorsData = async (): Promise<Author[] | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/authors/`);

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
    return authorsData.filter((author) => author !== undefined);
  } catch (error) {
    console.log(error);
  }
};

export const getBooksData = async (slug: string): Promise<Book[] | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/authors/${slug}/books/`);
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

export const getFormatsData = async (slug: string): Promise<Format | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/books/${slug}/`);
    return {
      pdf: response.data.pdf,
      epub: response.data.epub,
      mobi: response.data.mobi,
    };
  } catch (error) {
    console.error(error);
  }
};
