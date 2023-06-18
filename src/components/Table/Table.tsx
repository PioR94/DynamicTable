'use client';
import { getAuthorsData, getBooksData } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEvent,
  DataTableRowToggleEvent,
  DataTableSelectionChangeEvent,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Book } from '../../types/book';
import { Author } from '../../types/author';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';

export const Table = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [lastExpandedRow, setLastExpandedRow] = useState<any>(undefined);

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const authorsData = await getAuthorsData();
        setAuthors(authorsData);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthors();
  }, []);

  const imageBodyTemplate = (rowData: Book) => {
    return <img src={rowData.simple_thumb} alt={rowData.simple_thumb} width="64px" className="shadow-4" />;
  };

  const allowExpansion = (rowData: Author) => {
    return rowData.name!.length > 0;
  };

  const rowExpansionTemplate = (data: Author) => {
    return (
      <div className="p-3">
        <h5> Creativity</h5>
        {data.books.length > 0 ? (
          <DataTable
            value={data.books}
            selectionMode="single"
            onSelectionChange={(e: any) => {
              setMenuItems([{ label: e.value.author }, { label: e.value.title }]);
            }}
          >
            <Column field="title" header="Title" />
            <Column header="Image" body={imageBodyTemplate} />
            <Column field="kind" header="Kind" />
            <Column field="epoch" header="Epoch" />
            <Column field="pdf" header="PDF" body={'amountBodyTemplate'} />
          </DataTable>
        ) : (
          <div>No books found for this author</div>
        )}
      </div>
    );
  };

  const home: MenuItem = {
    icon: 'pi pi-home',
    command: (e) => {
      goHome();
    },
  };

  useEffect(() => {
    const newBreadcrumb = [];
    if (lastExpandedRow) {
      newBreadcrumb.push({ label: lastExpandedRow.name });
    }
    setMenuItems(newBreadcrumb);
  }, [expandedRows, lastExpandedRow]);

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <BreadCrumb model={menuItems} home={home} />
    </div>
  );

  const onRowExpand = async (e: any) => {
    setLastExpandedRow(e.data);
    try {
      const _authors = [...authors];
      const data = await getBooksData(e.data.slug);
      const authorToChange = _authors.find((oneAuthor) => oneAuthor.id === e.data.id);
      authorToChange.books = data;
      setAuthors(_authors);
    } catch (error) {
      return error;
    }
  };

  const goHome = () => {
    setExpandedRows([]);

    setLastExpandedRow(undefined);
  };

  return (
    <div className="card">
      <DataTable
        value={authors}
        expandedRows={expandedRows}
        onRowToggle={(e: DataTableRowToggleEvent) => {
          setExpandedRows(e.data);
        }}
        selectionMode="single"
        onSelectionChange={(e: any) => {
          setMenuItems([{ label: e.value.name }]);
        }}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        tableStyle={{ minWidth: '60rem' }}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowExpand={(e: DataTableRowEvent) => {
          onRowExpand(e);
          console.log(e);
        }}
        loading={!authors.length}
      >
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
        <Column field="name" header="Author" sortable />
      </DataTable>
    </div>
  );
};
