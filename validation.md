### **Grouping with `class-validator`**

In NestJS, **class-validator** allows you to validate groups of properties conditionally using **validation groups**. You can define groups and apply validations based on the groups you choose.

#### 1. **Define Groups in DTOs**

You can use `@Validate()` decorators with the `groups` option to specify which validation rules apply to different groups.

```typescript
import { IsInt, IsString, Min, Validate } from 'class-validator';

export class CreateUserDto {
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

In this example:

- For the **`create`** group, we validate the **`password`** and **`age`**.
- For the **`update`** group, we validate the **`email`**.

#### 2. **Apply Group Validation in Controller**

NestJS uses **`class-validator`** in the DTOs by default with `@Body()`. To activate group validation, you need to specify the group in the `@Validate()` decorator.

```typescript
import { CreateUserDto } from './create-user.dto';

import { Body, Controller, Post, Put } from '@nestjs/common';

import { validate } from 'class-validator';

@Controller('users')
export class UsersController {
  // Create user endpoint (using 'create' group)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await validate(createUserDto, { groups: ['create'] }); // Validate for the 'create' group
    return 'User created successfully!';
  }

  // Update user endpoint (using 'update' group)
  @Put()
  async updateUser(@Body() createUserDto: CreateUserDto) {
    await validate(createUserDto, { groups: ['update'] }); // Validate for the 'update' group
    return 'User updated successfully!';
  }
}
```

### **Explanation**

- The `@Body()` decorator automatically maps the request body to the `CreateUserDto` class.
- You use `validate()` and specify the **group** to trigger different sets of validation rules.
  - For `createUser`, the `create` validation group will be triggered.
  - For `updateUser`, the `update` validation group will be triggered.

### **How It Works**

- When **creating** a user, the `password` and `age` fields will be validated according to the `create` group.
- When **updating** a user, only the `email` field is validated based on the `update` group.

### **Global Validation Pipe with Groups (Optional)**

If you want to enable global validation across all endpoints, you can use the **ValidationPipe** globally with groups:

```typescript
import { ValidationPipe } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(new ValidationPipe({ groups: ['create'] }))
      .forRoutes('users');
  }
}
```

This sets up the global validation configuration for specific groups (e.g., `['create']` or `['update']`).

### **Options for Validation Pipe**

1. **`whitelist`** – Automatically strip properties that are not in the DTO.
2. **`forbidNonWhitelisted`** – Throw an error when non-whitelisted properties are sent.
3. **`transform`** – Automatically transform payloads into the DTO.
4. **`groups`** – Specific groups to validate against (e.g., `['create']`, `['update']`).

### **Example Global Pipe Configuration**

```typescript
@Module({
  imports: [],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          groups: ['create'], // Default group to be applied
        }),
      )
      .forRoutes('users');
  }
}
```

### **Final Thoughts**

- **Use groups** when you want different validation rules for the same DTO depending on the context (e.g., `create` vs. `update`).
- **Global ValidationPipe** can be used to enforce common validation behaviors across the app, such as stripping non-whitelisted properties, or applying group-based validation for certain routes.
- Always ensure to use **groups** in your controllers or routes where different validation logic should apply, and the `ValidationPipe` will handle the rest.

---

That’s a concise way to implement **group validation** in **NestJS** with **class-validator**!
