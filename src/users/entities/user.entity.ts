export class User {
  id: number;
  full_name: string;
  age: number;
  email: string;
  password?: string;
  avatar: string;
  is_remove?: 'true' | 'false';
}
