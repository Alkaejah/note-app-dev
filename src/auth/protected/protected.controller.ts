import { Controller, Get } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  getProtected() {
    return 'This is a protected route!';
  }
}
