type UserTypeface =
  | 'id'
  | 'full_name'
  | 'age'
  | 'email'
  | 'password'
  | 'is_remove';

type ImageTypeface =
  | 'id'
  | 'name'
  | 'file_name'
  | 'description'
  | 'created_by_id'
  | 'is_remove';

type SavedImageTypeface = 'id' | 'image_id' | 'saved_by_id' | 'is_remove';

type CommentTypeface =
  | 'id'
  | 'image_id'
  | 'content'
  | 'date'
  | 'created_by_id'
  | 'is_remove';

export class ResponseTemplate {
  isExcluded(fieldName: string, excluding: string[]): boolean {
    return excluding.indexOf(fieldName) !== -1;
  }

  user(excluding: UserTypeface[] = []) {
    return {
      id: !this.isExcluded('id', excluding),
      full_name: !this.isExcluded('full_name', excluding),
      age: !this.isExcluded('age', excluding),
      email: !this.isExcluded('email', excluding),
      password: !this.isExcluded('password', excluding),
      avatar: !this.isExcluded('avatar', excluding),
      is_remove: false,
    };
  }

  image(excluding: ImageTypeface[] = []) {
    return {
      id: !this.isExcluded('id', excluding),
      name: !this.isExcluded('name', excluding),
      file_name: !this.isExcluded('file_name', excluding),
      description: !this.isExcluded('description', excluding),
      created_by_id: !this.isExcluded('created_by_id', excluding),
      is_remove: false,
    };
  }

  savedImage(excluding: SavedImageTypeface[] = []) {
    return {
      id: !this.isExcluded('id', excluding),
      image_id: !this.isExcluded('image_id', excluding),
      saved_by_id: !this.isExcluded('saved_by_id', excluding),
      is_remove: false,
    };
  }

  comment(excluding: CommentTypeface[] = []) {
    return {
      id: !this.isExcluded('id', excluding),
      image_id: !this.isExcluded('image_id', excluding),
      content: !this.isExcluded('content', excluding),
      date: !this.isExcluded('date', excluding),
      created_by_id: !this.isExcluded('created_by_id', excluding),
      is_remove: false,
    };
  }
}
