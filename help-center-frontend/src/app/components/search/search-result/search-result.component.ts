import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../services/articles/articles.service';
import { Article } from '../../../models/article';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  query!: string;
  searchResults: Article[] = [];

  constructor(private route: ActivatedRoute, private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
      this.searchArticles();
    });
  }

  searchArticles(): void {
    if (this.query) {
      this.articlesService.searchArticles(this.query).subscribe(
        (results) => {
          this.searchResults = results;
        },
        (error) => {
          console.error('Erro ao buscar artigos:', error);
        }
      );
    }
  }
}