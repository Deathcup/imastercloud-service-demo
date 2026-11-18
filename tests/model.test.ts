import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  transition,
  points,
  level,
  answer,
  type State,
} from "../src/model.ts";
const request = {
  type: "createTicket",
  data: {
    title: "教学楼A专项优化",
    type: "无线体验",
    contact: "李老师",
    description: "高峰接入失败",
  },
} as const;
const accepted = () =>
  transition(transition(initialState(), request), { type: "accept" });
const verified = () => {
  let s = accepted();
  for (const type of ["diagnose", "authorize", "optimize", "verify"] as const)
    s = transition(s, { type });
  return s;
};
test("完整主线：交付、客户确认、案例审核和成长积分保持一致", () => {
  let s = verified();
  s = transition(s, { type: "deliver" });
  assert.equal(s.ticket?.status, "待客户确认");
  assert.ok(s.report);
  assert.equal(points(s), 8700);
  s = transition(s, { type: "confirm" });
  assert.equal(s.ticket?.status, "已完成");
  assert.equal(points(s), 8730);
  s = transition(s, { type: "lead" });
  s = transition(s, { type: "follow" });
  assert.equal(s.lead, "已跟进");
  s = transition(s, {
    type: "submitCase",
    data: {
      title: "某高校",
      industry: "教育",
      scene: "无线",
      problem: "接入差",
      abilities: "AI",
      solution: "经授权优化",
      effect: "98.6%",
      attachment: "",
      authorized: true,
    },
  });
  assert.equal(s.cases[0].status, "待审核");
  s = transition(s, { type: "approveCase", id: s.cases[0].id });
  assert.equal(s.cases[0].status, "已发布");
  assert.equal(points(s), 8830);
  s = transition(s, { type: "approveCase", id: s.cases[0].id });
  assert.equal(points(s), 8830);
  s = transition(s, { type: "promote", id: s.cases[0].id });
  assert.equal(s.applications.length, 1);
  s = transition(s, { type: "promote", id: s.cases[0].id });
  assert.equal(s.applications.length, 1);
});
test("高风险操作必须获得授权，交付必须经过验证，确认必须等待交付", () => {
  for (const type of [
    "authorize",
    "optimize",
    "verify",
    "deliver",
    "confirm",
  ] as const)
    assert.throws(() => transition(initialState(), { type }));
  assert.throws(() => transition(accepted(), { type: "authorize" }));
  assert.throws(() =>
    transition(transition(accepted(), { type: "diagnose" }), {
      type: "optimize",
    }),
  );
  assert.throws(() => transition(accepted(), { type: "deliver" }));
  assert.throws(() => transition(verified(), { type: "confirm" }));
});
test("重复工单、重复奖励、重复开通受到约束", () => {
  let s = accepted();
  assert.throws(() => transition(s, request));
  const task = {
    type: "task",
    id: "inspection",
    title: "巡检",
    points: 200,
  } as const;
  s = transition(transition(s, task), task);
  assert.equal(points(s), 8850);
  assert.equal(s.completedTasks.length, 1);
  s = transition(transition(s, { type: "subscribe", name: "健康评估" }), {
    type: "subscribe",
    name: "健康评估",
  });
  assert.equal(s.subscriptions.length, 2);
});
test("未经授权的案例不可提交，审核不可凭空创建", () => {
  assert.throws(() =>
    transition(initialState(), {
      type: "submitCase",
      data: {
        title: "高校",
        industry: "教育",
        scene: "无线",
        problem: "风险",
        abilities: "AI",
        solution: "优化",
        effect: "稳定",
        attachment: "",
        authorized: false,
      },
    }),
  );
  assert.throws(() =>
    transition(initialState(), { type: "approveCase", id: "missing" }),
  );
});
test("智能回复随业务状态变化，且保持非确定性根因表述", () => {
  const before = answer("帮我对比整改前后的效果", initialState(), false);
  assert.match(before, /尚未完成/);
  const after = answer("帮我对比整改前后的效果", verified(), false);
  assert.match(after, /98.6%/);
  const final = transition(transition(verified(), { type: "deliver" }), {
    type: "confirm",
  });
  assert.match(answer("伙伴处理完成了吗？", final, false), /已完成/);
  assert.match(answer("分析原因", verified(), true), /初步判断/);
});
test("状态序列化不丢失闭环数据，升级阈值准确", () => {
  const s = transition(verified(), { type: "deliver" });
  const persisted: State = JSON.parse(JSON.stringify(s));
  assert.deepEqual(persisted, s);
  assert.equal(level(9999), "黄金伙伴");
  assert.equal(level(10000), "卓越伙伴");
  let upgraded = transition(s, {
    type: "task",
    id: "growth",
    title: "成长任务",
    points: 1300,
  });
  assert.equal(level(points(upgraded)), "卓越伙伴");
  assert.equal(points(initialState()), 8650);
  assert.equal(initialState().ticket, null);
});
