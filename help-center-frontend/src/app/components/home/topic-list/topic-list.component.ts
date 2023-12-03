import { Component, OnInit } from '@angular/core';
import { TopicService } from '../../../services/topics/topic.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {
  topics: any[] = [];

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
    this.getTopics();
  }

  getTopics(): void {
    this.topicService.getTopics()
      .subscribe(topics => this.topics = topics);
  }
}