// import React from 'react'
// import EdsTopMenuBar from '../TopBar/EdsTopMenuBar'

// function  ManageMembers() {
//   return (
//     <div> 
//       <EdsTopMenuBar/>
//       <h1> Manage Members</h1>
//     </div>
//   )
// }

// export default  ManageMembers

"use client";

import { useParams, useRouter } from 'next/navigation';
import myAppWebService from '@/services/myAppWebService';
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
// import { 
//     GetAllBooksDetails, 
//     GetEditorsDetailsIdWise, 
//     AddEditorDetails, 
//     UpdateEditorDetails, 
//     DeleteEditorDetails 
// } from '@/services/myAppWebService';

import styles from './EdsManageEditorDetails.module.scss';
import EdsTopMenuBar from '../TopBar/EdsTopMenuBar';

const EditorTypes = [
  'Editorial board members National', 'Associate Editor', 'Associate Editors',
  'Editor-in-Chief', 'Editorial Board', 'Editorial Board Members International',
  'Editorial Board Members National', 'Managing Editor'
];

const ManageEditorDetails = () => {
  // Component State
  const [journals, setJournals] = useState<any[]>([]);
  const [editors, setEditors] = useState<any[]>([]);
  const [selectedJournalId, setSelectedJournalId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Search & Pagination State
  const [searchText, setSearchText] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8;

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      EditorId: '',
      JournalId: '',
      EditorName: '',
      Designation: '',
      Email: '',
      EditorAddress: '',
      EditorType: ''
    }
  });

  // Initial Load
  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    setIsLoading(true);
    try {
      const res = await myAppWebService.GetAllBooksDetails();
      setJournals(res?.item1 || []);
    } catch (error) {
      console.error("Failed to load journals", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJournalChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedJournalId(id);
    setPageNumber(1);
    setValue('JournalId', id);

    if (id) {
      fetchEditors(id);
    } else {
      setEditors([]);
    }
  };

  const fetchEditors = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await myAppWebService.GetEditorsDetailsIdWise(Number(id));
      setEditors(res?.item1 || []);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('JournalId', selectedJournalId);
    formData.append('EditorName', data.EditorName);
    formData.append('Designation', data.Designation);
    formData.append('Email', data.Email);
    formData.append('EditorAddress', data.EditorAddress);
    formData.append('EditorType', data.EditorType);

    try {
      let res;
      if (isEditMode) {
        formData.append('EditorId', data.EditorId);
        res = await myAppWebService.UpdateEditorDetails(formData);
      } else {
        res = await myAppWebService.AddEditorDetails(formData);
      }

      const row = res?.item1?.[0] || res?.item1 || {};
      if (row.ReturnId > 0 || row.Msg?.toLowerCase().includes('success')) {
        await Swal.fire('Success', row.Msg || 'Operation successful', 'success');
        resetForm();
        fetchEditors(selectedJournalId);
      } else {
        Swal.fire('Error', row.Msg || 'Action failed', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'API connection error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const editEditor = (editor: any) => {
    setIsEditMode(true);
    reset({
      EditorId: editor.id || editor.EditorId,
      JournalId: selectedJournalId,
      EditorName: editor.EditorName,
      Designation: editor.Designation,
      Email: editor.Email,
      EditorAddress: editor.EditorAddress,
      EditorType: editor.EditorType
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHandler = async (editor: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this editor permanently?",
      icon: 'warning',
      showCancelButton: true
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('EditorId', String(editor.id || editor.EditorId));
      formData.append('JournalId', selectedJournalId);

      try {
        const res = await myAppWebService.DeleteEditorDetails(formData);
        fetchEditors(selectedJournalId);
        Swal.fire('Deleted!', 'Editor removed.', 'success');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setIsEditMode(false);
    reset({
      EditorId: '',
      JournalId: selectedJournalId,
      EditorName: '',
      Designation: '',
      Email: '',
      EditorAddress: '',
      EditorType: ''
    });
  };

  // Pagination Logic
  const filteredEditors = useMemo(() => {
    return editors.filter(e =>
      Object.values(e).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [editors, searchText]);

  const totalPages = Math.ceil(filteredEditors.length / pageSize) || 1;
  const paginatedEditors = filteredEditors.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <>
      <EdsTopMenuBar />

      <div className={styles.crudContainer}>
        <div className={styles.cardWrapper}>
          <h1 className={`${styles.themeTitle} text-center`}>Manage Editorial Board Members</h1>

          {/* Journal Selection */}
          <div className={styles.journalSelectionArea}>
            <div className="row align-items-center">
              <div className="col-md-4"><label className="fw-bold">Select Journal</label></div>
              <div className="col-md-8">
                <select
                  className="form-select border-primary"
                  value={selectedJournalId}
                  onChange={handleJournalChange}
                >
                  <option value="">-- Select a Journal --</option>
                  {journals.map(j => (
                    <option key={j.id} value={j.id}>{j.journalTitle}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className={styles.fullPageLoader}>
              <span className={`material-icons ${styles.spinIcon}`}>autorenew</span>
            </div>
          )}

          {/* Form Section */}
          {selectedJournalId && (
            <div className="mt-4 p-4 border rounded bg-light">
              <h4 className="text-center mb-4">{isEditMode ? 'Edit Editor' : 'Add New Editor'}</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label>Journal ID</label>
                    <input type="text" className="form-control" {...register('JournalId')} disabled />
                  </div>
                  <div className="col-md-4">
                    <label>Editor Name</label>
                    <input type="text" className={`form-control ${errors.EditorName ? 'is-invalid' : ''}`}
                      {...register('EditorName', { required: true })} disabled={isEditMode} />
                  </div>
                  <div className="col-md-4">
                    <label>Designation</label>
                    <input type="text" className="form-control" {...register('Designation', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label>Email</label>
                    <input type="email" className="form-control" {...register('Email', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label>Address</label>
                    <input type="text" className="form-control" {...register('EditorAddress', { required: true })} />
                  </div>
                  <div className="col-md-4">
                    <label>Editor Type</label>
                    <select className="form-select" {...register('EditorType', { required: true })}>
                      <option value="">-- Select Type --</option>
                      {EditorTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="submit" className="btn btn-primary me-2">
                    {isEditMode ? 'Update Editor' : 'Add Editor'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    {isEditMode ? 'Cancel Edit' : 'Reset'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table Section */}
          {selectedJournalId && editors.length > 0 && (
            <div className="mt-5">
              <div className="d-flex justify-content-between mb-3">
                <h5>Editors List</h5>
                <input type="text" placeholder="Search..." className="form-control w-25"
                  onChange={(e) => setSearchText(e.target.value)} />
              </div>
              <div className="table-responsive">
                <table className="table table-hover border">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEditors.map((e, i) => (
                      <tr key={i}>
                        <td>{(pageNumber - 1) * pageSize + i + 1}</td>
                        <td>{e.EditorName}</td>
                        <td>{e.Designation}</td>
                        <td>{e.Email}</td>
                        <td>{e.EditorType}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => editEditor(e)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(e)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button className="btn btn-outline-primary" disabled={pageNumber === 1} onClick={() => setPageNumber(p => p - 1)}>Prev</button>
                <span>Page {pageNumber} of {totalPages}</span>
                <button className="btn btn-outline-primary" disabled={pageNumber === totalPages} onClick={() => setPageNumber(p => p + 1)}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageEditorDetails;