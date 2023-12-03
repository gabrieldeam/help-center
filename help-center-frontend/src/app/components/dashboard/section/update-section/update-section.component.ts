import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { SectionService } from '../../../../services/section/section.service';
import { TopicService } from '../../../../services/topics/topic.service';
import { Section } from '../../../../models/section';
import { Topic } from '../../../../models/topic';

@Component({
  selector: 'app-update-section',
  templateUrl: './update-section.component.html',
  styleUrls: ['./update-section.component.sass']
})
export class UpdateSectionComponent implements OnInit {
  @Input() section: Section | undefined;
  topics: Topic[] = [];
  sectionForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private sectionService: SectionService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    if (!this.section) {
      // Se a seção não estiver definida, feche o modal ou tome a ação apropriada.
      this.closeModal();
      return;
    }
  
    // Carregar tópicos para seleção no formulário
    this.topicService.getTopics().subscribe(
      (topics) => {
        this.topics = topics;
  
        // Certifique-se de que os dados foram carregados antes de construir o formulário
        if (this.section && this.topics.length > 0) {
          // Inicializar o formulário aqui, após obter a lista de tópicos
          this.sectionForm = this.formBuilder.group({
            name: [this.section.name, [Validators.required, Validators.minLength(3)]],
            topicId: [this.section.topicId, Validators.required],
          });
        } else {
          console.error('Erro ao obter dados para inicializar o formulário.');
          // Trate o erro conforme necessário.
          this.closeModal();
        }
      },
      (error) => {
        console.error('Erro ao obter tópicos:', error);
        // Trate o erro conforme necessário.
        this.closeModal();
      }
    );
  }

  closeModal(): void {
    this.modalService.closeCreateModal();
  }

  onSubmit(): void {
    if (this.sectionForm.valid && this.section) {
      const sectionName = this.sectionForm.get('name')?.value;
      const topicId = this.sectionForm.get('topicId')?.value;

      console.log('Section Name:', sectionName);
      console.log('Topic ID:', topicId);

      if (!sectionName || !topicId) {
        console.error('Nome da seção ou ID do tópico está faltando.');
        return;
      }

      this.sectionService.updateSection(this.section._id, { name: sectionName, topicId: topicId }).subscribe(
        (updatedSection) => {
          console.log('Seção atualizada com sucesso:', updatedSection);
          this.closeModal();
          // Você pode adicionar lógica adicional aqui, como atualizar a lista de seções.
        },
        (error) => {
          console.error('Erro ao atualizar seção:', error);
          // Trate o erro conforme necessário.
        }
      );
    }
  }
}