import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { ArticlesService } from '../../../../services/articles/articles.service';
import { SectionService } from '../../../../services/section/section.service'; 
import { Section } from '../../../../models/section'; // Importar o modelo de seção

@Component({
  selector: 'app-create-articles',
  templateUrl: './create-articles.component.html',
  styleUrls: ['./create-articles.component.sass']
})
export class CreateArticlesComponent implements OnInit {
  sections: Section[] = [];
  articleForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private articlesService: ArticlesService,
    private sectionsService: SectionService
  ) {}

  ngOnInit(): void {
    this.sectionsService.getSections().subscribe(
      (sections) => {
        this.sections = sections;

        this.articleForm = this.formBuilder.group({
          title: ['', [Validators.required, Validators.minLength(3)]],
          content: ['', [Validators.required, Validators.minLength(10)]],
          useful: [false, Validators.required],
          sectionId: [this.sections.length > 0 ? this.sections[0]._id : '', Validators.required],
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
    if (this.articleForm.valid) {
      const title = this.articleForm.get('title')?.value;
      const content = this.articleForm.get('content')?.value;
      const useful = this.articleForm.get('useful')?.value;
      const sectionId = this.articleForm.get('sectionId')?.value;

      this.articlesService.createArticle({ title, content, useful, sectionId }).subscribe(
        (newArticle) => {
          console.log('Artigo criado com sucesso:', newArticle);
          this.closeModal();
          // Adicione lógica adicional aqui, como atualizar a lista de artigos.
        },
        (error) => {
          console.error('Erro ao criar artigo:', error);
        }
      );
    }
  }
}