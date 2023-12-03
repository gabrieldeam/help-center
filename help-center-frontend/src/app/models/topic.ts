export interface Topic {
    _id: string;
    name: string;
    imagePath?: string;
    image?: File;
    sections?: string[]; // Array de IDs das Seções associadas
    articles?: string[]; // Array de IDs dos Artigos associados
  }