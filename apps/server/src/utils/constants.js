const STATUS = Object.freeze({
  HTTP: {
    OK: 200,
    CREATED: 201,
    DELETED: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  TASK: {
    TODO: 'TODO',
    IN_PROGRESS: "IN_PROGRESS",
    REVIEW: "REVIEW",
    DONE: "DONE",
    BACKLOG: "BACKLOG",
  }
});

const PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
})

export { STATUS, PRIORITY };
