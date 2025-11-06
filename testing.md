## **Testing in NestJS: Unit Tests vs E2E Tests**

### 1. **Test Scope and Purpose**

#### **Unit Tests**:

* **Goal**: Test individual components (e.g., controllers, services, etc.) in isolation.
* **Scope**: Test logic of one class or function, avoiding external dependencies.

#### **E2E Tests**:

* **Goal**: Test the entire application end-to-end, including HTTP routes, middleware, guards, services, etc.
* **Scope**: Test integration of all parts of the app (real database, HTTP calls, etc.).

---

### 2. **Test Setup & Dependencies**

#### **Unit Tests**:

* **Dependencies**:

  * Include only components being tested.
  * **Mock** external services, databases, or APIs to isolate the logic.
* **App Setup**:

  * Use `TestingModule` to create a lightweight container with required modules.
  * **Mock services or repositories** that are external to the unit under test.

#### **Example**:

Testing a `UserController`:

```ts
beforeEach(async () => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: [
      UserService, 
      { provide: UserRepository, useValue: mockUserRepository }, // Mocked DB
    ],
  }).compile();

  userController = app.get<UserController>(UserController);
});
```

* **Mocked Repository**: `UserRepository` is mocked to simulate DB calls.

---

#### **E2E Tests**:

* **Dependencies**:

  * **Include entire application modules** (e.g., `AppModule`).
  * No mocks unless testing external services (e.g., 3rd party APIs).
* **App Setup**:

  * Use `createNestApplication()` to initialize a real NestJS app.
  * Spin up a real HTTP server (with real DB interactions unless mocked).

#### **Example**:

Testing the root route (`/`):

```ts
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule], // Full AppModule
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

it('/ (GET)', () => {
  return request(app.getHttpServer())
    .get('/')
    .expect(200)
    .expect('Hello World!');
});
```

* **Real Application**: The entire app is initialized, testing actual HTTP routes and services.

---

### 3. **Mocking in Tests**

#### **Unit Tests**:

* **Mock external dependencies** to test a single component in isolation.
* Use Jest’s `jest.fn()` or `useValue` to mock services, DBs, etc.

#### **Example**:

Mocking a database call:

```ts
const mockUserRepository = {
  findOne: jest.fn().mockResolvedValue({ id: 1, name: 'John' }),
};

const app: TestingModule = await Test.createTestingModule({
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useValue: mockUserRepository }, // Mocked DB
  ],
}).compile();
```

* **Why Mock?**: To avoid hitting the actual DB and focus on testing the controller’s logic.

#### **E2E Tests**:

* **Minimal Mocking**: Mock only **external services** (e.g., third-party APIs).
* **Real Dependencies**: Use **real DB**, services, and modules to test full integration.

#### **Example**:

Mocking an external API in E2E:

```ts
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: WeatherService, // Mock external service (e.g., weather API)
        useValue: mockWeatherService,
      },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});
```

* **Why Mock?**: Prevent slow or unreliable external calls during integration tests.

---

### 4. **Real vs Mocked Dependencies**

#### **Unit Tests**:

* **Mocked**: External services like databases, APIs, or third-party libraries should be mocked to focus on testing the unit.

#### **E2E Tests**:

* **Real**: Everything should be real (database, services, routes) to simulate real-world behavior.

  * Use **in-memory DB** or **real DB** for integration tests.

#### **Example**:

Testing a real DB connection in E2E:

```ts
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule], // Use real DB connection
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});
```

* **Real DB**: Ensures that database queries and data flow are tested as they would be in production.

---

### 5. **Test Execution**

#### **Unit Tests**:

* **Fast**: Isolated components → faster test runs.
* **No HTTP server**: Test logic directly (no network calls).
* **Example**: Only testing the method inside a controller or service.

#### **E2E Tests**:

* **Slower**: Full app setup with real HTTP requests and DB interactions.
* **HTTP server**: Test real-world behavior via HTTP requests.
* **Example**: Testing routing, middleware, and real services.

---

### 6. **Key Differences at a Glance**

| Aspect            | Unit Test                             | E2E Test                         |
| ----------------- | ------------------------------------- | -------------------------------- |
| **Scope**         | One component (controller/service)    | Full app (routes, DB, services)  |
| **App Setup**     | `TestingModule` with mocks            | `createNestApplication()`        |
| **Mocking**       | Mock external dependencies (DB, APIs) | Minimal mocking (mostly real DB) |
| **Dependencies**  | Mocked services, DBs, etc.            | Real DBs, services, controllers  |
| **Speed**         | Fast (isolated logic)                 | Slower (integration tests)       |
| **Typical Tools** | Jest, testing module                  | Jest, Supertest, full app module |

---

### Conclusion:

* **Unit tests** focus on testing isolated components with mocked dependencies for fast and efficient testing.
* **E2E tests** simulate real-world interactions by testing the entire application, including routing, middleware, and real dependencies like databases.
