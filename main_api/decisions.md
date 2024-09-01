## Architectural Decisions

- All DB entities have to go through a transformation step in a VO/DTO before being transferred over to the frontend
- All operations must have logs signifying starting and ending a process.
- All operations must have logs for conditional statements.
- All errors must be logged
- All exceptions must be caught and handled through proper HTTP status codes. Further the returning error messages should be descriptive.
- Strategy pattern was used for building of payment module so that integrations with different payment systems will be made easier.
- Formal migration decorator must be used for interacting with the database for seeding and migration operations.
