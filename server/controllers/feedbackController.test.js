import assert from "node:assert/strict";
import test from "node:test";
import { createSendFeedback } from "./feedbackController.js";

const response = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("feedback is persisted and emailed to the configured destination", async () => {
  const saved = [];
  const sent = [];
  const handler = createSendFeedback({
    FeedbackModel: {
      create: async (document) => {
        saved.push(document);
        return { _id: "feedback-1" };
      },
    },
    sendEmail: async (email) => sent.push(email),
  });
  const res = response();

  await handler({
    body: { message: "  Ideia <legal>  " },
    dbUser: { _id: "user-1", full_name: "Ana", email: "ana@example.com" },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.notificationSent, true);
  assert.deepEqual(saved, [{
    user: "user-1",
    senderName: "Ana",
    senderEmail: "ana@example.com",
    message: "Ideia <legal>",
  }]);
  assert.equal(sent[0].to, "resendedanielcouto@gmail.com");
  assert.match(sent[0].body, /&lt;legal&gt;/);
});

test("feedback validates the message before persisting", async () => {
  let createCalls = 0;
  const handler = createSendFeedback({
    FeedbackModel: { create: async () => { createCalls += 1; } },
    sendEmail: async () => {},
  });
  const res = response();

  await handler({ body: { message: "  " }, dbUser: { _id: "user-1" } }, res);

  assert.equal(res.statusCode, 400);
  assert.equal(createCalls, 0);
});

test("feedback remains recorded when email notification delivery fails", async () => {
  const errors = [];
  const handler = createSendFeedback({
    FeedbackModel: {
      create: async () => ({ _id: "feedback-2" }),
    },
    sendEmail: async () => { throw new Error("SMTP unavailable"); },
    logger: { error: (...args) => errors.push(args) },
  });
  const res = response();

  await handler({
    body: { message: "Feedback" },
    dbUser: { _id: "user-1", full_name: "Ana", email: "ana@example.com" },
  }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.notificationSent, false);
  assert.equal(errors.length, 1);
});
