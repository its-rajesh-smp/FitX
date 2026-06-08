\---

name: backend-architecture

description: Maintain and extend a structured backend API using clear routes, middleware, controllers, services, data-access layers, models, migrations, validators, and shared utilities. Use when creating or modifying backend features, endpoints, database schemas, authentication, integrations, or project structure while preserving the codebase's existing conventions.

\---



\## Backend Architecture



Build backend features by first learning the repository's existing structure, then making the smallest complete change that follows it.



\## Core Principles



\- Treat the existing codebase as the primary source of truth.

\- Reuse established naming, imports, response shapes, and folder boundaries.

\- Keep each layer focused on one responsibility.

\- Prefer one clear implementation over premature abstractions.

\- Keep transport concerns out of data access and persistence concerns out of routes.

\- Validate all untrusted input before business logic runs.

\- Make database schema changes through migrations.

\- Keep secrets and environment-specific values in validated configuration.

\- Preserve backward compatibility unless the task explicitly requires a breaking change.



\## Discover the Existing Architecture



Before editing:



1\. Inspect the application entrypoint and startup sequence.

2\. Inspect route registration and API versioning.

3\. Read one similar endpoint from route to database.

4\. Inspect representative middleware, validators, models, migrations, services, and tests.

5\. Check repository instructions, package scripts, path aliases, formatter, linter, and type-checker.

6\. Check the working tree and do not overwrite unrelated changes.



Follow existing patterns when they are safe and intentional. If an existing pattern creates a security, correctness, or maintainability problem, explain the issue and make the narrowest appropriate improvement.



\## Preferred Request Flow



Use this dependency direction:



```text

request

&#x20; -> route

&#x20; -> middleware

&#x20; -> validator

&#x20; -> controller

&#x20; -> service/use-case

&#x20; -> data-access/repository or model query methods

&#x20; -> database/external provider

&#x20; -> standardized response

```



Not every endpoint needs every layer. Do not create pass-through files that add no useful boundary.



\## Layer Responsibilities



\### Routes



\- Define HTTP method, path, middleware order, and controller binding.

\- Group routes by API version and domain or access scope.

\- Keep routes declarative; do not put business logic or database queries in them.

\- Apply authentication, authorization, upload parsing, and validation before the controller.



\### Middleware



\- Handle reusable request concerns such as authentication, authorization, validation, uploads, logging, and response formatting.

\- Return or throw immediately on failure; call the next handler only after success.

\- Attach typed request context, such as the authenticated user, in one consistent place.

\- Keep middleware independent from individual endpoint business rules.



\### Validators



\- Define schemas separately from controllers.

\- Parse and normalize input, not merely check it.

\- Export the inferred input type when the language or validation library supports it.

\- Validate body, params, query, headers, and files as appropriate.

\- Reject unknown or malformed input consistently.

\- Convert optional form fields such as empty strings into the application's canonical empty value.



\### Controllers



\- Keep one controller or handler per endpoint operation.

\- Extract validated request data and authenticated context.

\- Call services or data-access methods.

\- Translate expected domain outcomes into the standard API response.

\- Avoid raw database queries, provider SDK details, and reusable business rules.

\- Return as soon as a response is sent.



\### Services / Use Cases



\- Put multi-step business workflows and external-provider orchestration here.

\- Accept plain typed inputs and return domain-oriented outputs.

\- Keep services independent from HTTP request and response objects.

\- Use transactions for workflows that must succeed or fail together.

\- Isolate provider-specific code behind small integration helpers or clients.



\### Data Access / Repositories / Models



\- Centralize reusable database queries here.

\- Give query methods intention-revealing names such as `findByEmail`, `findActive`, or `create`.

\- Accept typed filters or payloads and return typed domain records.

\- Keep HTTP status codes and response formatting out of this layer.

\- Keep model serialization rules close to the model when supported.

\- Never expose secrets such as password hashes or private tokens.

\- Avoid hidden network calls during ordinary record reads unless the repository clearly standardizes that behavior.



\### Models



\- Keep model fields aligned with the current database schema.

\- Use application-style property names and database mappers when the stack supports them.

\- Define relationships only when they are actively useful.

\- Keep domain enums and shared types in a dedicated types or domain module.

\- Do not use models as a dumping ground for unrelated business workflows.



\### Migrations



\- Treat migrations as the source of truth for schema evolution.

\- Create a new migration for a schema change; do not rewrite an applied migration unless the project is explicitly still pre-release and follows that practice.

\- Use consistent table and column naming.

\- Define primary keys, nullability, defaults, indexes, unique constraints, and foreign keys explicitly.

\- Choose delete/update behavior deliberately.

\- Implement a safe rollback when practical.

\- Keep model fields, validators, seeds, and queries synchronized with the migration.



\### Shared Utilities and Integrations



\- Put small stateless reusable helpers in `utils`.

\- Put configured third-party clients in `libs`, `clients`, or `integrations`.

\- Put business-facing wrappers around external systems in `services`.

\- Read environment variables through one typed, validated configuration module.

\- Do not scatter provider configuration or raw environment access across feature code.



\## Suggested Portable Structure



Adapt names to the repository instead of forcing this exact tree:



```text

src/

&#x20; app-or-server-entrypoint

&#x20; config/

&#x20; db/

&#x20;   migrations/

&#x20;   models/

&#x20;   repositories/

&#x20;   seeds/

&#x20; middlewares/

&#x20; routes/

&#x20;   v1/

&#x20;     domain/

&#x20; controllers/

&#x20; services/

&#x20; validators/

&#x20; types-or-domain/

&#x20; libs-or-integrations/

&#x20; utils/

&#x20; tests/

```



A small codebase may colocate controllers beside domain routes and may use model query methods as its data-access layer. Split them into dedicated folders only when complexity or reuse justifies it.



\## Implementing a Feature



For a new or changed feature:



1\. Find the closest existing feature and trace its full request flow.

2\. Define the API contract: method, path, access rules, input, output, and errors.

3\. Add or update the migration when persistence changes.

4\. Update domain types, model fields, and data-access methods.

5\. Add validation and export the validated input type.

6\. Implement the service or use-case when the workflow has multiple steps or integrations.

7\. Implement a thin controller.

8\. Register the route with middleware in the correct order.

9\. Use the project's standard success and error response format.

10\. Add focused tests and run the repository's verification commands.



\## API and Error Conventions



\- Use resource-oriented paths and consistent pluralization.

\- Keep versioning and access scopes consistent with existing routes.

\- Return a consistent success envelope and error envelope when the project uses them.

\- Use appropriate status codes; do not report every success as `200` if the project distinguishes creation, deletion, or no-content responses.

\- Keep user-facing messages useful but avoid leaking stack traces, secrets, SQL, or provider internals.

\- Handle expected failures explicitly and let centralized error handling process unexpected failures.

\- Make list endpoints ready for filtering, sorting, and pagination when unbounded growth is possible.



\## Data Integrity and Security



\- Authenticate identity before authorizing roles or resource ownership.

\- Enforce authorization at the server even if the client hides restricted actions.

\- Hash passwords with an established password-hashing library.

\- Never log passwords, tokens, secrets, or sensitive request bodies.

\- Use parameterized queries or ORM query builders.

\- Add database constraints for invariants that must survive concurrent requests.

\- Use a transaction for related writes.

\- Prevent race conditions with constraints, locking, or atomic operations rather than check-then-write logic alone.

\- Validate upload count, size, type, and storage destination.

\- Avoid default production secrets; fail startup when required secure configuration is missing.



\## Completion Checklist



Before finishing:



\- Confirm the change follows the repository's established structure.

\- Confirm routes contain no business or persistence logic.

\- Confirm request inputs are validated and typed.

\- Confirm controllers are thin and data access is centralized.

\- Confirm migrations, models, types, validators, and seeds agree.

\- Confirm authentication, authorization, ownership, and sensitive output handling.

\- Confirm multi-write operations are transactional where needed.

\- Confirm errors use the standard response path.

\- Run formatting, linting, type-checking, tests, and build commands available in the repository.

\- Review the final diff and leave unrelated files untouched.



When reporting completion, summarize the behavior changed, files or layers affected, verification performed, and any remaining risk.



