import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import Feedback from "../models/Feedback.js";
import { exportFeedbackReport, getFeedbackReport } from "./adminController.js";

const originals = { find: Feedback.find, countDocuments: Feedback.countDocuments };
afterEach(() => {
  Feedback.find = originals.find;
  Feedback.countDocuments = originals.countDocuments;
});

const response = () => ({
  statusCode: 200,
  body: null,
  headers: {},
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
  set(headers) {
    this.headers = headers;
    return this;
  },
  send(body) {
    this.body = body;
    return this;
  },
});

test("feedback report returns newest entries with bounded pagination", async () => {
  const feedbacks = [{ _id: "feedback-1" }];
  let filter;
  let pagination;
  Feedback.find = (query) => {
    filter = query;
    return {
      sort: (sort) => {
        assert.deepEqual(sort, { createdAt: -1 });
        return {
          skip: (skip) => {
            pagination = { skip };
            return {
              limit: (limit) => {
                pagination.limit = limit;
                return { lean: async () => feedbacks };
              },
            };
          },
        };
      },
    };
  };
  Feedback.countDocuments = async () => 21;
  const res = response();

  await getFeedbackReport({ query: { page: "2", limit: "20" } }, res);

  assert.deepEqual(filter, {});
  assert.deepEqual(pagination, { skip: 20, limit: 20 });
  assert.equal(res.body.total, 21);
  assert.deepEqual(res.body.feedbacks, feedbacks);
});

test("feedback CSV quotes cells and neutralizes spreadsheet formulas", async () => {
  Feedback.find = () => ({
    sort: () => ({
      lean: async () => [{
        createdAt: new Date("2026-10-26T12:00:00.000Z"),
        senderName: "=HYPERLINK(\"bad\")",
        senderEmail: "ana@example.com",
        message: "linha 1,\nlinha 2",
      }],
    }),
  });
  const res = response();

  await exportFeedbackReport({}, res);

  assert.equal(res.headers["Content-Type"], "text/csv; charset=utf-8");
  assert.equal(res.headers["Content-Disposition"], 'attachment; filename="feedback-report.csv"');
  assert.match(res.body, /"'=HYPERLINK/);
  assert.match(res.body, /"linha 1,\nlinha 2"/);
});
