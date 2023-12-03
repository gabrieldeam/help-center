export interface Article {
    _id: string;
    title: string;
    content: string;
    useful?: boolean;
    sectionId: string;
    topicId?: string;
  }