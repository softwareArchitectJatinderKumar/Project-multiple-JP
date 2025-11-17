import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LpujournalbookService } from 'src/app/_services/lpujournalbook.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-journal-popular-by-genre',
  templateUrl: './journal-popular-by-genre.component.html',
  standalone: false,styleUrls: ['./journal-popular-by-genre.component.scss']
})
export class JournalPopularByGenreComponent implements OnInit, AfterViewInit {
  totalPage: any;
  totalPagesArray: any = 0; pageSizeOptions: number[] = [6, 12, 18, 24, 30];
  // totalPagess: any = 0;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator: MatPaginator | any;
  @ViewChild('sort') sort: MatSort | any;

  @ViewChild('paginator1') paginator1: MatPaginator | any;
  @ViewChild('sort1') sort1: MatSort | any;

  booksDataWithEditorInfo: any[] | any;

  @ViewChild('paginator2') paginator2: MatPaginator | any;
  @ViewChild('sort2') sort2: MatSort | any;

  constructor(
    private route: ActivatedRoute,
    private journalWebApiService: LpujournalbookService,
    public formBuilder: UntypedFormBuilder,
    private fb: FormBuilder,
    private router: Router,) { }
    serverUrl: any = 'https://files.lpu.in/umsweb/Journal/'; 
  ngOnInit(): void {
    this.getBooksDataWithEditorDetails();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getBooksDataWithEditorDetails(): void {
    this.journalWebApiService.GetAllJournalMasterwithEditorDetails().subscribe((response) => {
      if (response.item1 && response.item1.length > 0) {
        this.booksDataWithEditorInfo = response.item1;
        this.dataSource = new MatTableDataSource(this.booksDataWithEditorInfo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalPagess = Math.ceil(this.booksDataWithEditorInfo.length / this.recordsPerPage);
        this.totalPagesArray = Array.from({ length: this.totalPagess }, (_, i) => i + 1);
      }
      else {
        this.booksDataWithEditorInfo = [];
      }
      // console.log("Books Details with Editors details " + JSON.stringify(this.booksDataWithEditorInfo));
    });
  }
  recordsPerPage = 6;
  // currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.booksDataWithEditorInfo.length / this.recordsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getRecordsForCurrentPage(): any[] {
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    const records = [];

    for (let i = startIndex; i < endIndex && i < this.booksDataWithEditorInfo?.length; i++) {
      records.push(this.booksDataWithEditorInfo[i]);
    }

    return records;
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.recordsPerPage = event.pageSize;
  }


  slides: any[] = [];
  baseFallbackImageUrl: string = 'assets/journal/'; // 


  getFallbackImage(index: number): string {
    return `${this.baseFallbackImageUrl}${index + 1}.jpg`; // 
  }
  imageLoadError: boolean[] = [];
  handleImageError(index: number) {
    this.imageLoadError[index] = true;
  }
  handleImageLoad(index: number) {
    this.imageLoadError[index] = false;
  }

  checkImageLoad(event: Event, index: number) {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.naturalWidth === 0 || imgElement.naturalHeight === 0) {
      this.imageLoadError[index] = true;
    } else {
      this.imageLoadError[index] = false;
    }
  }

  currentPage: number = 1;
  totalPagess: number = 1; // total number of pages
  

  getPageRange(): number[] {
    const visiblePages = 5;
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = start + visiblePages - 1;
  
    if (end > this.totalPagess) {
      end = this.totalPagess;
      start = Math.max(1, end - visiblePages + 1);
    }
  
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  
}
