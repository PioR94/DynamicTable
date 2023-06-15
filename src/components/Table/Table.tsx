'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { getBooksData } from '../../utils/api';
import { Book } from '../../types/book';

export const Table = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const booksData = await getBooksData();
        setBooks(booksData);
      } catch (error) {
        console.log(error);
      }
    };
    getBooks();
  }, []);
  console.log(books);
  return <div></div>;
};
