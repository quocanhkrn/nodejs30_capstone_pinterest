export class Comment {
  id: number;
  image_id: number;
  content: string;
  created_by_id: number;
  date: Date;
  is_remove?: 'true' | 'false';
}
