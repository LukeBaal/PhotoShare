export interface Label {
  mid: string;
  description: string;
  score: number;
  topicality: number;
}

export interface Photo {
  id: string;
  name: string;
  filename: string;
  url: string;
  publicUrl: string;
  user: string;
  labels: Label[];
}
