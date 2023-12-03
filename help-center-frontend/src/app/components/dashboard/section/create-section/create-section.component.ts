import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { SectionService } from '../../../../services/section/section.service';
import { TopicService } from '../../../../services/topics/topic.service';
import { Topic } from '../../../../models/topic';

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.sass']
})
export class CreateSectionComponent implements OnInit {
  topics: Topic[] = [];
  sectionForm!: FormGroup; // Adiciona '!' para indicar que será inicializada no construtor

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private sectionService: SectionService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    // Carregar tópicos para seleção no formulário
    this.topicService.getTopics().subscribe(
      (topics) => {
        this.topics = topics;

        // Inicializar o formulário aqui, após obter a lista de tópicos
        this.sectionForm = this.formBuilder.group({
          name: ['', [Validators.required, Validators.minLength(3)]],
          topicId: [this.topics.length > 0 ? this.topics[0]._id : '', Validators.required],
        });
      },
      (error) => {
        console.error('Erro ao obter tópicos:', error);
        // Trate o erro conforme necessário.
      }
    );
  }

  closeModal(): void {
    this.modalService.closeCreateModal();
  }


  onSubmit(): void {
    if (this.sectionForm.valid) {
      const sectionName = this.sectionForm.get('name')?.value;
      const topicId = this.sectionForm.get('topicId')?.value;

      console.log('Section Name:', sectionName);
      console.log('Topic ID:', topicId);

      if (!sectionName || !topicId) {
        console.error('Nome da seção ou ID do tópico está faltando.');
        return;
      }

      this.sectionService.createSection({ name: sectionName, topicId: topicId }).subscribe(
        (newSection) => {
          console.log('Seção criada com sucesso:', newSection);
          this.closeModal();
          // Você pode adicionar lógica adicional aqui, como atualizar a lista de seções.
        },
        (error) => {
          console.error('Erro ao criar seção:', error);
          // Trate o erro conforme necessário.
        }
      );
    }
  }
}
