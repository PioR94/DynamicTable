'use client';
import { getAuthorsData, getBooksData, getFormatsData } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowClickEvent,
  DataTableRowEvent,
  DataTableSelectionChangeEvent,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Book } from '../../types/book';
import { Author } from '../../types/author';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { Format } from '../../types/format';

export const Table = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [lastExpandedRow, setLastExpandedRow] = useState<any>(undefined);
  const [format, setFormat] = useState<Format>({
    pdf: '',
    epub: '',
    mobi: '',
  });

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const authorsData = await getAuthorsData();
        if (authorsData) {
          setAuthors(authorsData);
        } else {
          console.error('Brak danych autorów.');
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAuthors();
  }, []);

  useEffect(() => {
    const newBreadcrumb = [];
    if (lastExpandedRow) {
      newBreadcrumb.push({ label: lastExpandedRow.name });
    }
    setMenuItems(newBreadcrumb);
  }, [lastExpandedRow]);

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
            onSelectionChange={(e: DataTableSelectionChangeEvent<Book[]>) => {
              const value = e.value as Book;
              setMenuItems([{ label: value.author }, { label: value.title }]);
            }}
            onRowClick={(e: DataTableRowClickEvent) => {
              const data = e.data as Book;
              getFormat(data.slug);
            }}
          >
            <Column field="title" header="Title" />
            <Column header="Image" body={imageBodyTemplate} />
            <Column field="kind" header="Kind" />
            <Column field="epoch" header="Epoch" />
            <Column field="pdf" header="PDF" body={<div className="pi pi-download" onDoubleClick={() => download(format.pdf)} />} />
            <Column field="epub" header="EPUB" body={<div className="pi pi-download " onDoubleClick={() => download(format.epub)} />} />
            <Column field="pdf" header="MOBI" body={<div className="pi pi-download " onDoubleClick={() => download(format.mobi)} />} />
          </DataTable>
        ) : (
          <div>No books found for this author</div>
        )}
      </div>
    );
  };

  const home: MenuItem = {
    icon: 'pi pi-home',
    command: () => {
      goHome();
    },
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <BreadCrumb model={menuItems} home={home} />
    </div>
  );

  const onRowExpand = async (e: DataTableRowEvent): Promise<void> => {
    setLastExpandedRow(e.data);
    try {
      const _authors = [...authors];
      const data = await getBooksData(e.data.slug);
      const authorToChange = _authors.find((author) => author.id === e.data.id);

      if (authorToChange && data) {
        authorToChange.books = data;
        setAuthors(_authors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goHome = (): void => {
    setExpandedRows(undefined);
    setLastExpandedRow(undefined);
    setMenuItems([]);
  };
  const getFormat = async (slug: string): Promise<void> => {
    try {
      const dataFormat = await getFormatsData(slug);
      if (dataFormat) {
        setFormat({
          pdf: dataFormat.pdf,
          epub: dataFormat.epub,
          mobi: dataFormat.mobi,
        });
      } else {
        console.error('Brak danych formatu dla podanego sluga.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const download = (url: string) => {
    try {
      setTimeout(() => {
        window.open(url, '_blank', 'noopener noreferrer');
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card">
        <DataTable
          value={authors}
          expandedRows={expandedRows}
          onRowToggle={(e: any) => {
            setExpandedRows(e.data);
          }}
          selectionMode="single"
          onSelectionChange={(e: DataTableSelectionChangeEvent<Author[]>) => {
            const value = e.value as Author;
            setMenuItems([{ label: value.name }]);
          }}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
          header={header}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          onRowExpand={(e: DataTableRowEvent) => {
            onRowExpand(e);
          }}
          onRowCollapse={(e: DataTableRowEvent) => {
            const data = e.data as Author;
            setMenuItems([{ label: data.name }]);
          }}
          loading={!authors.length}
        >
          <Column expander={allowExpansion} style={{ width: '5rem' }} />
          <Column field="name" header="Author" sortable />
        </DataTable>
      </div>
    </>
  );
};
