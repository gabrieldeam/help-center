import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { TopicService } from '../../../../services/topics/topic.service';
import { Topic } from '../../../../models/topic';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.sass']
})
export class CreateTopicComponent {
  constructor(private modalService: ModalService, private formBuilder: FormBuilder, private topicService: TopicService) {}

  closeModal(): void {
    this.modalService.closeCreateModal();
  }

  topicForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    image: [null, Validators.required] // Adicionado campo de upload de imagem
  });

  // Método para lidar com a seleção de arquivo
  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.topicForm.patchValue({
        image: file
      });
    }
  }

  onSubmit(): void {
    if (this.topicForm.valid) {
      const topicName = this.topicForm.get('name')?.value;
  
      // Obtenha o arquivo da entrada do formulário
      const imageInput = document.getElementById('image') as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];
  
      if (imageFile) {
        const topicData = { name: topicName, image: imageFile };
        
        this.topicService.createTopic(topicData).subscribe(
          (newTopic) => {
            console.log('Tópico criado com sucesso:', newTopic);
            this.closeModal();
            // Você pode adicionar lógica adicional aqui, como atualizar a lista de tópicos.
          },
          (error) => {
            console.error('Erro ao criar tópico:', error);
            // Trate o erro conforme necessário.
          }
        );
      } else {
        console.error('Nenhum arquivo de imagem selecionado.');
      }
    }
  }
}
