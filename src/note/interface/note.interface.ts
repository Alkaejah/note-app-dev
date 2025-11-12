import { Document } from 'mongoose';
export interface INote extends Document {
  _id: string;
  readonly title: string;
  readonly content?: string;
  readonly userId: string;
  readonly tags: string[];
  readonly category?: string;
}
