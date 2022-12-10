import { LoggerService } from './../../../logger/logger.service';
import { Controller, Post, Res, Body, HttpStatus, HttpCode, Version, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { CreateAccountDto } from '../../../accounts/dto/create-account.dto';
import { AccountsService } from '../../../accounts/services/accounts/accounts.service';

@Controller('add')
export class AddController {
    constructor(
        private accountsService: AccountsService,
        private loggerService: LoggerService,
    ) {
        this.loggerService.setContext('AddController')
    }

    @Post()
    @HttpCode(201)
    @Version('1')
    async createAccount(@Res() res: Response, @Body() createAccountDto: CreateAccountDto) {
        try {
            this.loggerService.log('Create account controller init');
            if (!createAccountDto || !Object.keys(createAccountDto).length) {
                this.loggerService.error('Unprocessable entity');
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send();
            }
            const accountCreated = await this.accountsService.addAccount(createAccountDto);
            this.loggerService.log('Add account intruction finished correctly');
            return res.status(HttpStatus.CREATED).send({accountCreated});
        } catch (error) {
            this.loggerService.error('An error has occurred');
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error
            });
        }
    }
}
