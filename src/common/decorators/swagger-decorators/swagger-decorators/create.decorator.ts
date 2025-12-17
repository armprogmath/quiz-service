import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';

export function ApiCreate(name, requestDto, responseDto) {
    return applyDecorators(
        ApiBearerAuth('access-token'),

        ApiOperation({ summary: `Create a new ${name}` }),

        ApiBody({
            type: requestDto,
            description: `Data required to create a new ${name}`,
        }),

        ApiResponse({
            status: 201,
            description: `${name} successfully created`,
            type: responseDto,
        }),

        ApiResponse({ status: 400, description: 'Validation error' }),
        ApiResponse({ status: 401, description: 'Unauthorized - invalid token' }),
        ApiResponse({ status: 403, description: 'Forbidden - insufficient role' }),
    );
}
