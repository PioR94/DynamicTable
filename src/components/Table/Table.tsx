'use client';
import { getBooksData } from '../../utils/api';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent, DataTableValueArray } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Book } from '../../types/book';

export const Table = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

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

  const expandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};

    books.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(undefined);
  };

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };

  const imageBodyTemplate = (rowData: Book) => {
    return <img src={rowData.img} alt={rowData.img} width="64px" className="shadow-4" />;
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

  const allowExpansion = (rowData: Book) => {
    return rowData.author!.length > 0;
  };

  const rowExpansionTemplate = (data: Book) => {
    return (
      <div className="p-3">
        <h5>Orders for {data.title}</h5>
        <DataTable value={books}>
          <Column field="id" header="Id" sortable></Column>
          <Column field="customer" header="Customer" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="amount" header="Amount" body={'amountBodyTemplate'} sortable></Column>
          <Column field="status" header="Status" body={'statusOrderBodyTemplate'} sortable></Column>
          <Column headerStyle={{ width: '4rem' }} body={searchBodyTemplate}></Column>
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
        value={books}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        // onRowExpand={onRowExpand}
        // onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        header={header}
        tableStyle={{ minWidth: '60rem' }}
      >
        <Column expander={allowExpansion} style={{ width: '5rem' }} />
        <Column field="name" header="Author" sortable />
        <Column header="Image" body={imageBodyTemplate} />
        <Column field="price" header="Price" sortable body={''} />
        <Column field="category" header="Category" sortable />
        <Column field="rating" header="Reviews" sortable body={'ratingBodyTemplate'} />
        <Column field="inventoryStatus" header="Status" sortable body={'statusBodyTemplate'} />
      </DataTable>
    </div>
  );
};
