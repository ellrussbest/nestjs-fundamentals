# **NestJS Validation**

## **1. DTOs with Validation Groups**

```ts
import { IsInt, IsString, Min } from 'class-validator';

export class UserDto {
  @IsString()
  username: string;

  @IsString({ groups: ['create'] })
  password: string;

  @IsInt({ groups: ['create'] })
  @Min(18, { groups: ['create'] })
  age: number;

  @IsString({ groups: ['update'] })
  email: string;
}
```

**Explanation:**

- `create` group → password + age validated
- `update` group → email validated
- Groups are **not exclusive**; you can apply multiple at once with `groups: ['create', 'update']`

---

## **2. Route-Specific Validation with `@UsePipes()`**

```ts
import { UserDto } from './user.dto';

import {
  Body,
  Controller,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  // Validate for 'create' group
  @Post()
  @UsePipes(
    new ValidationPipe({
      groups: ['create'],
      whitelist: true,
      transform: true,
    }),
  )
  createUser(@Body() userDto: UserDto) {
    return `Created user: ${userDto.username}`;
  }

  // Validate for 'update' group
  @Put()
  @UsePipes(
    new ValidationPipe({
      groups: ['update'],
      whitelist: true,
      transform: true,
    }),
  )
  updateUser(@Body() userDto: UserDto) {
    return `Updated user: ${userDto.email}`;
  }
}
```

**Notes:**

- `@UsePipes()` applies **ValidationPipe** **only to this route**.
- `groups` controls which validations from the DTO are applied.
- `whitelist` → removes extra fields
- `transform` → converts payload to DTO instance

---

## **3. Global Validation with `app.useGlobalPipes()`**

```ts
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      groups: ['create'], // optional default group
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

**Effect:**

- Every route now uses **ValidationPipe** automatically
- Global options enforce **consistent validation across the app**
- You can override groups on a per-route basis with `@UsePipes()`

---

## **4. Pipe Scope & Priority**

| Scope           | How to Apply                                       | Notes                                       |
| --------------- | -------------------------------------------------- | ------------------------------------------- |
| Route-specific  | `@UsePipes(new ValidationPipe(...))`               | Only this route                             |
| Controller-wide | `@UsePipes(new ValidationPipe(...))` at controller | All routes in the controller                |
| Global          | `app.useGlobalPipes(new ValidationPipe(...))`      | All routes in the app                       |
| Group override  | `groups` option inside `ValidationPipe`            | Allows selective validation rules from DTOs |

---

## **5. Example Combining Everything**

```ts
@Controller('users')
export class UsersController {
  // Global default validation applies (from app.useGlobalPipes)

  @Post()
  @UsePipes(new ValidationPipe({ groups: ['create'] }))
  create(@Body() userDto: UserDto) {
    // Only 'create' group fields are validated
    return userDto;
  }

  @Put()
  @UsePipes(new ValidationPipe({ groups: ['update'] }))
  update(@Body() userDto: UserDto) {
    // Only 'update' group fields are validated
    return userDto;
  }
}
```

✅ **Key Takeaways:**

- **DTO groups** control which validations are applied.
- **ValidationPipe** can be applied globally or per route.
- **`@UsePipes()`** overrides global settings if needed.
- **Options to always use:**
  - `whitelist: true` → remove unexpected fields
  - `forbidNonWhitelisted: true` → throw error if extra fields
  - `transform: true` → convert payload to DTO type
  - `groups` → select which validation rules to apply
