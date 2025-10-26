import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import * as pactum from 'pactum';

import { AppModule } from '@/app.module';
import { AuthDto } from '@/auth/dto/auth.dto';
import { ConfigService } from '@/config/config.service';
import { PrismaService } from '@/prisma/prisma.service';
import { EditUserDto } from '@/user/dto/edit-user.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let config: ConfigService;

  beforeAll(async () => {
    const moduleref = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleref.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    config = app.get(ConfigService);

    pactum.request.setBaseUrl(config.baseUrl as string);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'me@email.com',
      password: 'super-secret',
    };

    describe('Signup', () => {
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400).inspect();
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400) // thrown by validation pipe
          .inspect(); // consoles the response
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Signin', () => {
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400).inspect();
      });

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400) // thrown by validation pipe
          .inspect();
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
          .inspect();
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('accessToken', 'access_token') // gets access_token from body and stores it in a variable accessToken
          .inspect();
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}', // $S -> stands for store
          })
          .expectStatus(200)
          .inspect();
      });
    });

    describe('Edit User', () => {
      const dto: EditUserDto = {
        firstname: 'John',
        lastname: 'Gotti',
      };

      it('should get current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstname) // checks the validity of the response returned
          .expectBodyContains(dto.lastname)
          .inspect();
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
});
