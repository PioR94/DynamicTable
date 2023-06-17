'use client';
import { getAuthorsData, getBooksData } from '../../utils/api';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableDataSelectableEvent, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Book } from '../../types/book';
import { Author } from '../../types/author';
import { BreadCrumb } from 'primereact/breadcrumb';

export const Table = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Author | null>(null);

  // useEffect(() => {
  //   const getBooks = async () => {
  //     try {
  //       const booksData = await getBooksData('adam-mickiewicz');
  //       setBooks(booksData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getBooks();
  // }, []);

  useEffect(() => {
    const getAuthors = async () => {
      try {
        const authorsData = await getAuthorsData();
        setAuthors(authorsData);
        console.log(authors);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthors();
  }, []);

  const expandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};

    authors.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(undefined);
  };

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };

  const imageBodyTemplate = (rowData: Book) => {
    return <img src={rowData.simple_thumb} alt={rowData.simple_thumb} width="64px" className="shadow-4" />;
  };

  // const priceBodyTemplate = (rowData: Product) => {
  //   return formatCurrency(rowData.price);
  // };

  // const ratingBodyTemplate = (rowData: Product) => {
  //   return <Rating value={rowData.rating} readOnly cancel={false} />;
  // };

  // const statusBodyTemplate = (rowData: Product) => {
  //   return <Tag value={rowData.inventoryStatus} severity={getProductSeverity(rowData)}></Tag>;
  // };

  const allowExpansion = (rowData: Author) => {
    return rowData.name!.length > 0;
  };

  const rowExpansionTemplate = (data: Author) => {
    return (
      <div className="p-3">
        <h5> Creativity</h5>
        <DataTable value={data.books} selectionMode="single">
          <Column field="title" header="Title" />
          <Column header="Image" body={imageBodyTemplate} />
          <Column field="kind" header="Kind" />
          <Column field="epoch" header="Epoch" />
          <Column field="amount" header="Amount" body={'amountBodyTemplate'} />
          <Column field="status" header="Status" body={'statusOrderBodyTemplate'} />
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} text />
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={authors}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        tableStyle={{ minWidth: '60rem' }}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
        <Column field="name" header="Author" sortable />

        {/*<Column field="price" header="Price" sortable body={''} />*/}
        {/*<Column field="category" header="Category" sortable />*/}
        {/*<Column field="rating" header="Reviews" sortable body={'ratingBodyTemplate'} />*/}
        {/*<Column field="inventoryStatus" header="Status" sortable body={'statusBodyTemplate'} />*/}
      </DataTable>
    </div>
  );
};
