import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-editor-crud',
  templateUrl: './editor-crud.component.html',
  styleUrls: ['./editor-crud.scss']
})
export class EditorCrudComponent implements OnInit {

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
    'Editor in Chief',
    'Editorial Board',
    'Editorial Board Members International',
    'Editorial Board Members National',
    'Managing Editor'
  ];

  isLoading: boolean = false;
  JournalTitle: any = ''; // Bound to the Journal select dropdown (ID)
  currentJournalId: number | null = null;
  currentJournalTitle: string = '';

  // To store the entire editor object when editing, including the ID required for API calls
  editorToEdit: any = null;

  // Search & Pagination
  searchText: string = '';
  pageSize: number = 8;
  pageNumber: number = 1;

  constructor(private fb: FormBuilder,
    private journalWebApiService: LpujournalbookService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadJournals();
  }

  /** Initializes the editor form with validators. */
  initForm(): void {
    this.editorForm = this.fb.group({
      EditorId: [null], // Field to hold the ID in edit/delete mode
      JournalId: [{ value: '', disabled: true }, Validators.required],
      EditorName: [{ value: '', disabled: false }, Validators.required],
      Designation: ['', Validators.required],
      Email: [{ value: '', disabled: this.isEditMode == true ? true : false }, [Validators.required, Validators.email]],
      EditorAddress: ['', Validators.required],
      EditorType: [{ value: 'select', disabled: this.isEditMode == true ? true : false }, Validators.required]
    });
  }

  /** Loads all journals for the dropdown selection. */
  loadJournals() {
    this.isLoading = true;
    const minLoadingTime = 400; // keep UI responsive but show spinner briefly
    const startTime = Date.now();

    this.journalWebApiService.GetAllBooksDetails().pipe(
      finalize(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minLoadingTime - elapsed, 0);
        setTimeout(() => this.isLoading = false, remaining);
      })
    ).subscribe({
      next: (dataX: any) => {
        // You used item1 previously; keep that behavior
        this.journalListsData = dataX?.item1 || [];
      },
      error: (error: any) => {
        console.error('Error fetching journal data', error);
        this.journalListsData = [];
        this.isLoading = false;
      }
    });
  }

  /** Sets the current journal ID and loads editors when the dropdown changes. */
  setJournalId() {
    const selectedJournal = this.journalListsData.find(
      (journal: any) => String(journal.id) === String(this.JournalTitle)
    );

    if (selectedJournal) {
      this.currentJournalId = selectedJournal.id;
      this.currentJournalTitle = selectedJournal.journalTitle || selectedJournal.title || '';
      // Update the JournalId control in the form (disabled but needed for payload)
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
      this.pageNumber = 1;
      this.loadEditorsByJournal(this.currentJournalId);
    } else {
      // If nothing selected, hide list and form
      this.currentJournalId = null;
      this.currentJournalTitle = '';
      this.editorsList = [];
    }
  }

  /** Loads editors by the selected journal ID. */
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
        // API returns item1 in other calls — keep consistent
        this.editorsList = res?.item1 || [];
        // if editors come without explicit id, try to normalize
        this.editorsList = this.editorsList.map((ed: any, idx: number) => {
          // Normalize various ID property names
          const id = ed.id ?? ed.EditorId ?? ed.ID ?? ed.editorId ?? idx + 1;
          const JournalId = ed.journalId ?? ed.JournalId ?? this.currentJournalId;
          return {
            ...ed,
            id,
            JournalId
          };
        });
        // Reset page number after loading new data
        this.pageNumber = 1;
      },
      error: (err) => {
        console.error('Error loading editors', err);
        this.editorsList = [];
      }
    });
  }

  /** Handles form submission for both Create (AddEditorDetails) and Update (UpdateEditorDetails). */
  onSubmit() {
    // Enable JournalId to include it in payload
    this.editorForm.get('JournalId')?.enable();

    if (this.editorForm.invalid) {
      this.editorForm.markAllAsTouched();
      // re-disable if in edit mode
      this.editorForm.get('JournalId')?.disable();
      this.updateFormControlsDisabledState();
      return;
    }

    this.isLoading = true;
    const formValue = this.editorForm.getRawValue(); // includes disabled fields

    // Ensure journalId comes from selection
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
    console.log(JSON.stringify(formData))
    let apiCall$;
    if (this.isEditMode) {
      // include EditorId if available
      const editorIdVal = formValue.EditorId ?? this.editorToEdit?.id;
      formData.append('EditorId', String(editorIdVal ?? '0'));
      apiCall$ = this.journalWebApiService.UpdateEditorDetails(formData);
    } else {
      apiCall$ = this.journalWebApiService.AddEditorDetails(formData);
    }

    apiCall$.pipe(
      finalize(() => {
        this.isLoading = false;
        // keep JournalId disabled in the form UI
        this.editorForm.get('JournalId')?.disable();
        this.updateFormControlsDisabledState();
      })
    ).subscribe({
      next: (data: any) => {
        // Handle different shapes for returnId/msg
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
            // this.resetForm(false);
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

  /** Sets the component state and form values for editing. */
  editEditor(editor: any) {
    // Ensure we have the journal selection set (if row came from another source)
    if (!this.currentJournalId && (editor?.JournalId || editor?.journalId)) {
      this.currentJournalId = editor?.JournalId ?? editor?.journalId;
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }

    this.isEditMode = true;
    this.editorToEdit = editor;

    // Determine ID safely
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

    // Disable fields as per requirement
    this.updateFormControlsDisabledState();

    // Ensure the form is visible and scroll to it
    setTimeout(() => {
      const el = document.querySelector('.editor-form-area');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  /** Disables/Enables fields based on edit mode. */
  private updateFormControlsDisabledState() {
    const isEdit = this.isEditMode;

    // Name, Email and EditorType should be disabled in edit mode (always set disable to be safe)
    if (isEdit) {
      this.editorForm.get('EditorName')?.disable({ emitEvent: false });
      this.editorForm.get('Email')?.disable({ emitEvent: false });
      this.editorForm.get('EditorType')?.disable({ emitEvent: false });
    } else {
      // In add mode, ensure they are enabled
      this.editorForm.get('EditorName')?.enable({ emitEvent: false });
      this.editorForm.get('Email')?.enable({ emitEvent: false });
      this.editorForm.get('EditorType')?.enable({ emitEvent: false });
    }

    // JournalId should stay disabled in UI but present in payload via getRawValue
    this.editorForm.get('JournalId')?.disable({ emitEvent: false });

    // Designation and Address are editable in both modes
    this.editorForm.get('Designation')?.enable({ emitEvent: false });
    this.editorForm.get('EditorAddress')?.enable({ emitEvent: false });
  }

  /** Deletes an editor. */
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

        // Build full payload same as edit
        const formData = new FormData();
        const idVal = editor.id ?? editor.EditorId ?? editor.ID ?? editor.editorId ?? 0;

        // Use JournalId from editor if present else currentJournalId
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

  /** Resets the form and exits edit mode. */
  resetForm(resetJournal: boolean = false) {
    this.editorForm.reset();
    this.isEditMode = false;
    this.selectedEditorId = null;
    this.editorToEdit = null;

    // Re-patch JournalId and re-disable all fixed fields
    if (this.currentJournalId) {
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }

    this.updateFormControlsDisabledState();

    if (resetJournal) {
      this.JournalTitle = '';
      this.currentJournalId = null;
      this.editorsList = [];
    }
    
  }

  /** Utility to conditionally show/hide the editor form */
  showEditorForm(): boolean {
    return !!this.currentJournalId;
  }

  private refreshEditorForm() {
    this.searchText = '';
    this.editorForm.reset();

    // Refill JournalId as disabled control
    if (this.currentJournalId) {
      this.editorForm.get('JournalId')?.setValue(this.currentJournalId);
    }

    // Re-apply edit/add mode control disabling
    this.updateFormControlsDisabledState();

    // Reset flags
    this.isEditMode = false;
    this.editorToEdit = null;
    this.selectedEditorId = null;
  }

  // -------------------- Search & Pagination functions --------------------

  /** Returns filtered results based on searchText */
  filteredEditors(): any[] {
    const q = (this.searchText || '').toLowerCase().trim();

    return this.editorsList.filter(e =>
      JSON.stringify(e).toLowerCase().includes(q)
    );
  }


  /** Returns paginated editors for current page */
  paginatedEditors(): any[] {
    const list = this.filteredEditors();
    const start = (this.pageNumber - 1) * this.pageSize;
    // The slice end is calculated correctly
    return list.slice(start, start + this.pageSize);
  }

  /** Calculates the total number of pages. (NEW HELPER) */
  totalPages(): number {
    const totalRecords = this.filteredEditors().length;
    // Ensures at least 1 page if there are records
    return Math.max(1, Math.ceil(totalRecords / this.pageSize));
  }


  /** Moves to the next page. */
  nextPage() {
    // Check using the new totalPages helper
    if (this.pageNumber < this.totalPages()) {
      this.pageNumber++;
      // Optional: scroll to the top of the grid 
      setTimeout(() => {
        const el = document.querySelector('.editors-grid-area');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  /** Moves to the previous page. */
  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      // Optional: scroll to the top of the grid
      setTimeout(() => {
        const el = document.querySelector('.editors-grid-area');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }
}