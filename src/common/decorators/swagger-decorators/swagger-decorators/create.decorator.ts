import { applyDecorators, Type } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export function ApiCreate(
    name: string,
    requestDto: Type<unknown>,
    responseDto: Type<unknown>,
    includeIdParam = false,
    notFoundName?: string
) {
    const decorators = [
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
    ];

    // Conditionally add ID param and 404 response
    if (includeIdParam) {
        decorators.push(
            ApiParam({
                name: 'id',
                type: Number,
                required: true,
                example: 1,
            }),
            ApiResponse({ status: 404, description: `${notFoundName} not found` }),
        );
    }

    return applyDecorators(...decorators);
}