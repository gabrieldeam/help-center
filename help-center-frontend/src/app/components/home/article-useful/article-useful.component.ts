import { Component, OnInit } from '@angular/core';
import { ArticlesService } from '../../../services/articles/articles.service';
import { Article } from '../../../models/article';
import { Section } from '../../../models/section';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-article-useful',
  templateUrl: './article-useful.component.html',
  styleUrls: ['./article-useful.component.css']
})
export class ArticleUsefulComponent implements OnInit {
  usefulArticles: Article[] = [];
  sections: Section[] = [];
  topics: Topic[] = [];

  constructor(private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.getUsefulArticles();
  }

  getUsefulArticles(): void {
    this.articlesService.getArticle().subscribe(
      (articles) => {
        this.usefulArticles = articles.filter((article) => article.useful === true);
      },
      (error) => {
        console.error('Erro ao obter artigos úteis:', error);
      }
    );
  }

  getSectionName(sectionId: string | any): string {
    // Se não houver ID de Seção, retorne uma string indicando que o nome não foi encontrado
    if (!sectionId) {
      return 'Nome do Seção Não Encontrado';
    }
  
    // Se o topicId é um objeto, assumimos que é um objeto de Seção e extraímos o nome
    if (typeof sectionId === 'object' && sectionId.name) {
      return sectionId.name;
    }
  
    // Caso contrário, o sectionId deve ser uma string, podemos usar diretamente
    const section = this.sections.find(s => s._id === sectionId);
  
    // Se o Seção for encontrado, retorne o nome, senão retorne uma mensagem indicando que o nome não foi encontrado
    return section ? section.name : 'Nome da Seção Não Encontrado';
  }

  getTopicName(section: any): string {
    if (!section) {
      return 'Nome do Tópico Não Encontrado';
    }
  
    if (section.topicId && section.topicId.name) {
      return section.topicId.name;
    } else {
      return 'Nome do Tópico Não Encontrado';
    }
  }
}