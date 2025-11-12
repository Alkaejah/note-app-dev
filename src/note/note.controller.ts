import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../types/auth.types';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('notes')
@ApiBearerAuth('JWT-auth')
@Controller('api/notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Create Note Controller
  @Post()
  @ApiOperation({
    summary: 'Create a new note',
    description: 'Creates a new note for the authenticated user.',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({
    status: 201,
    description: 'Note created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Note succesffully created.' },
        newNote: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'My Note' },
            content: { type: 'string', example: 'Note content' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['work', 'important'],
            },
            category: { type: 'string', example: 'Work' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id.toString();
    const newNote = await this.noteService.createNote(createNoteDto, userId);
    return {
      message: 'Note succesffully created.',
      newNote,
    };
  }

  // Get All Notes Controller
  @Get()
  @ApiOperation({
    summary: 'Get notes for the authenticated user',
    description:
      'Retrieves paginated notes belonging to the currently authenticated user with optional filtering by tag or category.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    description: 'Filter by tag',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Notes retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        notes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
              category: { type: 'string' },
              userId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 3 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
  async getAllNotes(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tag') tag?: string,
    @Query('category') category?: string,
  ) {
    const userId = req.user._id.toString();
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return await this.noteService.getNotesByUser(
      userId,
      pageNum,
      limitNum,
      tag,
      category,
    );
  }

  // Get Note By Id Controller
  @Get(':noteId')
  @ApiOperation({
    summary: 'Get a specific note by ID',
    description:
      'Retrieves a single note by its ID, but only if it belongs to the authenticated user.',
  })
  @ApiParam({ name: 'noteId', description: 'The ID of the note to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Note retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Result' },
        note: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
  @ApiResponse({
    status: 404,
    description: 'Note not found or does not belong to user',
  })
  async getNoteById(
    @Param('noteId') noteId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id.toString();
    const note = await this.noteService.getNoteById(noteId, userId);
    return {
      message: 'Result',
      note,
    };
  }

  // Update Note Controller
  @Put(':noteId')
  @ApiOperation({
    summary: 'Update a note',
    description:
      'Updates an existing note, but only if it belongs to the authenticated user.',
  })
  @ApiParam({ name: 'noteId', description: 'The ID of the note to update' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 200,
    description: 'Note updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Note successfully updated.' },
        updatedNote: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - note does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async updateNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id.toString();
    const updatedNote = await this.noteService.updateNote(
      noteId,
      updateNoteDto,
      userId,
    );
    return {
      message: 'Note successfully updated.',
      updatedNote,
    };
  }

  // Delete Note Controller
  @Delete(':noteId')
  @ApiOperation({
    summary: 'Delete a note',
    description:
      'Deletes an existing note, but only if it belongs to the authenticated user.',
  })
  @ApiParam({ name: 'noteId', description: 'The ID of the note to delete' })
  @ApiResponse({
    status: 200,
    description: 'Note deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Note successfully deleted.' },
        deletedNote: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - note does not belong to user',
  })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async deleteNote(
    @Param('noteId') noteId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user._id.toString();
    const deletedNote = await this.noteService.deleteNote(noteId, userId);
    return {
      message: 'Note successfully deleted.',
      deletedNote,
    };
  }
}
