import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { INote } from './interface/note.interface';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

export interface NoteQuery {
  userId: string;
  tags?: string;
  category?: string;
}

export interface PaginatedNotesResult {
  notes: INote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class NoteService {
  constructor(@InjectModel('Note') private noteModel: Model<INote>) {}

  private validateObjectId(id: string, fieldName: string = 'ID'): void {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
  }

  // Create New Note
  async createNote(
    createNoteDto: CreateNoteDto,
    userId: string,
  ): Promise<INote> {
    const newNote = new this.noteModel({ ...createNoteDto, userId });
    return newNote.save();
  }

  // Get Notes by User with pagination and filtering
  async getNotesByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    tag?: string,
    category?: string,
  ): Promise<PaginatedNotesResult> {
    const query: NoteQuery = { userId };

    if (tag) {
      query.tags = tag;
    }

    if (category) {
      query.category = category;
    }

    const total = await this.noteModel.countDocuments(query);
    const skip = (page - 1) * limit;

    const notes = await this.noteModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    return {
      notes,
      total,
      page,
      limit,
      totalPages,
    };
  }

  // Get Note By Id
  async getNoteById(noteId: string, userId: string): Promise<INote> {
    this.validateObjectId(noteId, 'note ID');
    const note = await this.noteModel.findOne({ _id: noteId, userId });
    if (!note) {
      throw new NotFoundException('Note not found!');
    }
    return note;
  }

  // Update Note
  async updateNote(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<INote> {
    this.validateObjectId(noteId, 'note ID');

    // First check if the note exists at all
    const noteExists = await this.noteModel.findById(noteId);
    if (!noteExists) {
      throw new NotFoundException('Note not found!');
    }

    // If note exists, check ownership and update
    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: noteId, userId },
      updateNoteDto,
      { new: true },
    );
    if (!updatedNote) {
      throw new ForbiddenException(
        'You do not have permission to update this note!',
      );
    }
    return updatedNote;
  }

  // Delete Note
  async deleteNote(noteId: string, userId: string): Promise<INote> {
    this.validateObjectId(noteId, 'note ID');

    // First check if the note exists at all
    const noteExists = await this.noteModel.findById(noteId);
    if (!noteExists) {
      throw new NotFoundException('Note not found!');
    }

    // If note exists, check ownership and delete
    const deletedNote = await this.noteModel.findOneAndDelete({
      _id: noteId,
      userId,
    });
    if (!deletedNote) {
      throw new ForbiddenException(
        'You do not have permission to delete this note!',
      );
    }
    return deletedNote;
  }
}
