import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NoteService } from './note.service';
import { INote } from './interface/note.interface';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

describe('NoteService', () => {
  let service: NoteService;
  let mockNoteModel: any;

  const mockNote: INote = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Note',
    content: 'Test content',
    tags: ['test', 'important'],
    category: 'Work',
    userId: 'userId',
  } as INote;

  beforeEach(async () => {
    const mockNoteInstance = {
      ...mockNote,
      save: jest.fn().mockResolvedValue(mockNote),
    };

    mockNoteModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest
        .fn()
        .mockResolvedValue({ ...data, _id: '507f1f77bcf86cd799439011' }),
    }));

    // Add static methods
    mockNoteModel.find = jest.fn();
    mockNoteModel.findById = jest.fn();
    mockNoteModel.findOne = jest.fn();
    mockNoteModel.findByIdAndUpdate = jest.fn();
    mockNoteModel.findOneAndUpdate = jest.fn();
    mockNoteModel.findOneAndDelete = jest.fn();
    mockNoteModel.findByIdAndDelete = jest.fn();
    mockNoteModel.countDocuments = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: getModelToken('Note'),
          useValue: mockNoteModel,
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Test content',
        tags: ['test'],
        category: 'Work',
      };
      const userId = 'userId';

      const mockNoteInstance = {
        ...createNoteDto,
        userId,
        _id: '507f1f77bcf86cd799439011',
        save: jest.fn().mockResolvedValue(mockNote),
      };

      mockNoteModel.mockReturnValue(mockNoteInstance);

      const result = await service.createNote(createNoteDto, userId);

      expect(mockNoteModel).toHaveBeenCalledWith({
        ...createNoteDto,
        userId,
      });
      expect(result).toEqual(mockNote);
    });
  });

  describe('getNotesByUser', () => {
    it('should return paginated notes for user', async () => {
      const userId = 'userId';
      const page = 1;
      const limit = 10;
      const tag = 'test';
      const category = 'Work';

      const mockNotes = [mockNote];
      const total = 1;

      mockNoteModel.countDocuments.mockResolvedValue(total);
      mockNoteModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockNotes),
          }),
        }),
      });

      const result = await service.getNotesByUser(
        userId,
        page,
        limit,
        tag,
        category,
      );

      expect(mockNoteModel.countDocuments).toHaveBeenCalledWith({
        userId,
        tags: tag,
        category,
      });
      expect(result).toEqual({
        notes: mockNotes,
        total,
        page,
        limit,
        totalPages: 1,
      });
    });

    it('should return paginated notes without filters', async () => {
      const userId = 'userId';
      const page = 1;
      const limit = 10;

      const mockNotes = [mockNote];
      const total = 1;

      mockNoteModel.countDocuments.mockResolvedValue(total);
      mockNoteModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockNotes),
          }),
        }),
      });

      const result = await service.getNotesByUser(userId, page, limit);

      expect(mockNoteModel.countDocuments).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({
        notes: mockNotes,
        total,
        page,
        limit,
        totalPages: 1,
      });
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id and userId', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';

      mockNoteModel.findOne.mockResolvedValue(mockNote);

      const result = await service.getNoteById(noteId, userId);

      expect(mockNoteModel.findOne).toHaveBeenCalledWith({
        _id: noteId,
        userId,
      });
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note not found', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';

      mockNoteModel.findOne.mockResolvedValue(null);

      await expect(service.getNoteById(noteId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid note ID format', async () => {
      const invalidNoteId = 'invalid-id-format';
      const userId = 'userId';

      await expect(service.getNoteById(invalidNoteId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';
      const updateNoteDto: UpdateNoteDto = {
        title: 'Updated Note',
        tags: ['updated'],
      };

      const updatedNote = { ...mockNote, ...updateNoteDto };

      mockNoteModel.findById.mockResolvedValue(mockNote);
      mockNoteModel.findOneAndUpdate.mockResolvedValue(updatedNote);

      const result = await service.updateNote(noteId, updateNoteDto, userId);

      expect(mockNoteModel.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: noteId, userId },
        updateNoteDto,
        { new: true },
      );
      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';
      const updateNoteDto: UpdateNoteDto = { title: 'Updated Note' };

      mockNoteModel.findById.mockResolvedValue(null);

      await expect(
        service.updateNote(noteId, updateNoteDto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if note exists but user does not own it', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';
      const updateNoteDto: UpdateNoteDto = { title: 'Updated Note' };

      mockNoteModel.findById.mockResolvedValue(mockNote);
      mockNoteModel.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        service.updateNote(noteId, updateNoteDto, userId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException for invalid note ID format in update', async () => {
      const invalidNoteId = 'invalid-id-format';
      const userId = 'userId';
      const updateNoteDto: UpdateNoteDto = { title: 'Updated Note' };

      await expect(
        service.updateNote(invalidNoteId, updateNoteDto, userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';

      mockNoteModel.findById.mockResolvedValue(mockNote);
      mockNoteModel.findOneAndDelete.mockResolvedValue(mockNote);

      const result = await service.deleteNote(noteId, userId);

      expect(mockNoteModel.findById).toHaveBeenCalledWith(noteId);
      expect(mockNoteModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: noteId,
        userId,
      });
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note does not exist', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';

      mockNoteModel.findById.mockResolvedValue(null);

      await expect(service.deleteNote(noteId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if note exists but user does not own it', async () => {
      const noteId = '507f1f77bcf86cd799439011';
      const userId = 'userId';

      mockNoteModel.findById.mockResolvedValue(mockNote);
      mockNoteModel.findOneAndDelete.mockResolvedValue(null);

      await expect(service.deleteNote(noteId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException for invalid note ID format in delete', async () => {
      const invalidNoteId = 'invalid-id-format';
      const userId = 'userId';

      await expect(service.deleteNote(invalidNoteId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
