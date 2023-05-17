export class Image {
  id: number;
  name: string;
  file_name: string;
  description: string;
  created_by_id: number;
  is_remove?: 'true' | 'false';
}
