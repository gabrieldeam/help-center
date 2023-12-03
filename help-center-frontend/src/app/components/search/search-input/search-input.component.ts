import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      query: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.searchForm) {
      const queryControl = this.searchForm.get('query');
      
      if (queryControl && queryControl.value) {
        const query = queryControl.value;
        this.router.navigate(['/search'], { queryParams: { query } });
      }
    }
  }
}
