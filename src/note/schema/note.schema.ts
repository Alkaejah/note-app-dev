import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true })
  userId!: string;
  @Prop()
  title!: string;
  @Prop()
  content?: string;
  @Prop({ type: [String], default: [] })
  tags!: string[];
  @Prop()
  category?: string;
}

export const notesSchema = SchemaFactory.createForClass(Note);
