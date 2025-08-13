export interface Pet {
  _id?: string;
  name: string;
  species: string;
  age: number;
  description: string;
  ownerId: string;
  likes: string[];
  comments: Comment[];
  imageUrl?: string;
}
