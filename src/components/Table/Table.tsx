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
import { MenuItem } from 'primereact/menuitem';

export const Table = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(undefined);

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
        <DataTable value={data.books} selectionMode="single">
          <Column field="title" header="Title" />
          <Column header="Image" body={imageBodyTemplate} />
          <Column field="kind" header="Kind" />
          <Column field="epoch" header="Epoch" />
          <Column field="pdf" header="PDF" body={'amountBodyTemplate'} />
        </DataTable>
      </div>
    );
  };

  const items: MenuItem[] = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
  const home: MenuItem = { icon: 'pi pi-home', url: 'https://primereact.org' };

  const header = (
    <div className="flex flex-wrap justify-content-end gap-2">
      <BreadCrumb model={items} home={home} />
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
      </DataTable>
    </div>
  );
};
