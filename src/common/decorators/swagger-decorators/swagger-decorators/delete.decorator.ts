import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';

export function ApiDelete(name: string, responseDto: any) {
    return applyDecorators(
        ApiBearerAuth('access-token'),

        ApiOperation({ summary: `Delete ${name} by ID` }),

        ApiParam({
            name: 'id',
            type: Number,
            required: true,
            example: 1,
        }),

        ApiResponse({
            status: 200,
            description: `${name} deleted successfully`,
            type: responseDto,
        }),

        ApiResponse({ status: 401, description: 'Unauthorized - invalid token' }),
        ApiResponse({ status: 403, description: 'Forbidden - insufficient role' }),
        ApiResponse({ status: 404, description: `${name} not found` }),
    );
}
