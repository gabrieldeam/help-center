import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { ArticlesService } from '../../../../services/articles/articles.service';
import { SectionService } from '../../../../services/section/section.service';
import { Article } from '../../../../models/article';
import { Section } from '../../../../models/section';

@Component({
  selector: 'app-update-articles',
  templateUrl: './update-articles.component.html',
  styleUrls: ['./update-articles.component.sass']
})
export class UpdateArticlesComponent implements OnInit {
  @Input() article: Article | undefined;
  sections: Section[] = [];
  articleForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private sectionService: SectionService,
    private articlesService: ArticlesService,
  ) {}

  ngOnInit(): void {
    if (!this.article) {
      // Se o artigo não estiver definido, feche o modal ou tome a ação apropriada.
      this.closeModal();
      return;
    }

    // Obtenha todas as seções disponíveis
    this.sectionService.getSections().subscribe(
      (sections) => {
        this.sections = sections;

        // Inicialize o formulário aqui
        this.articleForm = this.formBuilder.group({
          title: [this.article?.title, [Validators.required, Validators.minLength(3)]],
          content: [this.article?.content, [Validators.required, Validators.minLength(10)]],
          useful: [this.article?.useful, Validators.required],
          sectionId: [this.article?.sectionId as string, Validators.required],
        });
      },
      (error) => {
        console.error('Erro ao obter seções:', error);
      }
    );
  }

  closeModal(): void {
    this.modalService.closeCreateModal();
  }

  onSubmit(): void {
    if (this.articleForm.valid && this.article) {
      const title = this.articleForm.get('title')?.value;
      const content = this.articleForm.get('content')?.value;
      const useful = this.articleForm.get('useful')?.value;
      const sectionId = this.articleForm.get('sectionId')?.value;

      this.articlesService.updateArticle(this.article._id, { title, content, useful, sectionId }).subscribe(
        (updatedArticle) => {
          console.log('Artigo atualizado com sucesso:', updatedArticle);
          this.closeModal();
          // Adicione lógica adicional aqui, como atualizar a lista de artigos.
        },
        (error) => {
          console.error('Erro ao atualizar artigo:', error);
        }
      );
    }
  }
}
