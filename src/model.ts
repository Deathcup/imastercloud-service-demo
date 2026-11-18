export type Status = "待受理" | "处理中" | "待客户确认" | "已完成";
export type Ticket = {
  id: string;
  title: string;
  type: string;
  contact: string;
  description: string;
  engineer: string;
  status: Status;
};
export type Case = {
  id: string;
  title: string;
  industry: string;
  scene: string;
  problem: string;
  abilities: string;
  solution: string;
  effect: string;
  attachment: string;
  authorized: boolean;
  status: "待审核" | "已发布";
  promoted: boolean;
};
export type State = {
  version: 1;
  diagnosed: boolean;
  authorized: boolean;
  optimized: boolean;
  verified: boolean;
  report: boolean;
  ticket: Ticket | null;
  timeline: { time: string; text: string }[];
  ledger: { id: string; title: string; points: number }[];
  cases: Case[];
  lead: "未创建" | "待跟进" | "已跟进";
  subscriptions: string[];
  applications: { id: string; name: string; status: string }[];
  learned: string[];
  templates: string[];
  completedTasks: string[];
};
export const initialState = (): State => ({
  version: 1,
  diagnosed: false,
  authorized: false,
  optimized: false,
  verified: false,
  report: false,
  ticket: null,
  timeline: [
    { time: "08:30", text: "平台发现教学楼A无线接入体验风险" },
    { time: "08:32", text: "AI完成初步风险聚合，等待专项诊断" },
    { time: "08:40", text: "华云数智服务团队收到风险提醒" },
  ],
  ledger: [],
  cases: [],
  lead: "未创建",
  subscriptions: ["智能远程保障服务"],
  applications: [],
  learned: [],
  templates: [],
  completedTasks: [],
});
export type Action =
  | { type: "diagnose" }
  | { type: "createTicket"; data: Omit<Ticket, "id" | "status" | "engineer"> }
  | { type: "accept" }
  | { type: "assign"; engineer: string }
  | { type: "note"; text: string }
  | { type: "authorize" }
  | { type: "optimize" }
  | { type: "verify" }
  | { type: "deliver" }
  | { type: "confirm" }
  | { type: "lead" }
  | { type: "follow" }
  | { type: "subscribe"; name: string }
  | { type: "submitCase"; data: Omit<Case, "id" | "status" | "promoted"> }
  | { type: "approveCase"; id: string }
  | { type: "promote"; id: string }
  | { type: "apply"; name: string }
  | { type: "task"; id: string; title: string; points: number }
  | { type: "learn" | "template"; id: string };
export function transition(state: State, action: Action): State {
  const s = structuredClone(state);
  const log = (text: string) =>
    s.timeline.push({
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text,
    });
  const award = (id: string, title: string, points: number) => {
    if (!s.ledger.some((x) => x.id === id))
      s.ledger.push({ id, title, points });
  };
  const require = (ok: unknown, message: string) => {
    if (!ok) throw Error(message);
  };
  switch (action.type) {
    case "diagnose":
      if (!s.diagnosed) {
        s.diagnosed = true;
        log("Aico完成专项诊断：疑似高密接入与同频干扰，建议分批优化");
      }
      break;
    case "createTicket":
      require(!s.ticket, "已有同一风险的服务工单，请在现有工单中继续处理");
      s.ticket = {
        ...action.data,
        id: "SR-20261118-001",
        engineer: "待指派",
        status: "待受理",
      };
      log("服务请求已提交，客户面与伙伴面同步");
      break;
    case "accept":
      require(s.ticket?.status === "待受理", "只有待受理工单可以接单");
      s.ticket!.status = "处理中";
      s.ticket!.engineer = "张明 · 网络工程师";
      log("张明已接单，进入专项排查");
      break;
    case "assign":
      require(s.ticket && s.ticket.status !== "已完成", "请先创建未完成的工单");
      s.ticket!.engineer = action.engineer;
      log(`服务工单已指派给${action.engineer}`);
      break;
    case "note":
      require(s.ticket && s.ticket.status === "处理中", "请先受理工单");
      require(action.text.trim(), "请输入处理记录");
      log(action.text.trim());
      break;
    case "authorize":
      require(s.diagnosed &&
        s.ticket?.status === "处理中", "请先完成AI诊断并受理工单");
      if (!s.authorized) {
        s.authorized = true;
        log(
          "模拟客户授权通过：教学楼A 12台AP，维护窗口22:00–22:15，已确认回退预案",
        );
      }
      break;
    case "optimize":
      require(s.authorized &&
        s.ticket?.status === "处理中", "远程配置变更需要先完成授权确认");
      if (!s.optimized) {
        s.optimized = true;
        log("模拟执行完成：信道与功率优化、终端负载均衡；已保存配置快照");
      }
      break;
    case "verify":
      require(s.optimized, "请先执行模拟整改");
      if (!s.verified) {
        s.verified = true;
        log("模拟30分钟观察窗验证通过：接入成功率98.6%，时延24ms");
      }
      break;
    case "deliver":
      require(s.verified &&
        s.ticket?.status === "处理中", "请先完成整改和效果验证");
      s.report = true;
      s.ticket!.status = "待客户确认";
      award("delivery", "完成有效服务与报告交付", 50);
      log("专项优化报告已生成并模拟交付，等待客户确认");
      break;
    case "confirm":
      require(s.ticket?.status === "待客户确认", "请等待伙伴交付报告");
      s.ticket!.status = "已完成";
      award("confirmation", "客户确认服务成果", 30);
      log("客户确认服务成果，工单已完成");
      break;
    case "lead":
      if (s.lead === "未创建") {
        s.lead = "待跟进";
        log("基于设备年限与容量趋势生成无线网络升级经营线索");
      }
      break;
    case "follow":
      require(s.lead !== "未创建", "请先创建经营线索");
      s.lead = "已跟进";
      break;
    case "subscribe":
      if (!s.subscriptions.includes(action.name)) {
        s.subscriptions.push(action.name);
        log(`已为华东科技大学模拟开通「${action.name}」`);
      }
      break;
    case "submitCase":
      require(action.data.authorized, "案例提交需要确认客户授权和脱敏");
      require(action.data.title.trim() &&
        action.data.solution.trim() &&
        action.data.effect.trim(), "请完善案例标题、过程及成效");
      require(!s.cases.some(
        (c) => c.title === action.data.title,
      ), "同名案例已经提交");
      s.cases.push({
        ...action.data,
        id: `case-${Date.now()}`,
        status: "待审核",
        promoted: false,
      });
      break;
    case "approveCase": {
      const c = s.cases.find((c) => c.id === action.id);
      require(c, "案例不存在");
      require(c!.authorized, "案例未获得客户授权");
      if (c!.status !== "已发布") {
        c!.status = "已发布";
        award(c!.id, "生态案例审核通过", 100);
        log("脱敏服务案例已发布，获得100成长积分");
      }
      break;
    }
    case "promote": {
      const c = s.cases.find((c) => c.id === action.id);
      require(c?.status === "已发布", "仅已发布案例可申请联合推广");
      if (!c!.promoted) {
        c!.promoted = true;
        s.applications.push({
          id: `promo-${c!.id}`,
          name: "优秀案例联合推广",
          status: "待审核",
        });
      }
      break;
    }
    case "apply":
      require(!s.applications.some(
        (x) => x.name === action.name,
      ), "此项激励已有申请记录");
      s.applications.push({
        id: `app-${Date.now()}`,
        name: action.name,
        status: "待审核",
      });
      break;
    case "task":
      if (!s.completedTasks.includes(action.id)) {
        s.completedTasks.push(action.id);
        award(action.id, action.title, action.points);
      }
      break;
    case "learn":
      if (!s.learned.includes(action.id)) s.learned.push(action.id);
      break;
    case "template":
      if (!s.templates.includes(action.id)) s.templates.push(action.id);
      break;
  }
  return s;
}
export const points = (s: State) =>
  8650 + s.ledger.reduce((a, b) => a + b.points, 0);
export const level = (p: number) =>
  p >= 10000
    ? "卓越伙伴"
    : p >= 5000
      ? "黄金伙伴"
      : p >= 2000
        ? "银牌伙伴"
        : "成长伙伴";
export const storageKey = "imastercloud-service-demo-v1";
export function loadState(): State {
  try {
    const v = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (
      v?.version === 1 &&
      Array.isArray(v.timeline) &&
      Array.isArray(v.ledger) &&
      Array.isArray(v.cases) &&
      Array.isArray(v.subscriptions) &&
      Array.isArray(v.applications) &&
      Array.isArray(v.learned) &&
      Array.isArray(v.templates) &&
      Array.isArray(v.completedTasks)
    )
      return { ...initialState(), ...v };
  } catch {
    /* storage is optional */
  }
  return initialState();
}
export function answer(question: string, s: State, partner: boolean) {
  if (/图书馆|行政中心|学生公寓/.test(question))
    return "当前所选站点设备在线、业务运行正常，未发现显著活动风险。完整专项诊断演示围绕教学楼A展开，可在统一保障中心切换到教学楼A。";
  if (/以前|历史|案例/.test(question))
    return "找到历史知识案例 KB-2026-018：同类高密教学场景曾出现同频干扰。历史采用信道规划与负载均衡，并经现场复测验证。本次需结合当前指标判断，不能直接认定为相同根因。可将本次服务脱敏整理成生态案例。";
  if (/报告|本月|一周|本周/.test(question))
    return s.report
      ? "专项优化报告已交付：发现12台AP接入压力偏高，伙伴完成信道及负载优化；接入成功率由89.2%提升到98.6%。请在服务中心查看报告。"
      : "本月已完成18次保障服务，教学楼A存在1项待处理风险。已汇总周期监测记录，可生成月度运行报告；专项整改报告须在整改验证后交付。";
  if (/商机|经营|机会/.test(question))
    return "建议优先跟进华东科技大学：24台AP服役超过5年，高峰终端容量较上季度增加32%。可先开展网络健康评估，再依据客户预算和业务规划讨论升级；这是潜在线索，不代表成交承诺。";
  if (/完成|工单|进度|伙伴/.test(question))
    return s.ticket
      ? `工单 ${s.ticket.id} 当前为「${s.ticket.status}」，工程师：${s.ticket.engineer}。${s.report ? "服务报告已同步到客户面。" : "伙伴交付后可查看效果报告。"}`
      : "当前尚未提交该风险的专项工单。您可以申请伙伴服务，平台将同步给华云数智服务团队。";
  if (/对比|效果|整改/.test(question))
    return s.verified
      ? "模拟验证结果：无线接入成功率89.2% → 98.6%，P95时延86ms → 24ms，重传率18.4% → 4.1%。观察窗为整改后30分钟，建议继续监测24小时。"
      : "当前尚未完成整改验证。优化前接入成功率89.2%、P95时延86ms；需要授权整改并复测后才能展示改善结果。";
  if (/为什么|原因|分析|变慢|诊断/.test(question))
    return s.diagnosed
      ? "初步判断：高密接入导致的容量压力叠加同频干扰。依据：12台AP平均终端数62、信道利用率82%、重传率18.4%；上联丢包0.1%，暂未发现明显上联瓶颈。建议先优化信道与功率并启用负载均衡，维护窗口内验证。"
      : "教学楼A无线接入体验持续下降，疑似高峰容量压力。" +
          (partner
            ? "请运行专项诊断以关联设备、告警、拓扑与历史案例。"
            : "已通知服务伙伴开展专项排查。");
  if (/网络|风险|健康|巡检|运行/.test(question))
    return s.verified
      ? "网络整体稳定，教学楼A风险已缓解。1,286台设备在线，关键业务状态正常；专项服务的最新状态可在「我的服务」查看。"
      : "1,286台设备在线，教学及办公业务整体可用。教学楼A无线体验存在较高风险：接入失败率升高，可能影响高峰课堂互动。其他站点未发现显著风险。";
  return "我可以协助查询网络健康、分析教学楼A风险、追踪工单、对比整改效果、生成运行报告或识别经营机会。请描述其中一项任务；本原型使用预设知识与当前业务状态模拟回答。";
}
