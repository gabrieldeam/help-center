import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { CreateSectionComponent } from './create-section/create-section.component';
import { UpdateSectionComponent } from './update-section/update-section.component';
import { ModalService } from '../../../services/modal/modal.service';
import { SectionService } from '../../../services/section/section.service';
import { Section } from '../../../models/section';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.sass']
})
export class SectionComponent {
  sections: Section[] = [];
  topics: Topic[] = [];
  
  constructor(private modalService: ModalService, private sectionService: SectionService) {}

  ngOnInit(): void {
    this.getSections();
    const UpdateInterval = interval(1000); // Atualize a cada 1 segundo
    UpdateInterval.subscribe(() => {
      this.getSections();
    });
  }

  getSections(): void {
    this.sectionService.getSections().subscribe(
      (sections) => {
        this.sections = sections;
        // console.log(this.sections); // Verifique se a propriedade topic está presente e populada corretamente
      },
      (error) => {
        console.error('Erro ao obter seções:', error);
        // Trate o erro conforme necessário.
      }
    );
  }

  getTopicName(topicId: string | any): string {
    // Se não houver ID de tópico, retorne uma string indicando que o nome não foi encontrado
    if (!topicId) {
      return 'Nome do Tópico Não Encontrado';
    }
  
    // Se o topicId é um objeto, assumimos que é um objeto de tópico e extraímos o nome
    if (typeof topicId === 'object' && topicId.name) {
      return topicId.name;
    }
  
    // Caso contrário, o topicId deve ser uma string, podemos usar diretamente
    const topic = this.topics.find(t => t._id === topicId);
  
    // Se o tópico for encontrado, retorne o nome, senão retorne uma mensagem indicando que o nome não foi encontrado
    return topic ? topic.name : 'Nome do Tópico Não Encontrado';
  }

  deleteSection(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta seção?')) {
      this.sectionService.deleteSection(id).subscribe(
        (response) => {
          console.log(response.message);
          this.getSections(); // Atualiza a lista após a exclusão
        },
        (error) => {
          console.error('Erro ao excluir seção:', error);
          // Trate o erro conforme necessário.
        }
      );
    }
  }

  openCreateSectionModal(): void {
    this.modalService.openCreateModal(CreateSectionComponent);
  }

  // Abrir a edição de seção
  openUpdateSectionModal(section: Section): void {
    const modalRef = this.modalService.openCreateModal(UpdateSectionComponent);
    if (modalRef.componentInstance instanceof UpdateSectionComponent) {
      modalRef.componentInstance.section = section;
    }
  }
}
