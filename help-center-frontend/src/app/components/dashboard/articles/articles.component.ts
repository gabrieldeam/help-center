import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CreateArticlesComponent } from './create-articles/create-articles.component';
import { UpdateArticlesComponent } from './update-articles/update-articles.component';
import { ModalService } from '../../../services/modal/modal.service';
import { ArticlesService } from '../../../services/articles/articles.service';
import { Article } from '../../../models/article';
import { Section } from '../../../models/section';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  sections: Section[] = [];
  topics: Topic[] = [];

  constructor(private modalService: ModalService, private articlesService: ArticlesService ) {}

  ngOnInit(): void {
    this.getArticles();
    const UpdateInterval = interval(1000); // Atualize a cada 1 segundo
    UpdateInterval.subscribe(() => {
      this.getArticles();
    });
  }

  getArticles(): void {
    this.articlesService.getArticle().subscribe(
      (articles) => {
        this.articles = articles;
        console.log(this.articles);
      },
      (error) => {
        console.error('Erro ao obter artigos:', error);
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

  deleteArticle(id: string): void {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      this.articlesService.deleteArticle(id).subscribe(
        (response) => {
          console.log(response.message);
          this.getArticles(); // Atualiza a lista após a exclusão
        },
        (error) => {
          console.error('Erro ao excluir seção:', error);
          // Trate o erro conforme necessário.
        }
      );
    }
  }

  toggleUseful(article: Article): void {
    // Inverte o valor de 'useful'
    const updatedArticle: { title: string; content: string; useful: boolean; sectionId: string } = {
      title: article.title,
      content: article.content,
      useful: !article.useful, // Inverte o valor atual de 'useful'
      sectionId: article.sectionId,
    };
  
    this.articlesService.updateArticle(article._id, updatedArticle).subscribe(
      (updated) => {
        console.log('Useful status updated successfully:', updated);
        this.getArticles(); // Atualiza a lista após a atualização
      },
      (error) => {
        console.error('Erro ao atualizar o status useful:', error);
        // Trate o erro conforme necessário.
      }
    );
  }
  
  

  openCreateTopicModal(): void {
    this.modalService.openCreateModal(CreateArticlesComponent);
  }

  openUpdateArticlesModal(article: Article): void {
    const modalRef = this.modalService.openCreateModal(UpdateArticlesComponent);
    if (modalRef.componentInstance instanceof UpdateArticlesComponent) {
      modalRef.componentInstance.article = article;
    }
  }
}
