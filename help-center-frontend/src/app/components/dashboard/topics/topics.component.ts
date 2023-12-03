import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { UpdateTopicComponent } from './update-topic/update-topic.component';
import { ModalService } from '../../../services/modal/modal.service';
import { TopicService } from '../../../services/topics/topic.service';
import { Topic } from '../../../models/topic';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.sass']
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];

  constructor(private modalService: ModalService, private topicService: TopicService) {}

  ngOnInit(): void {
    this.getTopics();
    const UpdateInterval = interval(1000); // Atualize a cada 1 segundos
    UpdateInterval.subscribe(() => {
      this.getTopics();
    });
  }

  getTopics(): void {
    this.topicService.getTopics().subscribe(
      (topics) => {
        this.topics = topics;
        console.log(topics);
      },
      (error) => {
        console.error('Error getting topics:', error);
        // Trate o erro conforme necessário.
      }
    );
  }

  openCreateTopicModal(): void {
    this.modalService.openCreateModal(CreateTopicComponent);
  }

  deleteTopic(_id: string, imagePath: string | null): void {
    if (confirm('Tem certeza que deseja excluir este tópico?')) {
      this.topicService.deleteTopic(_id, imagePath).subscribe(
        () => {
          // Atualize a lista de tópicos após a exclusão
          this.getTopics();
        },
        (error) => {
          console.error('Error deleting topic:', error);
          // Trate o erro conforme necessário.
        }
      );
    }
  }

  openEditTopicModal(topic: Topic): void {
    const modalRef = this.modalService.openCreateModal(UpdateTopicComponent);
    if (modalRef.componentInstance instanceof UpdateTopicComponent) {
      modalRef.componentInstance.topic = topic;
    }
  }
  
}