import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-EdsManageEditorDetails',
  templateUrl: './EdsManageEditorDetails.component.html',
  styleUrls: ['./EdsManageEditorDetails.scss']
})
export class EdsManageEditorDetailsComponent implements OnInit {

  editorForm!: FormGroup;
  editorsList: any[] = [];
  selectedEditorId: number | null = null;
  isEditMode: boolean = false;

  journalListsData: any[] = [];
  editorTypes = [
    'Editorial board members National',
    'Associate Editor',
    'Associate Editors',
    'Editor-in-Chief',
    'Editorial Board',
    'Editorial Board Members International',
    'Editorial Board Members National',
    'Managing Editor'
  ];

  isLoading: boolean = false;
  JournalTitle: any = ''; 
  currentJournalId: number | null = null;
  currentJournalTitle: string = '';

  editorToEdit: any = null;

  searchText: string = '';
  pageSize: number = 8;
  pageNumber: number = 1;

  constructor(private fb: FormBuilder,
    private journalWebApiService: LpujournalbookService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadJournals();
  }


  initForm(): void {
    this.editorForm = this.fb.group({
      EditorId: [null],
      JournalId: [{ value: '', disabled: true }, Validators.required],
      EditorName: ['', Validators.required],
      Designation: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]], 
      EditorAddress: ['', Validators.required],
      EditorType: ['select', Validators.required] 
    });
    this.updateFormControlsDisabledState(); 
  }

  loadJournals() {
    this.isLoading = true;
    const minLoadingTime = 400;
    const startTime = Date.now();

    this.journalWebApiService.GetAllBooksDetails().pipe(
      finalize(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minLoadingTime - elapsed, 0);
        setTimeout(() => this.isLoading = false, remaining);
      })
    ).subscribe({
      next: (dataX: any) => {
        this.journalListsData = dataX?.item1 || [];
        console.log(JSON.stringify(this.journalListsData)+'Data Journals')
      },
      error: (error: any) => {
        console.error('Error fetching journal data', error);
        this.journalListsData = [];
        this.isLoading = false;
      }
    });
  }

  setJournalId() {
    const selectedJournal = this.journalListsData.find(
      (journal: any) => String(journal.id) === String(this.JournalTitle)
    );

    if (selectedJournal) {
      this.currentJournalId = selectedJournal.id;
      this.currentJournalTitle = selectedJournal.journalTitle || selectedJournal.title || '';
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
      this.pageNumber = 1;
      this.loadEditorsByJournal(this.currentJournalId);
    } else {
      this.currentJournalId = null;
      this.currentJournalTitle = '';
      this.editorsList = [];
    }
  }

  loadEditorsByJournal(journalId: number | null) {
    if (!journalId) {
      this.editorsList = [];
      return;
    }
    this.isLoading = true;
    this.journalWebApiService.GetEditorsDetailsIdWise(journalId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res: any) => {
        this.editorsList = res?.item1 || [];
        this.editorsList = this.editorsList.map((ed: any, idx: number) => {
          const id = ed.id ?? ed.EditorId ?? ed.ID ?? ed.editorId ?? idx + 1;
          const JournalId = ed.journalId ?? ed.JournalId ?? this.currentJournalId;
          return {
            ...ed,
            id,
            JournalId
          };
        });
        this.pageNumber = 1;
      },
      error: (err) => {
        console.error('Error loading editors', err);
        this.editorsList = [];
      }
    });
  }

  onSubmit() {

    this.editorForm.get('JournalId')?.enable();

    if (this.editorForm.invalid) {
      this.editorForm.markAllAsTouched();
      this.editorForm.get('JournalId')?.disable();
      this.updateFormControlsDisabledState();
      return;
    }

    this.isLoading = true;
    const formValue = this.editorForm.getRawValue();
    const journalIdForPayload = this.currentJournalId;
    if (!journalIdForPayload) {
      Swal.fire('Select Journal', 'Please select a Journal before saving.', 'warning');
      this.isLoading = false;
      this.editorForm.get('JournalId')?.disable();
      this.updateFormControlsDisabledState();
      return;
    }

    const formData = new FormData();
    formData.append('JournalId', String(journalIdForPayload));
    formData.append('EditorName', formValue.EditorName ?? '');
    formData.append('Designation', formValue.Designation ?? '');
    formData.append('Email', formValue.Email ?? '');
    formData.append('EditorAddress', formValue.EditorAddress ?? '');
    formData.append('EditorType', formValue.EditorType ?? '');
    
    let apiCall$;
    if (this.isEditMode) {    
      const editorIdVal = formValue.EditorId ?? this.editorToEdit?.id;
      formData.append('EditorId', String(editorIdVal ?? '0'));
      apiCall$ = this.journalWebApiService.UpdateEditorDetails(formData);
    } else {
      apiCall$ = this.journalWebApiService.AddEditorDetails(formData);
    }

    apiCall$.pipe(
      finalize(() => {
        this.isLoading = false;        
        this.editorForm.get('JournalId')?.disable();
        this.updateFormControlsDisabledState();
      })
    ).subscribe({
      next: (data: any) => {        
        const row = Array.isArray(data?.item1) ? data.item1[0] : (data?.item1 ?? {});
        const returnId = row?.ReturnId ?? row?.returnId ?? -99;
        const msg = row?.Msg ?? row?.msg ?? (this.isEditMode ? 'Update completed.' : 'Insert completed.');

        if ((typeof returnId === 'number' && returnId > 0) || String(msg).toLowerCase().includes('success')) {
          Swal.fire({
            title: this.isEditMode ? 'Updated Successfully' : 'Added Successfully',
            text: msg,
            icon: 'success',
            timer: 2000
          }).then(() => {
            this.refreshEditorForm();
            this.loadEditorsByJournal(journalIdForPayload);
          });
        } else {
          Swal.fire('Failed', msg || ('ReturnId: ' + returnId), 'error');
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        Swal.fire('Error', 'Unable to complete the request. Please try again.', 'error');
      }
    });
  }

  editEditor(editor: any) {
    if (!this.currentJournalId && (editor?.JournalId || editor?.journalId)) {
      this.currentJournalId = editor?.JournalId ?? editor?.journalId;
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }

    this.isEditMode = true;
    this.editorToEdit = editor;

    const resolvedId = editor.id ?? editor.EditorId ?? editor.ID ?? editor.editorId ?? null;

    this.editorForm.patchValue({
      EditorId: resolvedId,
      JournalId: editor.JournalId ?? editor.journalId ?? this.currentJournalId,
      EditorName: editor.EditorName ?? editor.editorName ?? '',
      Designation: editor.Designation ?? editor.designation ?? '',
      Email: editor.Email ?? editor.email ?? '',
      EditorAddress: editor.EditorAddress ?? editor.editorAddress ?? '',
      EditorType: editor.EditorType ?? editor.editorType ?? ''
    });

    this.updateFormControlsDisabledState();

    setTimeout(() => {
      const el = document.querySelector('.editor-form-area');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  private updateFormControlsDisabledState() {
    const isEdit = this.isEditMode;
    
    if (isEdit) {
      this.editorForm.get('EditorName')?.disable({ emitEvent: false });
    } else {
      this.editorForm.get('EditorName')?.enable({ emitEvent: false });
    }
    
    this.editorForm.get('JournalId')?.disable({ emitEvent: false }); 
    
    this.editorForm.get('Designation')?.enable({ emitEvent: false });
    this.editorForm.get('EditorAddress')?.enable({ emitEvent: false });
    
     this.editorForm.get('EditorName')?.enable({ emitEvent: false });
    this.editorForm.get('Email')?.enable({ emitEvent: false }); 
    this.editorForm.get('EditorType')?.enable({ emitEvent: false }); 
  }

  deleteEditor(editor: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action will remove the editor permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        const formData = new FormData();
        const idVal = editor.id ?? editor.EditorId ?? editor.ID ?? editor.editorId ?? 0;

        const journalIdVal = editor.JournalId ?? editor.journalId ?? this.currentJournalId ?? 0;

        formData.append('JournalId', String(journalIdVal));
        formData.append('EditorId', String(idVal));
        formData.append('EditorName', editor.EditorName ?? editor.editorName ?? '');
        formData.append('Designation', editor.Designation ?? editor.designation ?? '');
        formData.append('Email', editor.Email ?? editor.email ?? '');
        formData.append('EditorAddress', editor.EditorAddress ?? editor.editorAddress ?? '');
        formData.append('EditorType', editor.EditorType ?? editor.editorType ?? '');

        this.journalWebApiService.DeleteEditorDetails(formData).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: (data: any) => {
            const row = Array.isArray(data?.item1) ? data.item1[0] : (data?.item1 ?? {});
            const returnId = row?.ReturnId ?? row?.returnId ?? -99;
            const msg = row?.Msg ?? row?.msg ?? 'Deletion completed.';

            if ((typeof returnId === 'number' && returnId > 0) || String(msg).toLowerCase().includes('success')) {
              Swal.fire('Deleted', 'Editor deleted successfully.', 'success');
              this.loadEditorsByJournal(this.currentJournalId);
            } else {
              Swal.fire('Delete Failed', msg || ('ReturnId: ' + returnId), 'error');
            }
          },
          error: (err) => {
            console.error('Delete API error', err);
            Swal.fire('Error', 'Unable to complete the delete request.', 'error');
          }
        });
      }
    });
  }

  resetForm(resetJournal: boolean = false) {
    this.editorForm.reset();
    this.isEditMode = false;
    this.selectedEditorId = null;
    this.editorToEdit = null;

    if (this.currentJournalId) {
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }
    this.editorForm.get('EditorType')?.setValue('select');

    this.updateFormControlsDisabledState();

    if (resetJournal) {
      this.JournalTitle = '';
      this.currentJournalId = null;
      this.editorsList = [];
    }
  }

  showEditorForm(): boolean {
    return !!this.currentJournalId;
  }

  private refreshEditorForm() {
    this.searchText = '';
    this.editorForm.reset();

    if (this.currentJournalId) {
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }
    
    this.editorForm.get('EditorType')?.setValue('select');

    
    this.updateFormControlsDisabledState();

    
    this.isEditMode = false;
    this.editorToEdit = null;
    this.selectedEditorId = null;
  }

  // -------------------- Search & Pagination functions --------------------

  filteredEditors(): any[] {
    const q = (this.searchText || '').toLowerCase().trim();

    return this.editorsList.filter(e =>
      JSON.stringify(e).toLowerCase().includes(q)
    );
  }


  paginatedEditors(): any[] {
    const list = this.filteredEditors();
    const start = (this.pageNumber - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    const totalRecords = this.filteredEditors().length;

    return Math.max(1, Math.ceil(totalRecords / this.pageSize));
  }


  nextPage() {

    if (this.pageNumber < this.totalPages()) {
      this.pageNumber++;

      setTimeout(() => {
        const el = document.querySelector('.editors-grid-area');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }


  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      setTimeout(() => {
        const el = document.querySelector('.editors-grid-area');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }
}