import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../services/topics/topic.service';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit {
  topic: any;
  sections: any[] = [];
  articles: any[] = [];

  constructor(private route: ActivatedRoute, private topicService: TopicService) {}

  ngOnInit(): void {
    this.getTopicDetails();
  }

  getTopicDetails(): void {
    const topicId = this.route.snapshot.paramMap.get('id');

    if (topicId) {
      this.topicService.getTopicById(topicId)
        .subscribe(topic => {
          this.topic = topic;
          this.sections = topic.sections || [];
          this.articles = topic.articles || [];
        });
    }
  }
}