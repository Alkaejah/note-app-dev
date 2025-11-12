// import { Controller, Get, UseGuards, Req } from '@nestjs/common';
// import type { Request } from 'express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';

// @ApiTags('users')
// @ApiBearerAuth('JWT-auth')
// @Controller('api/users')
// @UseGuards(JwtAuthGuard)
// export class UsersController {
//   @Get()
//   @ApiOperation({
//     summary: 'Get all users',
//     description: 'Retrieves paginated list of all users (Admin only).',
//   })
//   @ApiResponse({
//     status: 200,
//     description: 'Users retrieved successfully',
//     schema: {
//       type: 'object',
//       properties: {
//         users: {
//           type: 'array',
//           items: {
//             type: 'object',
//             properties: {
//               _id: { type: 'string' },
//               email: { type: 'string' },
//               name: { type: 'string' },
//               profilePicture: { type: 'string' },
//               createdAt: { type: 'string', format: 'date-time' },
//               updatedAt: { type: 'string', format: 'date-time' },
//             },
//           },
//         },
//         total: { type: 'number', example: 25 },
//         page: { type: 'number', example: 1 },
//         limit: { type: 'number', example: 10 },
//         totalPages: { type: 'number', example: 3 },
//       },
//     },
//   })
//   @ApiResponse({ status: 401, description: 'Unauthorized - invalid JWT token' })
//   @ApiResponse({
//     status: 403,
//     description: 'Forbidden - admin access required',
//   })
//   async getAllUsers(@Req() req: Request) {
//     // For now, return mock data - in a real app this would query the database
//     const page = req.query.page;
//     const limit = req.query.limit;
//     const pageNum = typeof page === 'string' && page ? parseInt(page, 10) : 1;
//     const limitNum =
//       typeof limit === 'string' && limit ? parseInt(limit, 10) : 10;

//     // Mock users data
//     const mockUsers = [
//       {
//         _id: '507f1f77bcf86cd799439011',
//         email: 'user1@example.com',
//         name: 'User One',
//         profilePicture: 'https://example.com/avatar1.jpg',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//       {
//         _id: '507f1f77bcf86cd799439012',
//         email: 'user2@example.com',
//         name: 'User Two',
//         profilePicture: 'https://example.com/avatar2.jpg',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ];

//     const total = mockUsers.length;
//     const totalPages = Math.ceil(total / limitNum);
//     const startIndex = (pageNum - 1) * limitNum;
//     const endIndex = startIndex + limitNum;
//     const paginatedUsers = mockUsers.slice(startIndex, endIndex);

//     return {
//       users: paginatedUsers,
//       total,
//       page: pageNum,
//       limit: limitNum,
//       totalPages,
//     };
//   }
// }
