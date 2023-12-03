import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { ModalService } from '../../../../services/modal/modal.service';
import { TopicService } from '../../../../services/topics/topic.service';
import { Topic } from '../../../../models/topic';

@Component({
  selector: 'app-update-topic',
  templateUrl: './update-topic.component.html',
  styleUrls: ['./update-topic.component.sass']
})
export class UpdateTopicComponent implements OnInit {
  @Input() topic!: Topic;

  updateTopicForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private topicService: TopicService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.updateTopicForm = this.formBuilder.group({
      name: [this.topic ? this.topic.name : '', [Validators.required, Validators.minLength(3)]],
      image: [null, Validators.required]
    });
  }
 

  closeModal(): void {
    this.modalService.closeCreateModal();
  }

  // Método para lidar com a seleção de arquivo
  onFileChange(event: Event): void {
    const inputElement = this.el.nativeElement.querySelector('#image');
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      // Limpe o valor do campo de arquivo
      this.updateTopicForm.get('image')?.setValue(inputElement.files[0]);
  
      // Atualize o formulário se necessário
      this.updateTopicForm.updateValueAndValidity();
    }
  }
  
  selectImage(): void {
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Simula o clique no input de arquivo
    }
  }

  onSubmit(): void {
    if (this.updateTopicForm.valid) {
      const updatedName = this.updateTopicForm.get('name')?.value;

      // Obtenha o arquivo da entrada do formulário
      const imageInput = document.getElementById('image') as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];

      // Se houver uma nova imagem, atualize também a imagem
      if (updatedName && imageFile) {
        const formData = new FormData();
        formData.append('name', updatedName);
        formData.append('image', imageFile);

        // Chame a função de atualização do serviço
        this.topicService.updateTopicWithImageAndDeleteOldImage(this.topic._id, formData).subscribe(
          (updatedTopic) => {
            console.log('Tópico atualizado com sucesso:', updatedTopic);
            this.closeModal();
          },
          (error) => {
            console.error('Erro ao atualizar tópico:', error);
          }
        );
      } else if (updatedName) {
        // Se não houver nova imagem, atualize apenas o nome
        this.topicService.updateTopic(this.topic._id, { name: updatedName }).subscribe(
          (updatedTopic) => {
            console.log('Tópico atualizado com sucesso:', updatedTopic);
            this.closeModal();
          },
          (error) => {
            console.error('Erro ao atualizar tópico:', error);
          }
        );
      }
    }
  }
}
