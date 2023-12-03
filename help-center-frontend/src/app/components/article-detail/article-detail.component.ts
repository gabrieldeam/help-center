import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../services/articles/articles.service';
import { Section } from '../../models/section';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  sections: Section[] = [];
  topicImage: string | null = null;

  constructor(private route: ActivatedRoute, private articlesService: ArticlesService) {}

  ngOnInit(): void {
    // Recupera o parâmetro 'id' da rota.
    const articleId = this.route.snapshot.params['id'];

    // Use o serviço para obter o artigo com base no ID.
    this.articlesService.getArticleById(articleId).subscribe(
      (article) => {
        this.article = article;

        // Se houver uma seção e um tópico, obtenha o caminho da imagem do tópico
        if (this.article && this.article.sectionId && this.article.sectionId.topicId) {
          this.topicImage = this.article.sectionId.topicId.imagePath;
        }
      },
      (error) => {
        console.error('Erro ao obter o artigo:', error);
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

  getTopicImage(): string | null {
    return this.topicImage;
  }

}
