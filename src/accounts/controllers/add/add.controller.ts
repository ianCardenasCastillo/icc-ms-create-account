import { LoggerService } from '@icc-dev/icc-log-service'
import { Controller, Post, Res, Body, HttpStatus, HttpCode, Version, Inject } from '@nestjs/common';
import { Response } from 'express';
import { CreateAccountDto } from '@accounts/dto/create-account.dto';
import { AccountsService } from '@accounts/services/accounts/accounts.service';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatedAccountDto } from '@accounts/dto/created-account.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, EMPTY, of } from 'rxjs';

@Controller('add')
@ApiTags('create')
export class AddController {
    constructor(
        private accountsService: AccountsService,
        private loggerService: LoggerService,
        @Inject('EMAIL_SERVICE') private emailService: ClientProxy,
    ) { }

    @Post()
    @HttpCode(201)
    @Version('1')
    @ApiCreatedResponse({
        description: 'The account has been successfully created.',
        type: CreatedAccountDto,
      })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Unprocessable entity.'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error in proccess.'})
    async createAccount(@Res() res: Response, @Body() createAccountDto: CreateAccountDto) {
        try {
            this.loggerService.log('Create account controller init');
            if (!createAccountDto || !Object.keys(createAccountDto).length) {
                this.loggerService.warn('Unprocessable entity', createAccountDto);
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
            }
            const accountCreated = await this.accountsService.addAccount(createAccountDto, this.loggerService);
            this.loggerService.log('Add account intruction finished correctly', accountCreated);
            this.emailService.emit('account_created', accountCreated).pipe(
                catchError(() => {
                    of(this.loggerService.warn('Error while emit message account_created'))
                    return EMPTY
                })
            )
            return res.status(HttpStatus.CREATED).send({accountCreated});
        } catch (error) {
            this.loggerService.error('An error has occurred', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error
            });
        }
    }
}
