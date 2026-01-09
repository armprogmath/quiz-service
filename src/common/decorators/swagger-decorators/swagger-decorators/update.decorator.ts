import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation, ApiParam,
    ApiResponse,
} from '@nestjs/swagger';

export function ApiUpdate(name, requestDto, responseDto) {
    return applyDecorators(
        ApiBearerAuth('access-token'),

        ApiOperation({ summary: `Update ${name} by ID ` }),

        ApiParam({
            name: 'id',
            type: Number,
            required: true,
            example: 1,
        }),

        ApiBody({
            type: requestDto,
            description: `Fields to update (only include fields you want to change)`,
        }),

        ApiResponse({
            status: 200,
            description: `${name} updated successfully`,
            type: responseDto,
        }),

        ApiResponse({ status: 400, description: 'Validation error' }),
        ApiResponse({ status: 401, description: 'Unauthorized - invalid token' }),
        ApiResponse({ status: 403, description: 'Forbidden - insufficient role' }),
        ApiResponse({ status: 404, description: `${name} not found` }),
    );
}
