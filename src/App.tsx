import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type FormEvent,
} from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Download,
  FileText,
  Gift,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MessageSquare,
  Network,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket as TicketIcon,
  TrendingUp,
  Trophy,
  Users,
  X,
  AlertTriangle,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import {
  initialState,
  loadState,
  storageKey,
  transition,
  points,
  level,
  answer,
  type Action,
  type Case,
} from "./model";
const customer = "华东科技大学",
  partnerName = "华云数智技术服务有限公司";
const customerNav: [string, string, LucideIcon][] = [
  ["home", "我的智能保障", LayoutDashboard],
  ["assurance", "我的运行保障", ShieldCheck],
  ["services", "我的服务", LifeBuoy],
  ["chat", "AI智能对话", Sparkles],
];
const partnerNav: [string, string, LucideIcon][] = [
  ["workbench", "伙伴智能工作台", LayoutDashboard],
  ["aico", "Aico智能运维中心", Sparkles],
  ["unified", "统一保障中心", Network],
  ["delivery", "伙伴服务中心", LifeBuoy],
  ["business", "智能经营中心", TrendingUp],
  ["growth", "伙伴成长中心", Trophy],
  ["ecosystem", "生态共创中心", BookOpen],
];
const products = [
  "智能远程看护",
  "网络健康评估",
  "周期性运行分析",
  "专项故障诊断",
  "无线网络体验优化",
];
const sampleCases = [
  {
    id: "sample-1",
    title: "让风险止步于课堂之前",
    industry: "教育",
    scene: "高校无线保障",
    problem: "高峰课堂接入失败，日常巡检难以及时发现",
    abilities: "AI风险分析 · 主动巡检",
    solution: "关联无线趋势与设备负载，分批开展信道优化",
    effect: "示例：接入成功率提升9.4个百分点",
    ref: 128,
  },
  {
    id: "sample-2",
    title: "跨越300公里的远程守护",
    industry: "制造",
    scene: "多厂区远程运维",
    problem: "多厂区重复上站，排障协同成本高",
    abilities: "统一运维 · O3工单协同",
    solution: "统一分析告警，远程诊断并跟踪交付",
    effect: "示例：重复上站次数下降40%",
    ref: 96,
  },
  {
    id: "sample-3",
    title: "从设备洞察到服务增长",
    industry: "园区",
    scene: "生命周期经营",
    problem: "设备服役较久，缺少容量规划依据",
    abilities: "生命周期洞察 · 经营分析",
    solution: "输出健康评估与分阶段容量规划",
    effect: "示例：形成3项可跟进服务机会",
    ref: 83,
  },
];
const steps = [
  {
    role: "customer",
    page: "home",
    title: "看见风险",
    description: "从客户视角理解教学楼A的业务风险，点击“查看风险分析”。",
  },
  {
    role: "partner",
    page: "aico",
    title: "智能诊断",
    description: "运行Aico专项诊断，观察五步任务编排，了解证据与疑似根因。",
  },
  {
    role: "partner",
    page: "delivery",
    title: "工单协同",
    description: "创建服务工单并接单。可切换客户面，查看同一条服务进度。",
  },
  {
    role: "partner",
    page: "unified",
    title: "授权与整改",
    description: "完成模拟授权，执行优化并验证效果；每个操作都留下记录。",
  },
  {
    role: "partner",
    page: "delivery",
    title: "交付服务",
    description: "生成并交付报告，然后切换客户面确认服务，完成闭环。",
  },
  {
    role: "partner",
    page: "business",
    title: "价值经营",
    description: "查看设备年限与容量证据，创建线索并标记跟进。",
  },
  {
    role: "partner",
    page: "ecosystem",
    title: "生态共创",
    description: "提交脱敏成功案例，勾选客户授权，再模拟审核通过。",
  },
  {
    role: "partner",
    page: "growth",
    title: "成长激励",
    description: "查看积分账本和等级进度，申请生态激励，完成演示。",
  },
] as const;
function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
function Btn({
  children,
  onClick,
  secondary = false,
  disabled = false,
  small = false,
}: {
  children: ReactNode;
  onClick: () => void;
  secondary?: boolean;
  disabled?: boolean;
  small?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`${secondary ? "btn secondary" : "btn"} ${small ? "small" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function Card({
  title,
  caption,
  action,
  children,
  className = "",
}: {
  title?: string;
  caption?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card ${className}`}>
      {title && (
        <div className="card-head">
          <div>
            <h2>{title}</h2>
            {caption && <p>{caption}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
function Trend({
  improved = false,
  small = false,
}: {
  improved?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`trend ${small ? "compact" : ""}`}>
      <div className="chart-label">
        <span>无线接入成功率</span>
        <b>
          {improved ? "98.6" : "89.2"}
          <small>%</small>
        </b>
      </div>
      <svg
        viewBox="0 0 620 148"
        role="img"
        aria-label={
          improved ? "整改后接入成功率98.6%" : "过去24小时接入成功率下降至89.2%"
        }
      >
        <defs>
          <linearGradient
            id={improved ? "green-fill" : "red-fill"}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={improved ? "#1b9b78" : "#cf0a2c"}
              stopOpacity=".15"
            />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 65, 105].map((y) => (
          <line
            key={y}
            x1="0"
            x2="620"
            y1={y}
            y2={y}
            stroke="#e8ebee"
            strokeDasharray="4 5"
          />
        ))}
        <path
          d={
            improved
              ? "M0 90 L50 95 L100 75 L150 80 L200 55 L250 60 L300 40 L350 45 L400 28 L450 32 L500 22 L550 25 L620 20 L620 148 L0 148Z"
              : "M0 25 L50 30 L100 24 L150 39 L200 35 L250 57 L300 48 L350 70 L400 62 L450 86 L500 82 L550 112 L620 104 L620 148 L0 148Z"
          }
          fill={`url(#${improved ? "green-fill" : "red-fill"})`}
        />
        <polyline
          points={
            improved
              ? "0,90 50,95 100,75 150,80 200,55 250,60 300,40 350,45 400,28 450,32 500,22 550,25 620,20"
              : "0,25 50,30 100,24 150,39 200,35 250,57 300,48 350,70 400,62 450,86 500,82 550,112 620,104"
          }
          fill="none"
          stroke={improved ? "#1b9b78" : "#cf0a2c"}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <div className="chart-axis">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>现在</span>
      </div>
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const elements = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled),input,textarea,select,[tabindex="0"]',
          ) || [],
        );
        const first = elements[0],
          last = elements.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${wide ? "wide" : ""}`}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="关闭弹窗" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export default function App() {
  const [s, setS] = useState(loadState);
  const stateRef = useRef(s);
  stateRef.current = s;
  const [role, setRole] = useState<"customer" | "partner">(() =>
    location.hash.startsWith("#partner") ? "partner" : "customer",
  );
  const [page, setPage] = useState(() =>
    location.hash.startsWith("#partner") ? "workbench" : "home",
  );
  const [tab, setTab] = useState("工单");
  const [modal, setModal] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [mobile, setMobile] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { who: "user" | "ai"; text: string }[]
  >([]);
  const [progress, setProgress] = useState(-1);
  const [tour, setTour] = useState(-1);
  const [filter, setFilter] = useState("全部客户");
  const [selectedSite, setSelectedSite] = useState("教学楼A");
  const [selectedDevice, setSelectedDevice] = useState("AP-A-301");
  const [selectedCase, setSelectedCase] = useState("sample-1");
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [reportType, setReportType] = useState("专项优化报告");
  const [query, setQuery] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const notify = (text: string) => setToast(text);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      setStorageWarning(true);
    }
  }, [s]);
  const commit = (action: Action, message?: string) => {
    try {
      const next = transition(stateRef.current, action);
      stateRef.current = next;
      setS(next);
      if (message) notify(message);
      return true;
    } catch (e) {
      notify((e as Error).message);
      return false;
    }
  };
  const go = (p: string, r = role) => {
    setPage(p);
    setRole(r);
    setMobile(false);
    setTab("工单");
    location.hash = r;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const switchRole = () => {
    const r = role === "customer" ? "partner" : "customer";
    go(r === "customer" ? "home" : "workbench", r);
  };
  const navigateTour = (index: number) => {
    setTour(index);
    go(steps[index].page, steps[index].role);
  };
  useEffect(() => {
    if (progress < 0 || progress > 4) return;
    const timer = setTimeout(() => {
      if (progress === 4) {
        setS((current) => transition(current, { type: "diagnose" }));
        setProgress(5);
        notify("分析完成，已生成整改建议");
      } else setProgress((p) => p + 1);
    }, 650);
    return () => clearTimeout(timer);
  }, [progress]);
  const diagnose = () => {
    setProgress(0);
    go("aico", "partner");
  };
  const ask = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { who: "user", text },
      { who: "ai", text: answer(text, s, role === "partner") },
    ]);
    setQuestion("");
    if (role === "partner" && /分析|诊断|原因/.test(text) && !s.diagnosed) {
      setProgress(0);
    }
  };
  const download = (name: string, text: string) => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("演示文件已生成");
  };
  const showReport = (type = "专项优化报告") => {
    setReportType(type);
    setModal("report");
  };
  const reportText = () =>
    `${customer}｜${reportType}\n概念原型 · 模拟数据 · 2026-11-18\n发现了什么：教学楼A无线接入成功率89.2%，12台AP高密接入，疑似容量压力叠加同频干扰。\n伙伴做了什么：${s.verified ? "经模拟授权，完成信道、功率与终端负载优化。" : "当前仍在排查，尚未完成整改。"}\n最终改善了什么：${s.verified ? "模拟观察窗30分钟：接入成功率98.6%，P95时延24ms，重传率4.1%。建议继续监测24小时。" : "整改效果待验证，不承诺改善。"}\n服务伙伴：${partnerName}\n工单状态：${s.ticket?.status || "未创建"}\n本报告为离线演示生成，不构成真实运维结论。`;
  const share = (text: string) => {
    if (navigator.clipboard?.writeText)
      navigator.clipboard
        .writeText(text)
        .then(() => notify("已复制脱敏分享摘要，可用于本地演示"))
        .catch(() => {
          setModal("share");
        });
    else setModal("share");
  };
  const createTicket = () => {
    if (s.ticket) {
      go(role === "customer" ? "services" : "delivery");
      notify("已有同一风险的工单，已为您打开");
    } else setModal("request");
  };
  const currentNav = role === "customer" ? customerNav : partnerNav;
  const pageTitle = currentNav.find((n) => n[0] === page)?.[1] || "智能服务";
  const heading = (
    eyebrow: string,
    title: string,
    description: string,
    action?: ReactNode,
  ) => (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
  const metrics = (
    items: {
      title: string;
      value: string;
      unit?: string;
      hint: string;
      icon: LucideIcon;
      action: () => void;
      tone?: string;
    }[],
  ) => (
    <div className={`metrics metrics-${items.length}`}>
      {items.map(({ title, value, unit, hint, icon: Icon, action, tone }) => (
        <button className="metric" key={title} onClick={action}>
          <div className="metric-top">
            <span>{title}</span>
            <Icon size={18} />
          </div>
          <div className={`metric-value ${tone || ""}`}>
            {value}
            <small>{unit}</small>
          </div>
          <div className="metric-bottom">
            <span>{hint}</span>
            <ChevronRight size={15} />
          </div>
        </button>
      ))}
    </div>
  );
  const timeline = (limit?: number) => (
    <div className="timeline">
      {s.timeline.slice(limit ? -limit : 0).map((item, i) => (
        <div className="timeline-item" key={`${i}-${item.text}`}>
          <span className="timeline-dot" />
          <time>{item.time}</time>
          <p>{item.text}</p>
        </div>
      ))}
    </div>
  );
  const effect = () => (
    <div className="effect-grid">
      {[
        ["接入成功率", "89.2%", "98.6%", "↑ 9.4个百分点"],
        ["P95接入时延", "86ms", "24ms", "↓ 72.1%"],
        ["无线重传率", "18.4%", "4.1%", "↓ 14.3个百分点"],
      ].map(([label, before, after, delta]) => (
        <div key={label}>
          <span>{label}</span>
          <p>
            <del>{before}</del>
            <ArrowRight size={16} />
            <strong>{s.verified ? after : "待验证"}</strong>
          </p>
          <small>{s.verified ? delta : "整改前基线已采集"}</small>
        </div>
      ))}
    </div>
  );
  const riskCard = () => (
    <Card className={`risk-card ${s.verified ? "resolved" : ""}`}>
      <div className="risk-top">
        <div className="risk-icon">
          {s.verified ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
        </div>
        <div>
          <div className="inline">
            <Badge tone={s.verified ? "green" : "orange"}>
              {s.verified ? "风险已缓解" : "主动风险提醒"}
            </Badge>
            <span className="muted text-sm">教学楼A · 无线接入体验</span>
          </div>
          <h2>
            {s.verified ? "课堂连接，已恢复稳定" : "教学楼A无线体验持续下降"}
          </h2>
          <p>
            {s.verified
              ? "伙伴已完成专项优化，接入成功率恢复至98.6%，建议持续观察24小时。"
              : "过去24小时，部分无线设备接入失败率升高，可能影响高峰课堂互动。"}
          </p>
        </div>
      </div>
      <div className="risk-bottom">
        <span>
          <Sparkles size={15} />{" "}
          {s.verified
            ? "模拟效果验证已通过，报告与服务进度实时同步"
            : "AI 初步判断：疑似设备容量压力偏高，建议开展专项排查"}
        </span>
        <div className="actions">
          <Btn secondary small onClick={() => setModal("risk")}>
            查看风险分析
          </Btn>
          <Btn small onClick={s.report ? () => showReport() : createTicket}>
            {s.report
              ? "查看服务报告"
              : s.ticket
                ? "跟踪服务进度"
                : "申请伙伴服务"}
            <ArrowUpRight size={14} />
          </Btn>
        </div>
      </div>
    </Card>
  );
  const chatPanel = (full = false) => (
    <div className={`chat-panel ${full ? "full" : ""}`}>
      <div className="assistant-intro">
        <div className="aico-logo">
          <Sparkles size={25} />
        </div>
        <h2>
          {role === "customer"
            ? "你好，我是您的智能服务助手"
            : "让 Aico 帮您把任务做完"}
        </h2>
        <p>
          {role === "customer"
            ? "网络运行、服务进度与保障成果，随时为您解答。"
            : "从数据关联到服务交付，每一步都清晰可见。"}
        </p>
      </div>
      <div className="suggestions">
        {(role === "customer"
          ? [
              "我的网络今天运行怎么样？",
              "我的服务工单处理到哪一步了？",
              "帮我对比整改前后的效果",
              "帮我生成本月网络运行报告",
            ]
          : [
              "分析华东科技大学无线体验下降原因",
              "这个问题以前发生过吗？",
              "帮我找出本月经营机会",
              "总结本周完成的客户服务",
            ]
        ).map((q) => (
          <button key={q} onClick={() => ask(q)}>
            {q}
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <div className="messages" aria-live="polite">
        {messages.map((m, i) => (
          <div className={`message ${m.who}`} key={i}>
            {m.who === "ai" && <Sparkles size={16} />}
            <div>
              <p>{m.text}</p>
              {m.who === "ai" && (
                <div className="actions">
                  <button className="text-btn" onClick={() => setModal("risk")}>
                    查看业务依据
                  </button>
                  {/报告/.test(m.text) && (
                    <button
                      className="text-btn"
                      onClick={() =>
                        showReport(s.report ? "专项优化报告" : "月度健康报告")
                      }
                    >
                      打开报告
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="描述您想了解的问题或完成的任务…"
          aria-label="智能助手提问"
        />
        <button
          disabled={!question.trim()}
          className="send-btn"
          aria-label="发送提问"
        >
          <ArrowRight size={20} />
        </button>
      </form>
      <p className="fine-print">
        Aico 演示智能体 · 基于当前业务状态的预设模拟回复
      </p>
    </div>
  );
  const taskCanvas = () => (
    <Card
      title="任务执行画布"
      caption="专项诊断 · 华东科技大学 / 教学楼A"
      action={
        <Badge tone={s.diagnosed ? "green" : "red"}>
          {progress >= 0 && progress < 5
            ? "任务执行中"
            : s.diagnosed
              ? "分析已完成"
              : "等待任务"}
        </Badge>
      }
    >
      <div className="task-steps">
        {[
          "理解用户意图",
          "关联多源数据",
          "分析风险证据",
          "生成诊断结论",
          "推荐处置动作",
        ].map((name, i) => (
          <div
            key={name}
            className={`task-step ${(s.diagnosed && (progress < 0 || progress === 5)) || progress > i ? "done" : progress === i ? "active" : ""}`}
          >
            <span>
              {(s.diagnosed && (progress < 0 || progress === 5)) ||
              progress > i ? (
                <Check size={14} />
              ) : (
                i + 1
              )}
            </span>
            <div>
              <b>{name}</b>
              <small>
                {
                  [
                    "识别客户、站点与无线体验问题",
                    "设备 / 告警 / 拓扑 / 性能 / 历史知识",
                    "交叉比对12台AP负载及接入指标",
                    "疑似容量压力叠加同频干扰",
                    "工单、整改建议与交付报告",
                  ][i]
                }
              </small>
            </div>
            {progress === i && <i className="spinner" />}
          </div>
        ))}
      </div>
      {s.diagnosed ? (
        <>
          <div className="diagnosis">
            <Badge tone="orange">疑似根因 · 需要验证</Badge>
            <h3>高密接入与同频干扰叠加</h3>
            <p>
              12台AP在教学高峰承载过高，邻频覆盖重叠。上联丢包率仅0.1%，暂未见明显上联瓶颈。
            </p>
            <div className="evidence-grid">
              <div>
                <b>62</b>
                <span>平均终端 / AP</span>
              </div>
              <div>
                <b>82%</b>
                <span>信道利用率</span>
              </div>
              <div>
                <b>18.4%</b>
                <span>无线重传率</span>
              </div>
            </div>
            <p className="recommendation">
              建议：维护窗口内优化信道与功率、启用负载均衡；保存配置快照，异常时回退，观察30分钟后复测。
            </p>
          </div>
          <div className="actions wrap">
            <Btn onClick={createTicket}>
              <Plus size={15} /> {s.ticket ? "查看服务工单" : "创建服务工单"}
            </Btn>
            <Btn secondary onClick={() => go("unified", "partner")}>
              查看关联设备
            </Btn>
            <Btn secondary onClick={() => showReport("专项故障分析报告")}>
              生成分析报告
            </Btn>
            <Btn
              secondary
              onClick={() => {
                setModal("caseForm");
              }}
            >
              加入案例库
            </Btn>
          </div>
        </>
      ) : (
        <div className="empty">
          <Waypoints size={38} />
          <h3>连接数据，让诊断有据可依</h3>
          <p>启动任务后，Aico 将逐步关联设备、告警、拓扑和知识案例。</p>
          <Btn onClick={diagnose} disabled={progress >= 0 && progress < 5}>
            <Play size={15} />
            启动专项诊断
          </Btn>
        </div>
      )}
    </Card>
  );
  const ticketView = () => (
    <>
      <div className="section-tools">
        <span className="muted">华东科技大学 · 教学楼A专项保障</span>
        <Btn small onClick={createTicket}>
          <Plus size={15} />
          新建服务工单
        </Btn>
      </div>
      {!s.ticket ? (
        <Card>
          <div className="empty">
            <TicketIcon size={40} />
            <h3>风险已发现，等待发起专项服务</h3>
            <p>创建工单后，客户与伙伴可以在同一时间轴跟踪处理进展。</p>
            <Btn onClick={createTicket}>创建服务工单</Btn>
          </div>
        </Card>
      ) : (
        <>
          <Card
            title={s.ticket.title}
            caption={`${s.ticket.id} · 提交于演示日 2026-11-18`}
            action={
              <Badge tone={s.ticket.status === "已完成" ? "green" : "blue"}>
                {s.ticket.status}
              </Badge>
            }
          >
            <div className="workflow">
              {["待受理", "处理中", "待客户确认", "已完成"].map((v, i) => (
                <div
                  className={
                    i <=
                    ["待受理", "处理中", "待客户确认", "已完成"].indexOf(
                      s.ticket!.status,
                    )
                      ? "done"
                      : ""
                  }
                  key={v}
                >
                  <span>{i + 1}</span>
                  {v}
                </div>
              ))}
            </div>
            <div className="detail-grid">
              <div>
                <label>服务客户</label>
                <b>{customer}</b>
              </div>
              <div>
                <label>服务伙伴</label>
                <b>{partnerName}</b>
              </div>
              <div>
                <label>负责工程师</label>
                <b>{s.ticket.engineer}</b>
              </div>
              <div>
                <label>客户联系人</label>
                <b>{s.ticket.contact}</b>
              </div>
            </div>
            <p className="muted">{s.ticket.description}</p>
            <div className="actions wrap">
              {role === "partner" ? (
                <>
                  {s.ticket.status === "待受理" && (
                    <Btn
                      onClick={() =>
                        commit({ type: "accept" }, "接单成功，客户侧进度已同步")
                      }
                    >
                      受理工单
                    </Btn>
                  )}
                  {s.ticket.status !== "已完成" && (
                    <Btn secondary onClick={() => setModal("assign")}>
                      指派工程师
                    </Btn>
                  )}
                  {s.ticket.status === "处理中" && (
                    <>
                      <Btn secondary onClick={() => setModal("note")}>
                        更新处理记录
                      </Btn>
                      <Btn secondary onClick={() => go("unified")}>
                        进入统一保障
                      </Btn>
                      <Btn
                        disabled={!s.verified}
                        onClick={() =>
                          commit(
                            { type: "deliver" },
                            "报告已生成并完成模拟交付，等待客户确认",
                          )
                        }
                      >
                        完成服务并交付报告
                      </Btn>
                    </>
                  )}
                  {s.ticket.status === "待客户确认" && (
                    <Btn onClick={() => go("services", "customer")}>
                      前往客户面确认
                      <ArrowRight size={15} />
                    </Btn>
                  )}
                </>
              ) : (
                <>
                  {s.ticket.status === "待客户确认" && (
                    <Btn
                      onClick={() =>
                        commit(
                          { type: "confirm" },
                          "感谢确认！服务工单已完成，伙伴获得30成长积分",
                        )
                      }
                    >
                      确认服务成果
                    </Btn>
                  )}
                </>
              )}
              {s.report && (
                <Btn secondary onClick={() => showReport()}>
                  查看服务报告
                </Btn>
              )}
            </div>
            {s.ticket.status === "处理中" && !s.verified && (
              <p className="fine-print">
                交付条件：完成专项诊断、授权整改与效果验证。
              </p>
            )}
          </Card>
          <div className="grid two">
            <Card
              title="服务处理时间轴"
              caption="同一份进度，客户与伙伴实时共享"
            >
              {timeline()}
            </Card>
            <Card title="交付效果" caption="以业务改善衡量服务价值">
              {effect()}
              <div className="note-box">
                {s.report
                  ? s.ticket?.status === "已完成"
                    ? "客户已确认报告，工单正式完成。"
                    : "服务报告已推送客户；确认后工单正式完成。"
                  : "当前效果为待验证状态；伙伴完成模拟整改后才展示改善数据。"}
              </div>
              <Trend improved={s.verified} small />
            </Card>
          </div>
        </>
      )}
    </>
  );
  const reportCards = () => (
    <div className="grid three">
      {[
        "每日保障简报",
        "周度运行报告",
        "月度健康报告",
        ...(s.report ? ["专项优化报告"] : []),
        ...(s.diagnosed ? ["专项故障分析报告"] : []),
      ].map((r, i) => (
        <Card key={r}>
          <div className="report-icon">
            <FileText size={27} />
          </div>
          <Badge tone="green">
            {r === "专项优化报告" ? "已交付" : "演示报告"}
          </Badge>
          <h3>{r}</h3>
          <p className="muted">
            {customer}
            <br />
            2026年11月 · 华云数智服务团队
          </p>
          <div className="actions">
            <Btn secondary small onClick={() => showReport(r)}>
              查看报告
              <ArrowUpRight size={14} />
            </Btn>
            <button
              className="icon-btn"
              aria-label={`下载${r}`}
              onClick={() =>
                download(
                  `${r}.txt`,
                  `${r}\n概念演示\n${i === 3 && s.report ? reportText() : answer("网络本月报告", s, false)}`,
                )
              }
            >
              <Download size={17} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
  const productCards = () => (
    <div className="grid three">
      {products.map((p, i) => (
        <Card key={p}>
          <div className="product-symbol">
            {
              [
                <ShieldCheck />,
                <Activity />,
                <BarChart3 />,
                <Search />,
                <Network />,
              ][i]
            }
          </div>
          <h3>{p}</h3>
          <p className="muted">
            {
              [
                "全天候监测、主动风险提醒与远程支持",
                "评估设备状态、业务体验与容量趋势",
                "周期汇总健康指标并形成业务建议",
                "关联多源证据，辅助定位复杂故障",
                "针对高密接入场景开展专项优化",
              ][i]
            }
          </p>
          <ul className="plain-list">
            <li>
              适合客户：
              {i === 4 ? "高密办公 / 教育园区" : "多站点企业与教育客户"}
            </li>
            <li>服务周期：{i === 0 ? "按月持续保障" : "5个工作日（演示）"}</li>
            <li>
              交付标准：
              {i === 4
                ? "优化方案 + 前后效果验证"
                : "健康评估 + 结构化交付报告"}
            </li>
          </ul>
          <Btn
            secondary
            onClick={() => {
              setSelectedProduct(p);
              setModal("product");
            }}
          >
            {s.subscriptions.includes(p)
              ? "查看已开通服务"
              : role === "partner"
                ? "为客户开通服务"
                : "了解服务详情"}
            <ArrowUpRight size={14} />
          </Btn>
        </Card>
      ))}
    </div>
  );
  let content: ReactNode;
  if (page === "home")
    content = (
      <>
        {heading(
          "CUSTOMER EXPERIENCE / 客户服务",
          "您的业务运行，我们持续守护",
          `${customer} · 东部校区`,
          <div className="live">
            <span />
            保障服务持续在线
          </div>,
        )}
        {metrics([
          {
            title: "运行保障状态",
            value: s.verified ? "整体稳定" : "需要关注",
            hint: s.verified ? "教学楼A风险已缓解" : "存在1项待处理风险",
            icon: ShieldCheck,
            action: () => go("assurance"),
            tone: s.verified ? "green-text" : "orange-text",
          },
          {
            title: "在线设备",
            value: "1,286",
            unit: "台",
            hint: "覆盖4个业务站点",
            icon: Network,
            action: () => go("assurance"),
          },
          {
            title: "本月已完成服务",
            value: String(18 + (s.ticket?.status === "已完成" ? 1 : 0)),
            unit: "次",
            hint: "每一份服务都有迹可循",
            icon: CheckCircle2,
            action: () => {
              go("services");
              setTab("报告");
            },
          },
          {
            title: "当前服务工单",
            value: s.ticket && s.ticket.status !== "已完成" ? "1" : "0",
            unit: "项",
            hint: s.ticket ? s.ticket.status : "可随时申请专项服务",
            icon: TicketIcon,
            action: () => go("services"),
          },
        ])}
        {riskCard()}
        <div className="grid home-grid">
          <Card
            title="业务体验趋势"
            caption="过去24小时 · 以真实可感知的体验为中心"
            action={
              <Badge tone={s.verified ? "green" : "orange"}>
                {s.verified ? "恢复稳定" : "体验波动"}
              </Badge>
            }
          >
            <Trend improved={s.verified} />
            <div className="mini-metrics">
              <span>
                <i className="dot green" /> 办公业务 正常
              </span>
              <span>
                <i className={`dot ${s.verified ? "green" : "orange"}`} />{" "}
                教学业务 {s.verified ? "正常" : "需关注"}
              </span>
              <span>
                <i className="dot green" /> 校园门户 正常
              </span>
            </div>
          </Card>
          <Card
            title="我的服务伙伴"
            action={<Badge tone="green">服务中</Badge>}
          >
            <div className="partner-identity">
              <div className="partner-avatar">
                <Building2 size={27} />
              </div>
              <div>
                <h3>华云数智</h3>
                <p>让服务更主动，让网络更可靠</p>
              </div>
            </div>
            <div className="key-value">
              <span>服务经理</span>
              <b>陈晓 · 专属客户经理</b>
            </div>
            <div className="key-value">
              <span>当前服务</span>
              <b>智能远程保障服务</b>
            </div>
            <div className="key-value">
              <span>保障周期</span>
              <b>2026.01 — 2026.12</b>
            </div>
            <div className="actions">
              <Btn secondary onClick={() => setModal("contact")}>
                <MessageSquare size={15} />
                联系伙伴
              </Btn>
              <Btn secondary onClick={createTicket}>
                发起服务
                <ArrowUpRight size={15} />
              </Btn>
            </div>
          </Card>
        </div>
        <div className="grid home-grid">
          <Card
            title="最新服务动态"
            action={
              <button className="text-btn" onClick={() => go("services")}>
                全部动态
                <ChevronRight size={15} />
              </button>
            }
          >
            {timeline(4)}
          </Card>
          <Card className="assistant-card">
            <div className="inline">
              <Sparkles size={22} />
              <Badge tone="red">Aico</Badge>
            </div>
            <h2>
              让每一个问题，
              <br />
              都有清晰的答案。
            </h2>
            <p>
              网络今天怎么样？伙伴处理到哪了？
              <br />
              随时向您的智能服务助手提问。
            </p>
            <button
              className="assistant-launch"
              onClick={() => setAssistant(true)}
            >
              我的网络今天运行怎么样？
              <ArrowRight size={18} />
            </button>
          </Card>
        </div>
      </>
    );
  else if (page === "assurance" || page === "unified")
    content = (
      <>
        {heading(
          role === "customer"
            ? "BUSINESS ASSURANCE / 业务保障"
            : "UNIFIED OPERATIONS / 统一作业",
          role === "customer" ? "我的运行保障" : "一张视图，贯通服务全程",
          role === "customer"
            ? "把设备异常转化为您能理解的业务风险。"
            : "云端网管、地端指标与 O3 服务流程，在同一个工作空间协同。",
          <Btn
            secondary
            onClick={() => {
              showReport("健康巡检报告");
            }}
          >
            <Activity size={16} />
            健康巡检
          </Btn>,
        )}
        <div className="unified-layout">
          <Card title="站点与设备">
            <div className="site-list">
              {["教学楼A", "图书馆", "行政中心", "学生公寓"].map((site, i) => (
                <button
                  className={selectedSite === site ? "selected" : ""}
                  key={site}
                  onClick={() => {
                    setSelectedSite(site);
                    setSelectedDevice(i === 0 ? "AP-A-301" : `SW-${i}-001`);
                  }}
                >
                  <Building2 size={17} />
                  <span>
                    {site}
                    <small>{[186, 320, 260, 520][i]} 台设备</small>
                  </span>
                  <i
                    className={`dot ${i === 0 && !s.verified ? "orange" : "green"}`}
                  />
                </button>
              ))}
            </div>
            <div className="source-label">数据已汇聚</div>
            <div className="source-chip">
              <Cloud size={15} />
              云端网管
              <Check size={14} />
            </div>
            <div className="source-chip">
              <Network size={15} />
              地端专业能力
              <Check size={14} />
            </div>
            <div className="source-chip">
              <TicketIcon size={15} />
              O3服务流程
              <Check size={14} />
            </div>
          </Card>
          <div className="stack">
            <Card
              title={`${selectedSite} · 业务保障视图`}
              action={
                <Badge
                  tone={
                    selectedSite === "教学楼A" && !s.verified
                      ? "orange"
                      : "green"
                  }
                >
                  {selectedSite === "教学楼A" && !s.verified
                    ? "无线体验需关注"
                    : "业务运行正常"}
                </Badge>
              }
            >
              <div className="topology">
                <div className="topo-node">
                  <Cloud />
                  <b>校园核心网络</b>
                  <small>上联丢包 0.1%</small>
                </div>
                <span className="connector" />
                <div className="topo-node">
                  <Network />
                  <b>{selectedSite}汇聚交换机</b>
                  <small>链路负载 36%</small>
                </div>
                <span className="connector" />
                <button
                  className={`topo-node device ${!s.verified && selectedSite === "教学楼A" ? "warning" : ""}`}
                  onClick={() => setModal("device")}
                >
                  <Waypoints />
                  <b>{selectedDevice}</b>
                  <small>点击查看设备详情</small>
                </button>
              </div>
              <div className="mini-metrics">
                <span>
                  业务：
                  {selectedSite === "教学楼A" ? "课堂互动" : "办公及信息服务"}
                </span>
                <span>最近采集：演示日 09:12</span>
                <span>数据源：本地Mock</span>
              </div>
            </Card>
            <div className="grid two">
              <Card title="接入体验">
                <Trend
                  improved={s.verified || selectedSite !== "教学楼A"}
                  small
                />
              </Card>
              <Card title="容量与影响">
                <div className="capacity">
                  <b>
                    {selectedSite === "教学楼A" && !s.verified ? "82" : "48"}
                    <small>%</small>
                  </b>
                  <span>高峰无线信道利用率</span>
                  <div className="progress-track">
                    <i
                      style={{
                        width:
                          selectedSite === "教学楼A" && !s.verified
                            ? "82%"
                            : "48%",
                      }}
                    />
                  </div>
                </div>
                <p className="muted">
                  {selectedSite === "教学楼A"
                    ? "涉及12台AP、约740个高峰终端。近一季度终端容量增长32%，建议持续评估。"
                    : "当前容量余量充足，未发现显著业务风险。"}
                </p>
              </Card>
            </div>
            <Card
              title="关联风险与统一服务"
              caption="从告警到服务，让处理过程不断线"
            >
              <div className="alert-row">
                <AlertTriangle size={20} />
                <div>
                  <b>
                    {selectedSite === "教学楼A"
                      ? "无线接入失败率超过基线阈值"
                      : "历史巡检：未发现活动风险"}
                  </b>
                  <p>
                    {selectedSite === "教学楼A"
                      ? "告警聚合：接入失败 / 高信道利用率 / 重传升高"
                      : "设备状态正常，最近一次巡检已完成。"}
                  </p>
                </div>
                <Badge
                  tone={
                    s.verified || selectedSite !== "教学楼A"
                      ? "green"
                      : "orange"
                  }
                >
                  {s.verified || selectedSite !== "教学楼A"
                    ? "已缓解"
                    : "较高风险"}
                </Badge>
              </div>
              <div className="actions wrap">
                <Btn secondary onClick={() => setModal("risk")}>
                  查看风险依据
                </Btn>
                <Btn
                  secondary
                  onClick={() => {
                    setAssistant(true);
                    ask(`分析${selectedSite}设备${selectedDevice}运行情况`);
                  }}
                >
                  <Sparkles size={15} />
                  AI分析
                </Btn>
                <Btn secondary onClick={createTicket}>
                  {s.ticket ? "查看服务进度" : "生成工单"}
                </Btn>
              </div>
              {role === "partner" && (
                <div className="operation-panel">
                  <h3>
                    远程优化作业{" "}
                    <Badge tone="orange">配置变更 · 需要授权</Badge>
                  </h3>
                  <p>
                    作用范围：教学楼A 12台AP · 维护窗口：22:00–22:15 ·
                    回退：恢复配置快照
                  </p>
                  <div className="actions wrap">
                    <Btn
                      secondary
                      disabled={s.authorized}
                      onClick={() => setModal("authorize")}
                    >
                      {s.authorized ? (
                        <>
                          <Check size={15} />
                          已授权
                        </>
                      ) : (
                        "1. 模拟授权审批"
                      )}
                    </Btn>
                    <Btn
                      disabled={!s.authorized || s.optimized}
                      onClick={() =>
                        commit(
                          { type: "optimize" },
                          "模拟整改完成，配置快照已记录",
                        )
                      }
                    >
                      {s.optimized ? "2. 整改已完成" : "2. 执行模拟整改"}
                    </Btn>
                    <Btn
                      secondary
                      disabled={!s.optimized || s.verified}
                      onClick={() =>
                        commit({ type: "verify" }, "30分钟模拟观察窗验证通过")
                      }
                    >
                      {s.verified ? "3. 验证已通过" : "3. 验证优化效果"}
                    </Btn>
                  </div>
                  {s.verified && (
                    <>
                      <div className="spacer" />
                      {effect()}
                      <button
                        className="text-btn"
                        onClick={() => go("delivery")}
                      >
                        前往服务中心交付报告
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </>
    );
  else if (page === "services" || page === "delivery")
    content = (
      <>
        {heading(
          role === "customer"
            ? "MY SERVICES / 服务透明"
            : "SERVICE DELIVERY / 统一交付",
          role === "customer"
            ? "每一次服务，都看得见"
            : "把运维能力，交付为客户价值",
          role === "customer"
            ? "从主动发现到问题解决，全程了解伙伴为您做了什么。"
            : "工单、标准服务产品与客户成果，在同一处管理。",
        )}
        <div className="tabs">
          {[
            "工单",
            "报告",
            "服务套餐",
            ...(role === "partner" ? ["服务成果"] : []),
          ].map((v) => (
            <button
              className={tab === v ? "active" : ""}
              key={v}
              onClick={() => setTab(v)}
            >
              {v === "工单" ? "服务工单" : v === "报告" ? "服务报告" : v}
            </button>
          ))}
        </div>
        {tab === "工单" ? (
          ticketView()
        ) : tab === "报告" ? (
          reportCards()
        ) : tab === "服务套餐" ? (
          <>
            <Card className="subscription-banner">
              <div>
                <Badge tone="green">当前已开通</Badge>
                <h2>智能远程保障服务</h2>
                <p>
                  全天候监测 · 主动风险提醒 · 周期健康巡检 · 运行报告交付 ·
                  远程故障支持
                </p>
                <div className="actions wrap">
                  {s.subscriptions.map((p) => (
                    <Badge key={p}>{p}</Badge>
                  ))}
                </div>
              </div>
              <ShieldCheck size={58} />
            </Card>
            {productCards()}
          </>
        ) : (
          <>
            <Card
              title="服务成果总览"
              caption="服务可交付，效果可验证，经验可复用"
            >
              {effect()}
              <div className="detail-grid">
                <div>
                  <label>专项服务</label>
                  <b>{s.ticket?.status || "尚未创建"}</b>
                </div>
                <div>
                  <label>报告交付</label>
                  <b>{s.report ? "已交付客户" : "待生成"}</b>
                </div>
                <div>
                  <label>客户确认</label>
                  <b>{s.ticket?.status === "已完成" ? "已确认" : "待确认"}</b>
                </div>
                <div>
                  <label>案例复用</label>
                  <b>
                    {s.cases.filter((c) => c.status === "已发布").length}{" "}
                    篇已发布
                  </b>
                </div>
              </div>
              <div className="actions">
                <Btn disabled={!s.report} onClick={() => showReport()}>
                  查看交付报告
                </Btn>
                <Btn secondary onClick={() => setModal("caseForm")}>
                  整理优秀服务案例
                </Btn>
              </div>
            </Card>
          </>
        )}
      </>
    );
  else if (page === "chat")
    content = (
      <>
        {heading(
          "AI SERVICE / 智能服务",
          "让服务触手可及",
          "问运行、问进度、看结果。助手会根据当前演示状态回答。",
        )}
        <Card>{chatPanel(true)}</Card>
      </>
    );
  else if (page === "workbench")
    content = (
      <>
        {heading(
          "PARTNER WORKSPACE / 伙伴工作空间",
          "早上好，把精力留给更有价值的服务",
          "华云数智技术服务有限公司 · AI正在看护客户网络、发现风险并挖掘增长机会。",
          <Badge tone="red">
            <Star size={12} />
            {level(points(s))}
          </Badge>,
        )}
        {metrics([
          {
            title: "管理客户",
            value: "126",
            unit: "家",
            hint: "重点客户 24家",
            icon: Users,
            action: () => setFilter("重点客户"),
          },
          {
            title: "纳管设备",
            value: "18,560",
            unit: "台",
            hint: "云地数据统一汇聚",
            icon: Network,
            action: () => go("unified"),
          },
          {
            title: "待处理风险",
            value: s.verified ? "7" : "8",
            unit: "项",
            hint: s.verified ? "教学楼A已缓解" : "1项较高风险需关注",
            icon: AlertTriangle,
            action: () => go("unified"),
            tone: "orange-text",
          },
          {
            title: "本月完成服务",
            value: String(356 + (s.ticket?.status === "已完成" ? 1 : 0)),
            unit: "次",
            hint: "查看服务交付成果",
            icon: CheckCircle2,
            action: () => go("delivery"),
          },
          {
            title: "高价值机会",
            value: "12",
            unit: "项",
            hint: "AI推荐优先跟进",
            icon: TrendingUp,
            action: () => go("business"),
          },
          {
            title: "本月成长积分",
            value: `+${points(s) - 7790}`,
            hint: "每份贡献都被看见",
            icon: Trophy,
            action: () => go("growth"),
          },
        ])}
        <Card className="aico-hero">
          <div>
            <div className="inline">
              <Sparkles size={23} />
              <Badge tone="red">AICO 智能任务</Badge>
            </div>
            <h2>从一句话，开始一次高效服务。</h2>
            <p>连接设备、告警、拓扑与知识，让专业能力协同起来。</p>
            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                go("aico");
                ask(question);
              }}
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="告诉Aico您想完成什么任务……"
                aria-label="Aico任务输入"
              />
              <button
                className="send-btn"
                disabled={!question.trim()}
                aria-label="提交Aico任务"
              >
                <ArrowRight size={20} />
              </button>
            </form>
            <div className="suggestions inline-suggestions">
              {[
                "分析华东科技大学无线体验下降原因",
                "检查今天哪些客户存在高风险",
                "为重点客户生成健康巡检报告",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    go("aico");
                    ask(q);
                  }}
                >
                  {q}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </div>
          <div className="aico-orbit">
            <div>
              <Sparkles size={48} />
              <b>Aico</b>
            </div>
            <span className="orbit-tag tag-1">感知风险</span>
            <span className="orbit-tag tag-2">编排任务</span>
            <span className="orbit-tag tag-3">交付价值</span>
          </div>
        </Card>
        <div className="grid home-grid">
          <Card
            title="今日重点待办"
            caption="优先响应风险，主动兑现服务"
            action={<Badge>{s.verified ? "3" : "4"} 项待办</Badge>}
          >
            {[
              ["教学楼A无线体验专项排查", "较高风险 · 华东科技大学", "unified"],
              ["交付月度网络运行报告", "报告待交付 · 华东科技大学", "delivery"],
              ["跟进无线网络升级机会", "经营线索 · 建议健康评估", "business"],
              ["分享优秀服务案例", "生态共创 · 可获得成长积分", "ecosystem"],
            ].map(([title, desc, p], i) => (
              <button key={title} className="todo-row" onClick={() => go(p)}>
                <div className={`todo-icon color-${i}`}>
                  {i === 0 ? (
                    <AlertTriangle size={19} />
                  ) : i === 1 ? (
                    <FileText size={19} />
                  ) : i === 2 ? (
                    <TrendingUp size={19} />
                  ) : (
                    <BookOpen size={19} />
                  )}
                </div>
                <div>
                  <b>{title}</b>
                  <small>
                    {i === 0 && s.verified ? "已完成验证 · 等待持续观察" : desc}
                  </small>
                </div>
                <ChevronRight size={17} />
              </button>
            ))}
          </Card>
          <Card title="伙伴成长计划" className="growth-mini">
            <div className="trophy-circle">
              <Trophy size={32} />
            </div>
            <h3>{level(points(s))}</h3>
            <div className="points-small">
              {points(s).toLocaleString()} <small>成长积分</small>
            </div>
            <div className="progress-track">
              <i style={{ width: `${Math.min(points(s) / 100, 100)}%` }} />
            </div>
            <p>
              距离卓越伙伴还需 {Math.max(0, 10000 - points(s)).toLocaleString()}{" "}
              分
            </p>
            <button className="text-btn" onClick={() => go("growth")}>
              查看成长与激励
              <ArrowRight size={15} />
            </button>
          </Card>
        </div>
        <Card title="客户服务概览" caption="聚焦重点客户的运行与服务状态">
          <div className="section-tools">
            <div className="filter-tabs">
              {["全部客户", "重点客户", "存在风险", "服务中"].map((v) => (
                <button
                  key={v}
                  className={filter === v ? "active" : ""}
                  onClick={() => setFilter(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="search">
              <Search size={16} />
              <input
                placeholder="搜索客户"
                aria-label="搜索客户"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>客户名称</th>
                  <th>设备规模</th>
                  <th>运行状态</th>
                  <th>服务状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: customer,
                    devices: "1,286",
                    risk: !s.verified,
                    active: true,
                  },
                  {
                    name: "远景精密制造",
                    devices: "856",
                    risk: false,
                    active: false,
                  },
                  {
                    name: "滨江创新产业园",
                    devices: "624",
                    risk: true,
                    active: true,
                  },
                ]
                  .filter(
                    (c, i) =>
                      c.name.includes(query) &&
                      (filter === "重点客户"
                        ? i === 0
                        : filter === "存在风险"
                          ? c.risk
                          : filter === "服务中"
                            ? c.active
                            : true),
                  )
                  .map((c, i) => (
                    <tr key={c.name}>
                      <td>
                        <b>{c.name}</b>
                        <small>
                          {i === 0 ? "重点客户 · 教育" : "托管客户 · 示范数据"}
                        </small>
                      </td>
                      <td>{c.devices} 台</td>
                      <td>
                        <Badge tone={c.risk ? "orange" : "green"}>
                          {c.risk ? "存在风险" : "整体稳定"}
                        </Badge>
                      </td>
                      <td>
                        {c.name === customer
                          ? s.ticket?.status || "主动保障中"
                          : c.active
                            ? "周期巡检中"
                            : "保障中"}
                      </td>
                      <td>
                        <button
                          className="text-btn"
                          onClick={() => {
                            if (c.name === customer) go("unified");
                            else {
                              notify(
                                `${c.name}为组合概览样例；完整交互主线为华东科技大学`,
                              );
                              setModal("portfolio");
                            }
                          }}
                        >
                          查看
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    );
  else if (page === "aico")
    content = (
      <>
        {heading(
          "AICO INTELLIGENCE / 智能是能力",
          "让智能，从回答走向行动",
          "关联多源运维证据，编排诊断任务，输出可以继续执行的建议。",
          <Btn
            secondary
            onClick={diagnose}
            disabled={progress >= 0 && progress < 5}
          >
            <RefreshCw size={15} />
            重新运行诊断
          </Btn>,
        )}
        <div className="aico-layout">
          <Card className="conversation-card">{chatPanel()}</Card>
          <div className="stack">
            {taskCanvas()}
            <Card title="关联知识与数据">
              <div className="data-sources">
                {[
                  ["设备资产", "12台 AP / 1台交换机"],
                  ["实时告警", "3类关联无线告警"],
                  ["性能指标", "24小时体验与容量趋势"],
                  ["知识案例", "KB-2026-018 高密无线"],
                ].map(([a, b]) => (
                  <button
                    key={a}
                    onClick={() =>
                      setModal(
                        a === "知识案例"
                          ? "knowledge"
                          : a === "设备资产"
                            ? "device"
                            : "risk",
                      )
                    }
                  >
                    <span>{a}</span>
                    <b>{b}</b>
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  else if (page === "business")
    content = (
      <>
        {heading(
          "GROWTH INTELLIGENCE / 服务驱动经营",
          "从服务洞察，发现下一次增长",
          "每一条机会都有设备和业务依据，每一次跟进都留下经营记录。",
        )}
        {metrics([
          {
            title: "存量经营机会",
            value: "38",
            unit: "项",
            hint: "来自设备与业务洞察",
            icon: TrendingUp,
            action: () => setModal("opportunity"),
          },
          {
            title: "高价值机会",
            value: "12",
            unit: "项",
            hint: "建议优先健康评估",
            icon: Star,
            action: () => setModal("opportunity"),
          },
          {
            title: "伙伴已确认机会",
            value: String(8 + (s.lead !== "未创建" ? 1 : 0)),
            unit: "项",
            hint: "本次线索与总览联动",
            icon: CheckCircle2,
            action: () => setModal("lead"),
          },
          {
            title: "正在跟进机会",
            value: String(5 + (s.lead === "已跟进" ? 1 : 0)),
            unit: "项",
            hint: s.lead,
            icon: Clock3,
            action: () => setModal("lead"),
          },
        ])}
        <Card className="opportunity-card">
          <div className="opportunity-header">
            <div className="inline">
              <span className="rank">01</span>
              <Badge tone="red">AI 推荐 · 高价值机会</Badge>
            </div>
            <Badge tone={s.lead === "已跟进" ? "green" : "blue"}>
              {s.lead === "未创建" ? "待伙伴评估" : s.lead}
            </Badge>
          </div>
          <h2>
            华东科技大学 <span className="muted">/</span> 无线网络升级机会
          </h2>
          <p>从体验风险出发，以健康评估建立长期容量规划。</p>
          <div className="opportunity-evidence">
            {[
              ["24 台", "设备服役超过5年"],
              ["+32%", "高峰终端容量增长"],
              ["3 次", "近90天同类体验波动"],
            ].map(([a, b]) => (
              <div key={a}>
                <strong>{a}</strong>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="note-box">
            <Sparkles size={18} />
            <div>
              <b>AI建议</b>
              <p>
                先开展专项网络健康评估，结合课程密度、实际业务需求和设备支持周期，形成分阶段优化或升级方案。此线索不代表采购意向或成交承诺。
              </p>
            </div>
          </div>
          <div className="actions wrap">
            <Btn secondary onClick={() => setModal("opportunity")}>
              查看分析依据
            </Btn>
            <Btn secondary onClick={() => showReport("客户沟通报告")}>
              生成客户沟通报告
            </Btn>
            <Btn
              disabled={s.lead !== "未创建"}
              onClick={() =>
                commit({ type: "lead" }, "经营线索已创建，负责人：陈晓")
              }
            >
              {s.lead === "未创建" ? "创建经营线索" : "线索已创建"}
            </Btn>
            <Btn
              secondary
              disabled={s.lead !== "待跟进"}
              onClick={() =>
                commit({ type: "follow" }, "已标记跟进：预约网络健康评估")
              }
            >
              标记已跟进
            </Btn>
          </div>
        </Card>
        <div className="grid two">
          <Card title="推荐服务路径">
            <div className="journey">
              <span>健康评估</span>
              <ArrowRight />
              <span>容量规划</span>
              <ArrowRight />
              <span>专项优化</span>
            </div>
            <p className="muted">
              用可验证的服务成果推进客户沟通，让每一步经营动作都有依据。
            </p>
            <Btn
              secondary
              onClick={() => {
                setSelectedProduct("网络健康评估");
                setModal("product");
              }}
            >
              为客户开通健康评估
            </Btn>
          </Card>
          <Card title="线索跟进记录">
            <div className="key-value">
              <span>线索编号</span>
              <b>{s.lead === "未创建" ? "待生成" : "OP-20261118-01"}</b>
            </div>
            <div className="key-value">
              <span>客户负责人</span>
              <b>陈晓 · 客户经理</b>
            </div>
            <div className="key-value">
              <span>当前阶段</span>
              <Badge tone="blue">{s.lead}</Badge>
            </div>
            <div className="key-value">
              <span>下一步行动</span>
              <b>
                {s.lead === "已跟进"
                  ? "形成健康评估范围与计划"
                  : "预约客户需求沟通"}
              </b>
            </div>
          </Card>
        </div>
      </>
    );
  else if (page === "growth")
    content = (
      <>
        {heading(
          "PARTNER GROWTH / 平台来运营",
          "每一份服务贡献，都值得被看见",
          "云管平台内部模拟成长机制，不代表正式华为伙伴认证等级或商业政策。",
          <Btn secondary onClick={() => setModal("ledger")}>
            积分明细
            <ArrowUpRight size={15} />
          </Btn>,
        )}
        <Card className="growth-banner">
          <div className="growth-badge">
            <Trophy size={58} />
            <span>{level(points(s))}</span>
          </div>
          <div className="growth-stats">
            <p>{partnerName}</p>
            <h2>
              {points(s).toLocaleString()} <span>成长积分</span>
            </h2>
            <div className="progress-track">
              <i style={{ width: `${Math.min(points(s) / 100, 100)}%` }} />
            </div>
            <div className="between">
              <span>本月新增 +{points(s) - 7790} 分</span>
              <span>
                {points(s) >= 10000
                  ? "已达卓越伙伴演示等级"
                  : `距离卓越伙伴还需 ${(10000 - points(s)).toLocaleString()} 分`}
              </span>
            </div>
          </div>
          <div className="growth-perks">
            <Badge tone="gold">当前等级权益</Badge>
            <p>
              培训资源与案例展示
              <br />
              联合客户交流机会
              <br />
              专项激励申请资格
            </p>
          </div>
        </Card>
        <div className="grid four">
          {[
            ["平台使用贡献", Activity, "智能巡检 · 有效任务"],
            ["客户拓展贡献", Users, "连云客户 · 服务覆盖"],
            ["服务交付贡献", ShieldCheck, "工单交付 · 客户确认"],
            ["生态推广贡献", BookOpen, "成功案例 · 联合推广"],
          ].map(([name, Icon, sub]) => {
            const I = Icon as LucideIcon;
            return (
              <button
                className="contribution card"
                key={name as string}
                onClick={() => setModal("ledger")}
              >
                <I size={23} />
                <h3>{name as string}</h3>
                <p>{sub as string}</p>
                <span>
                  查看贡献明细
                  <ArrowUpRight size={14} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid home-grid">
          <Card title="伙伴成长任务" caption="演示规则 · 任务奖励只发放一次">
            {[
              {
                id: "inspection",
                title: "本月完成10次有效健康巡检",
                points: 200,
                desc: "9/10 → 模拟完成最后一次巡检",
              },
              {
                id: "customers",
                title: "新增3家有效连云客户",
                points: 600,
                desc: "2/3 → 模拟完成客户连云",
              },
              {
                id: "case-task",
                title: "提交1篇优秀客户服务案例",
                points: 100,
                desc: "审核通过后奖励，前往生态共创中心",
              },
              {
                id: "exchange",
                title: "邀请伙伴参与生态交流",
                points: 500,
                desc: "模拟完成联合交流任务",
              },
            ].map((t) => (
              <div className="growth-task" key={t.id}>
                <div className="task-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <b>{t.title}</b>
                  <p>{t.desc}</p>
                </div>
                <div className="task-reward">
                  +{t.points}
                  <small>积分</small>
                </div>
                <Btn
                  small
                  secondary
                  disabled={s.completedTasks.includes(t.id)}
                  onClick={() =>
                    t.id === "case-task"
                      ? go("ecosystem")
                      : commit(
                          { type: "task", ...t },
                          `模拟任务完成，获得${t.points}成长积分`,
                        )
                  }
                >
                  {s.completedTasks.includes(t.id)
                    ? "已完成"
                    : t.id === "case-task"
                      ? "去分享"
                      : "模拟完成"}
                </Btn>
              </div>
            ))}
          </Card>
          <Card
            title="云管伙伴生态激励基金"
            className="fund-card"
            caption="激励概念 · 非现金兑换"
          >
            <Gift size={32} />
            <h3>
              支持服务价值，
              <br />
              让优秀实践走得更远。
            </h3>
            <p>
              平台探索以专项激励资源，支持积极使用云管、拓展客户、创造服务价值与推动生态推广的伙伴。
            </p>
            <div className="benefit-tags">
              <span>专项成长奖励</span>
              <span>市场活动支持</span>
              <span>联合营销资源</span>
              <span>优秀案例推广</span>
              <span>优质伙伴激励</span>
            </div>
            <div className="actions">
              <Btn onClick={() => setModal("fund")}>申请专项激励</Btn>
              <Btn secondary onClick={() => setModal("applications")}>
                申请记录
              </Btn>
            </div>
            <button className="text-btn" onClick={() => setModal("rules")}>
              查看激励规则
              <ArrowRight size={14} />
            </button>
          </Card>
        </div>
        <Card
          title="成长路径"
          caption="等级随积分变化实时更新 · 平台内部演示机制"
        >
          <div className="levels">
            {[
              ["成长伙伴", "0", "基础培训资源"],
              ["银牌伙伴", "2,000", "市场推广资源"],
              ["黄金伙伴", "5,000", "联合交流 / 案例展示"],
              ["卓越伙伴", "10,000", "专项激励优先评估"],
            ].map(([a, b, c]) => (
              <div className={level(points(s)) === a ? "current" : ""} key={a}>
                <Trophy size={24} />
                <b>{a}</b>
                <span>{b} 分起</span>
                <small>{c}</small>
              </div>
            ))}
          </div>
          <p className="fine-print">
            积分仅衡量演示贡献，不等同现金，不构成实际奖励承诺。所有申请均为本地模拟。
          </p>
        </Card>
      </>
    );
  else
    content = (
      <>
        {heading(
          "ECOSYSTEM CO-CREATION / 生态共创",
          "让一次成功，成为更多人的起点",
          "沉淀服务经验，复用优秀实践，让客户价值在伙伴生态中持续生长。",
          <Btn onClick={() => setModal("caseForm")}>
            <Plus size={16} />
            分享我的成功案例
          </Btn>,
        )}
        <div className="ecology-intro">
          <div>
            <Badge tone="red">精选实践</Badge>
            <h2>
              把看得见的服务成果，
              <br />
              变成可复制的专业能力。
            </h2>
            <p>以脱敏案例连接经验、服务与成长。</p>
          </div>
          <div className="ecology-stat">
            <b>{3 + s.cases.filter((c) => c.status === "已发布").length}</b>
            <span>精选服务案例</span>
          </div>
          <div className="ecology-stat">
            <b>{s.learned.length}</b>
            <span>已加入学习清单</span>
          </div>
        </div>
        {s.cases.some((c) => c.status === "待审核") && (
          <Card
            title="我的待审核案例"
            caption="案例已提交，等待审核；此处可模拟平台审核。"
          >
            {s.cases
              .filter((c) => c.status === "待审核")
              .map((c) => (
                <div className="pending-case" key={c.id}>
                  <div>
                    <b>{c.title}</b>
                    <p>{c.industry} · 已确认客户授权与脱敏</p>
                  </div>
                  <Badge tone="orange">待审核</Badge>
                  <Btn
                    small
                    onClick={() =>
                      commit(
                        { type: "approveCase", id: c.id },
                        "案例审核通过，获得100成长积分",
                      )
                    }
                  >
                    模拟审核通过
                  </Btn>
                </div>
              ))}
          </Card>
        )}
        <div className="grid three">
          {[
            ...sampleCases,
            ...s.cases
              .filter((c) => c.status === "已发布")
              .map((c) => ({ ...c, ref: 0 })),
          ].map((c, i) => (
            <Card key={c.id} className="case-card">
              <div className={`case-art art-${i % 3}`}>
                <div className="case-line" />
                {i % 3 === 0 ? (
                  <GraduationCap size={56} />
                ) : i % 3 === 1 ? (
                  <Building2 size={56} />
                ) : (
                  <Network size={56} />
                )}
                <span>{c.industry.toUpperCase()} / 服务实践</span>
              </div>
              <div className="case-body">
                <Badge>{c.scene}</Badge>
                <h3>{c.title}</h3>
                <p>{c.problem}</p>
                <div className="case-effect">
                  <TrendingUp size={16} />
                  {c.effect}
                </div>
                <div className="case-meta">
                  <span>华云数智 · {c.ref} 次参考</span>
                  <button
                    className="text-btn"
                    onClick={() => {
                      setSelectedCase(c.id);
                      setModal("caseDetail");
                    }}
                  >
                    查看案例
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card title="我的复用资产" caption="把优秀实践带回您的服务现场">
          <div className="actions wrap">
            <Badge tone="blue">学习清单 {s.learned.length} 项</Badge>
            <Badge tone="green">服务模板 {s.templates.length} 份</Badge>
            <Badge tone="red">
              推广申请{" "}
              {s.applications.filter((a) => a.name.includes("推广")).length} 项
            </Badge>
          </div>
          {[...new Set([...s.learned, ...s.templates])].map((id) => (
            <div className="key-value" key={id}>
              <b>
                {[...sampleCases, ...s.cases].find((c) => c.id === id)?.title}
              </b>
              <span>
                {s.learned.includes(id) ? "已收藏学习 " : ""}
                {s.templates.includes(id) ? "已复制模板" : ""}
              </span>
            </div>
          ))}
        </Card>
      </>
    );
  const formData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return new FormData(e.currentTarget);
  };
  const close = () => setModal(null);
  let dialog: ReactNode = null;
  if (modal === "request")
    dialog = (
      <>
        <p className="muted">
          为教学楼A无线体验问题申请专项服务，提交后双方实时同步。
        </p>
        <form
          onSubmit={(e) => {
            const f = formData(e);
            if (
              commit(
                {
                  type: "createTicket",
                  data: {
                    title: "教学楼A无线接入体验专项优化",
                    type: String(f.get("type")),
                    description: String(f.get("description")),
                    contact: String(f.get("contact")),
                  },
                },
                "服务工单创建成功，客户侧与伙伴侧已同步",
              )
            ) {
              close();
              go(role === "customer" ? "services" : "delivery");
            }
          }}
        >
          <label className="field">
            问题类型
            <select name="type">
              <option>无线接入体验下降</option>
              <option>网络容量评估</option>
              <option>专项健康巡检</option>
            </select>
          </label>
          <label className="field">
            补充描述
            <textarea
              required
              name="description"
              defaultValue="教学楼A高峰课堂接入不稳定，请协助定位问题并提供优化建议。"
            />
          </label>
          <label className="field">
            联系人
            <select name="contact">
              <option>李老师 · 信息中心</option>
              <option>王老师 · 教学管理中心</option>
            </select>
          </label>
          <div className="note-box">
            服务伙伴：{partnerName}
            <br />
            此提交仅更新本地演示数据，不向外部系统发送请求。
          </div>
          <button className="btn form-submit">
            提交服务请求
            <ArrowRight size={16} />
          </button>
        </form>
      </>
    );
  if (modal === "risk")
    dialog = (
      <>
        <Badge tone={s.verified ? "green" : "orange"}>
          {s.verified ? "风险已缓解" : "较高风险 · 建议专项排查"}
        </Badge>
        <h3>教学楼A无线接入体验持续下降</h3>
        <p className="muted">
          可能影响互动课堂、教学资源访问及高峰终端接入。分析结论为疑似根因，需现场或远程验证。
        </p>
        <div className="detail-grid">
          <div>
            <label>关联设备</label>
            <b>AP-A-301 等12台AP</b>
          </div>
          <div>
            <label>服务伙伴</label>
            <b>华云数智技术服务</b>
          </div>
          <div>
            <label>分析时间窗</label>
            <b>过去24小时</b>
          </div>
          <div>
            <label>处理进度</label>
            <b>{s.ticket?.status || "待发起专项服务"}</b>
          </div>
        </div>
        <h3>AI分析依据</h3>
        <ul className="evidence-list">
          <li>接入成功率从稳定基线98%下降至89.2%</li>
          <li>平均终端数62 / AP，信道利用率82%，高于70%观察阈值</li>
          <li>无线重传率18.4%，与高峰课堂时间存在关联</li>
          <li>上联丢包0.1%、链路负载36%，暂未见明显上联瓶颈</li>
        </ul>
        <div className="note-box">
          建议先核验信道干扰和高峰负载，在维护窗口内优化信道与功率、启用负载均衡，再复测接入体验。
        </div>
        {s.verified && effect()}
        <div className="actions">
          <Btn
            onClick={() => {
              close();
              role === "partner" ? diagnose() : createTicket();
            }}
          >
            {role === "partner"
              ? "进入Aico专项诊断"
              : s.ticket
                ? "跟踪服务进度"
                : "申请伙伴服务"}
          </Btn>
        </div>
      </>
    );
  if (modal === "authorize")
    dialog = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            commit(
              { type: "authorize" },
              "模拟授权审批通过，已记录影响评估与回退预案",
            )
          )
            close();
        }}
      >
        <Badge tone="orange">高风险配置变更 · 模拟审批</Badge>
        <h3>教学楼A无线体验优化</h3>
        <div className="detail-grid">
          <div>
            <label>变更范围</label>
            <b>12台AP · 信道 / 功率 / 均衡</b>
          </div>
          <div>
            <label>执行工程师</label>
            <b>{s.ticket?.engineer || "待指派"}</b>
          </div>
          <div>
            <label>维护窗口</label>
            <b>22:00–22:15（模拟）</b>
          </div>
          <div>
            <label>授权人</label>
            <b>李老师 · 客户IT负责人（模拟）</b>
          </div>
        </div>
        <div className="note-box warning-note">
          影响评估：可能造成短暂无线重连。执行前保存配置快照；若接入成功率进一步下降或业务异常，恢复原信道与功率策略。
        </div>
        <label className="check-field">
          <input type="checkbox" required />
          已模拟取得客户维护窗口授权，并确认业务影响及回退预案。
        </label>
        <p className="fine-print">本操作不会连接真实设备或修改实际网络。</p>
        <button className="btn form-submit">
          确认模拟授权审批
          <ShieldCheck size={16} />
        </button>
      </form>
    );
  if (modal === "assign")
    dialog = (
      <form
        onSubmit={(e) => {
          const f = formData(e);
          if (
            commit(
              { type: "assign", engineer: String(f.get("engineer")) },
              "工程师已指派，客户服务进度已同步",
            )
          )
            close();
        }}
      >
        <label className="field">
          负责工程师
          <select name="engineer">
            <option>张明 · 网络工程师</option>
            <option>刘洋 · 无线专家</option>
            <option>赵敏 · 服务交付工程师</option>
          </select>
        </label>
        <button className="btn form-submit">确认指派</button>
      </form>
    );
  if (modal === "note")
    dialog = (
      <form
        onSubmit={(e) => {
          const f = formData(e);
          if (
            commit(
              { type: "note", text: String(f.get("note")) },
              "处理记录已同步给客户",
            )
          )
            close();
        }}
      >
        <label className="field">
          处理记录
          <textarea
            name="note"
            required
            placeholder="例如：已核对高峰终端数，正在准备维护窗口内的信道优化方案。"
          />
        </label>
        <button className="btn form-submit">发布进度更新</button>
      </form>
    );
  if (modal === "report")
    dialog = (
      <>
        <div className="report-heading">
          <span>iMasterCloud / SERVICE REPORT</span>
          <h2>{reportType}</h2>
          <p>{customer} · 2026年11月18日 · 概念演示</p>
        </div>
        <div className="report-summary">
          {[
            [
              "01",
              "发现了什么",
              "12台AP高密接入，体验下降；疑似容量压力与同频干扰叠加。",
            ],
            [
              "02",
              "伙伴做了什么",
              s.verified
                ? "经模拟授权，完成信道、功率与终端负载优化。"
                : "正在开展专项分析，整改尚未完成。",
            ],
            [
              "03",
              "最终改善了什么",
              s.verified
                ? "接入成功率提升9.4个百分点，业务体验恢复稳定。"
                : "待完成整改与效果验证后，生成可核验的改善结果。",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        {effect()}
        <h3>{reportType === "客户沟通报告" ? "经营建议" : "后续保障建议"}</h3>
        <p className="muted">
          {reportType === "客户沟通报告"
            ? "24台设备服役超过5年，高峰容量增长32%。建议先开展健康评估，再结合业务计划与预算制定分阶段方案。"
            : "继续监测24小时，核验高峰课堂接入体验；建议定期检查容量和信道分布。所有结果来自本地模拟数据，不构成真实运维结论。"}
        </p>
        <div className="actions wrap">
          <Btn
            onClick={() =>
              download(`${customer}-${reportType}.txt`, reportText())
            }
          >
            <Download size={16} />
            模拟下载报告
          </Btn>
          <Btn
            secondary
            onClick={() =>
              share(
                `iMasterCloud 概念演示｜${reportType}：某高校无线体验保障。${s.verified ? "模拟接入成功率89.2%提升至98.6%。" : "当前仍在分析，效果待验证。"}所有数据为虚构。`,
              )
            }
          >
            分享报告
          </Btn>
          {role === "customer" && s.ticket?.status === "待客户确认" && (
            <Btn
              secondary
              onClick={() => {
                commit({ type: "confirm" }, "客户已确认，工单完成");
                close();
              }}
            >
              确认服务成果
            </Btn>
          )}
        </div>
        <p className="fine-print">
          下载为可阅读的TXT演示报告；分享复制脱敏摘要，不创建公开链接。
        </p>
      </>
    );
  if (modal === "product")
    dialog = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (
            commit(
              { type: "subscribe", name: selectedProduct },
              "服务已模拟开通，客户服务套餐已同步",
            )
          )
            close();
        }}
      >
        <Badge tone="red">标准服务产品</Badge>
        <h3>{selectedProduct}</h3>
        <label className="field">
          服务客户
          <select>
            <option>{customer}</option>
          </select>
        </label>
        <div className="note-box">
          交付内容：运行评估、风险分析、优化建议与效果报告。
          <br />
          交付周期：5个工作日（演示）；持续看护按月交付。
          <br />
          预期价值：降低业务风险，提升网络可用性，明确容量规划依据。
        </div>
        <label className="check-field">
          <input required type="checkbox" />
          确认服务范围与交付标准（本地模拟，无真实订单或费用）
        </label>
        <button
          className="btn form-submit"
          disabled={s.subscriptions.includes(selectedProduct)}
        >
          {s.subscriptions.includes(selectedProduct)
            ? "该服务已开通"
            : "确认开通服务"}
        </button>
      </form>
    );
  if (modal === "caseForm")
    dialog = (
      <form
        onSubmit={(e) => {
          const f = formData(e);
          const data = {
            title: String(f.get("title")).trim(),
            industry: String(f.get("industry")),
            scene: String(f.get("scene")),
            problem: String(f.get("problem")),
            abilities: String(f.get("abilities")),
            solution: String(f.get("solution")).trim(),
            effect: String(f.get("effect")).trim(),
            attachment: (f.get("attachment") as File)?.name || "",
            authorized: f.get("authorized") === "on",
          };
          if (commit({ type: "submitCase", data }, "案例已提交，等待审核")) {
            close();
            go("ecosystem", "partner");
          }
        }}
      >
        <p className="muted">
          仅提交脱敏演示资料；附件只记录文件名，不上传文件内容。
        </p>
        <div className="grid two">
          <label className="field">
            案例名称
            <input
              required
              name="title"
              defaultValue="某高校无线体验主动保障实践"
            />
          </label>
          <label className="field">
            客户行业
            <select name="industry">
              <option>教育</option>
              <option>制造</option>
              <option>园区</option>
            </select>
          </label>
        </div>
        <label className="field">
          服务场景
          <input required name="scene" defaultValue="高密教学场景无线保障" />
        </label>
        <label className="field">
          客户问题
          <textarea
            required
            name="problem"
            defaultValue="高峰教学时段接入体验下降，影响互动课堂。"
          />
        </label>
        <label className="field">
          使用的云管能力
          <input
            name="abilities"
            required
            defaultValue="AI风险分析、统一运维、O3工单协同"
          />
        </label>
        <label className="field">
          解决过程
          <textarea
            name="solution"
            required
            defaultValue={
              s.verified
                ? "经客户授权，在维护窗口调整信道与功率、启用负载均衡，并通过30分钟观察窗验证。"
                : "通过多源数据关联，提出信道优化与负载均衡建议，待授权与验证。"
            }
          />
        </label>
        <label className="field">
          取得的效果
          <textarea
            name="effect"
            required
            defaultValue={
              s.verified
                ? "模拟接入成功率89.2% → 98.6%，时延86ms → 24ms。"
                : "当前完成诊断方案，整改效果待验证。"
            }
          />
        </label>
        <label className="field">
          附件（可选，仅记录名称）
          <input
            name="attachment"
            type="file"
            accept=".txt,.pdf,.png,.jpg,.docx"
          />
        </label>
        <label className="check-field">
          <input required name="authorized" type="checkbox" />
          已模拟取得客户授权，确认案例已脱敏，不含未经授权的客户资料。
        </label>
        <button className="btn form-submit">
          提交案例审核
          <ArrowRight size={16} />
        </button>
      </form>
    );
  if (modal === "caseDetail") {
    const c = [...sampleCases, ...s.cases].find((c) => c.id === selectedCase)!;
    dialog = (
      <>
        <Badge tone="blue">
          {c.industry} · {c.scene}
        </Badge>
        <h2>{c.title}</h2>
        <p className="muted">分享伙伴：{partnerName} · 脱敏演示案例</p>
        {[
          ["客户痛点", c.problem],
          ["云管能力", c.abilities],
          ["解决过程", c.solution],
          ["服务成效", c.effect],
        ].map(([a, b]) => (
          <div className="case-detail-item" key={a}>
            <h3>{a}</h3>
            <p>{b}</p>
          </div>
        ))}
        <div className="actions wrap">
          <Btn
            secondary
            onClick={() => share(`脱敏演示案例：${c.title}。${c.effect}`)}
          >
            分享案例
          </Btn>
          <Btn
            secondary
            disabled={s.learned.includes(c.id)}
            onClick={() =>
              commit({ type: "learn", id: c.id }, "已加入学习清单")
            }
          >
            {s.learned.includes(c.id) ? "已加入学习" : "加入学习清单"}
          </Btn>
          <Btn
            secondary
            disabled={s.templates.includes(c.id)}
            onClick={() => {
              commit(
                { type: "template", id: c.id },
                "服务模板已复制到复用资产",
              );
              download(
                `${c.title}-服务模板.txt`,
                `服务模板（脱敏演示）\n场景：${c.scene}\n问题：${c.problem}\n能力：${c.abilities}\n建议过程：${c.solution}\n交付：评估、授权、整改、验证、报告与确认。`,
              );
            }}
          >
            {s.templates.includes(c.id) ? "模板已复制" : "复制服务模板"}
          </Btn>
          <Btn
            onClick={() => {
              const own = s.cases.find((x) => x.id === c.id);
              if (own)
                commit({ type: "promote", id: c.id }, "联合推广申请已提交");
              else
                commit(
                  { type: "apply", name: `案例联合推广：${c.title}` },
                  "联合推广申请已提交",
                );
            }}
          >
            申请联合推广
          </Btn>
        </div>
      </>
    );
  }
  if (modal === "fund")
    dialog = (
      <form
        onSubmit={(e) => {
          const f = formData(e);
          if (
            commit(
              { type: "apply", name: String(f.get("fund")) },
              "专项激励申请已提交，等待模拟评审",
            )
          )
            close();
        }}
      >
        <p className="muted">
          支持服务价值与生态共创。积分不直接兑换现金，审批与权益均为演示机制。
        </p>
        <label className="field">
          申请方向
          <select name="fund">
            <option>优秀案例推广激励</option>
            <option>市场活动支持</option>
            <option>专项成长奖励</option>
            <option>联合营销资源</option>
          </select>
        </label>
        <label className="field">
          申请说明
          <textarea
            required
            defaultValue="基于已完成的服务实践，申请开展脱敏案例分享与伙伴经验交流。"
          />
        </label>
        <label className="check-field">
          <input required type="checkbox" />
          已了解这是概念机制，不代表正式商业政策或资金承诺。
        </label>
        <button className="btn form-submit">提交模拟申请</button>
      </form>
    );
  if (modal === "applications")
    dialog = (
      <>
        {s.applications.length ? (
          s.applications.map((a) => (
            <div className="key-value" key={a.id}>
              <div>
                <b>{a.name}</b>
                <p className="muted text-sm">{a.id}</p>
              </div>
              <Badge tone="orange">{a.status}</Badge>
            </div>
          ))
        ) : (
          <div className="empty">
            <Gift size={35} />
            <h3>暂无申请记录</h3>
            <p>可在成长中心申请专项激励。</p>
          </div>
        )}
        <p className="fine-print">
          所有申请仅保存在当前浏览器；不会实际提交给华为或合作伙伴。
        </p>
      </>
    );
  if (modal === "ledger")
    dialog = (
      <>
        <div className="ledger-total">
          <span>当前成长积分</span>
          <b>{points(s).toLocaleString()}</b>
        </div>
        <div className="key-value">
          <span>演示期初余额</span>
          <b>8,650</b>
        </div>
        {s.ledger.map((l) => (
          <div className="key-value" key={l.id}>
            <span>{l.title}</span>
            <b className="green-text">+{l.points}</b>
          </div>
        ))}
        <p className="fine-print">
          演示奖励：服务交付+50、客户确认+30、案例审核+100；同一事件仅奖励一次。积分不等于现金。
        </p>
      </>
    );
  if (modal === "rules")
    dialog = (
      <>
        <h3>云管内部成长与激励演示规则</h3>
        <ul className="evidence-list">
          <li>有效服务交付 +50分，客户确认 +30分。</li>
          <li>脱敏案例审核通过 +100分，同一案例仅奖励一次。</li>
          <li>模拟健康巡检任务 +200分，客户拓展 +600分，生态交流 +500分。</li>
          <li>
            0 / 2,000 / 5,000 / 10,000分分别对应成长 / 银牌 / 黄金 / 卓越伙伴。
          </li>
          <li>权益包含培训、市场推广、案例展示和专项激励评估资格。</li>
        </ul>
        <div className="note-box">
          本机制为概念演示，不代表正式认证等级，不等同现金，不构成资金发放或商业承诺。
        </div>
      </>
    );
  if (modal === "device")
    dialog = (
      <>
        <Badge tone="green">在线 · 本地Mock数据</Badge>
        <h3>
          {selectedDevice} · {selectedSite}
          {selectedSite === "教学楼A" ? "无线接入点" : "汇聚交换机"}
        </h3>
        <div className="detail-grid">
          {[
            [
              "设备类型",
              selectedSite === "教学楼A" ? "企业级无线AP" : "园区汇聚交换机",
            ],
            ["管理来源", "云端网管 / 地端专业能力"],
            ["在线终端", s.verified ? "38" : "62"],
            ["信道利用率", s.verified ? "48%" : "82%"],
            ["无线重传率", s.verified ? "4.1%" : "18.4%"],
            ["运行年限", "5.3年 · 建议评估支持周期"],
          ].map(([a, b]) => (
            <div key={a}>
              <label>{a}</label>
              <b>{b}</b>
            </div>
          ))}
        </div>
        <Trend improved={s.verified} small />
        <div className="actions">
          <Btn
            onClick={() => {
              close();
              setAssistant(true);
              ask(`分析设备${selectedDevice}的运行风险`);
            }}
          >
            AI辅助分析
          </Btn>
          <Btn
            secondary
            onClick={() => {
              close();
              createTicket();
            }}
          >
            关联服务工单
          </Btn>
        </div>
      </>
    );
  if (modal === "contact")
    dialog = (
      <>
        <div className="partner-identity">
          <div className="partner-avatar">
            <MessageSquare />
          </div>
          <div>
            <h3>陈晓 · 专属服务经理</h3>
            <p>{partnerName}</p>
          </div>
        </div>
        <p className="muted">
          保障时间：7 ×
          24小时主动监测；工作日专属服务支持。演示联系人，不拨打电话或发送真实消息。
        </p>
        <Btn
          onClick={() => {
            close();
            createTicket();
          }}
        >
          发起站内服务请求
        </Btn>
      </>
    );
  if (modal === "opportunity")
    dialog = (
      <>
        <Badge tone="red">经营依据 · 模拟分析</Badge>
        <h3>优先健康评估，再讨论升级</h3>
        <ul className="evidence-list">
          <li>资产：24台AP服役超过5年，建议核验设备支持周期。</li>
          <li>容量：最近一个季度高峰终端数增长32%。</li>
          <li>体验：近90天记录3次同类体验波动。</li>
          <li>业务：新增互动教学场景，需评估未来12个月容量。</li>
        </ul>
        <p className="muted">
          设备年限不是唯一升级依据。需与客户确认业务规划、现网可优化空间、预算与采购意向。
        </p>
        <Btn
          onClick={() => {
            close();
            showReport("客户沟通报告");
          }}
        >
          生成客户沟通报告
        </Btn>
      </>
    );
  if (modal === "lead")
    dialog = (
      <>
        <h3>OP-20261118-01 · 无线网络升级机会</h3>
        <div className="key-value">
          <span>跟进状态</span>
          <Badge tone="blue">{s.lead}</Badge>
        </div>
        <div className="key-value">
          <span>负责人</span>
          <b>陈晓</b>
        </div>
        <p>建议下一步：与信息中心预约专项健康评估，确认容量和业务规划。</p>
        <Btn
          onClick={() => {
            close();
            go("business", "partner");
          }}
        >
          前往经营中心
        </Btn>
      </>
    );
  if (modal === "knowledge")
    dialog = (
      <>
        <Badge>KB-2026-018 · 历史案例</Badge>
        <h3>高密教学场景同频干扰处理实践</h3>
        <p>
          历史某高校在高峰时段出现接入成功率下降，通过信道规划、功率调整与终端负载均衡改善。与本次现象相似，但不能据此确定本次根因。
        </p>
        <ul className="evidence-list">
          <li>先采集高峰基线，排查上联与认证链路。</li>
          <li>在获得维护窗口授权后分批优化。</li>
          <li>复测接入体验，若异常则恢复配置快照。</li>
        </ul>
        <Btn
          secondary
          onClick={() => {
            close();
            go("ecosystem", "partner");
          }}
        >
          查看生态实践
        </Btn>
      </>
    );
  if (modal === "portfolio")
    dialog = (
      <>
        <p>
          平台共管理126家客户、18,560台设备。本页用三家脱敏示例展示客户组合，完整路演流程围绕华东科技大学展开。
        </p>
        <Btn
          onClick={() => {
            close();
            go("unified", "partner");
          }}
        >
          进入华东科技大学保障视图
        </Btn>
      </>
    );
  if (modal === "share")
    dialog = (
      <>
        <p>浏览器未开放剪贴板权限，请手动复制下方脱敏摘要。</p>
        <textarea
          readOnly
          value="iMasterCloud 智能服务平台概念演示：某高校无线体验保障，展示AI诊断、统一服务与生态成长。全部数据为虚构。"
        />
      </>
    );
  if (modal === "reset")
    dialog = (
      <>
        <p>
          将清除本 demo
          的工单、诊断、报告、线索、案例和积分记录，回到演示起点。不会影响其他项目或浏览器数据。
        </p>
        <div className="actions">
          <Btn secondary onClick={close}>
            保留当前进度
          </Btn>
          <Btn
            onClick={() => {
              setS(initialState());
              setProgress(-1);
              setMessages([]);
              setTour(-1);
              setAssistant(false);
              close();
              go("home", "customer");
              notify("演示已重置，可以从客户风险重新开始");
            }}
          >
            确认重置演示数据
          </Btn>
        </div>
      </>
    );
  const titles: Record<string, string> = {
    request: "申请伙伴服务",
    risk: "风险分析与业务影响",
    authorize: "远程配置变更授权",
    assign: "指派工程师",
    note: "更新服务进度",
    report: "服务交付报告",
    product: "标准服务产品",
    caseForm: "分享我的成功案例",
    caseDetail: "生态案例详情",
    fund: "申请专项激励",
    applications: "激励与推广申请记录",
    ledger: "成长积分账本",
    rules: "成长与激励规则",
    device: "关联设备详情",
    contact: "联系服务伙伴",
    opportunity: "经营机会分析依据",
    lead: "经营线索详情",
    knowledge: "历史知识案例",
    portfolio: "客户组合概览",
    share: "分享脱敏摘要",
    reset: "重置演示数据",
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="icon-btn mobile-menu"
          onClick={() => setMobile(!mobile)}
          aria-label="展开导航"
        >
          <Menu size={20} />
        </button>
        <button
          className="brand"
          onClick={() => go(role === "customer" ? "home" : "workbench")}
        >
          <span className="brand-mark">
            <Cloud size={24} />
          </span>
          <strong>iMasterCloud</strong>
          <span className="brand-divider" />
          <span className="brand-label">智能服务平台</span>
        </button>
        <div className="header-actions">
          <Badge>概念原型 · 模拟数据</Badge>
          <button className="header-demo" onClick={() => navigateTour(0)}>
            <Play size={14} />
            开始完整演示
          </button>
          <button
            className="icon-btn"
            aria-label="重置演示数据"
            title="重置演示数据"
            onClick={() => setModal("reset")}
          >
            <RefreshCw size={17} />
          </button>
          <span className="header-divider" />
          <button className="role-switch" onClick={switchRole}>
            <Users size={16} />
            {role === "customer" ? "客户面" : "伙伴面"}
            <span>切换{role === "customer" ? "伙伴面" : "客户面"}</span>
          </button>
          <div className="user-avatar">{role === "customer" ? "李" : "张"}</div>
        </div>
      </header>
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <div className="workspace-label">
          {role === "customer" ? "客户服务空间" : "伙伴工作空间"}
          <span>WORKSPACE</span>
        </div>
        <nav aria-label="主导航">
          {currentNav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {page === id && <i />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-promise">
            <ShieldCheck size={24} />
            <b>{role === "customer" ? "主动保障，始终在线" : "服务创造价值"}</b>
            <p>
              {role === "customer"
                ? "让每一次连接更安心"
                : "智能是能力 · 统一是体验\n平台来运营"}
            </p>
          </div>
          <button onClick={() => navigateTour(0)}>
            <Play size={15} />
            演示引导
            <ArrowUpRight size={14} />
          </button>
          <span className="sidebar-version">
            iMasterCloud NEXT · Concept 1.0
          </span>
        </div>
      </aside>
      <main>
        <div className="breadcrumb">
          <span>{role === "customer" ? customer : "伙伴服务工作空间"}</span>
          <ChevronRight size={13} />
          <b>{pageTitle}</b>
          <span className="demo-date">2026年11月18日 · 演示日</span>
        </div>
        {storageWarning && (
          <div className="storage-warning">
            浏览器本地存储不可用，当前会话仍可演示，但刷新后不会保留进度。
          </div>
        )}
        {tour >= 0 && (
          <div className="tour-bar">
            <div className="tour-number">
              {tour + 1}
              <small>/ 8</small>
            </div>
            <div className="tour-copy">
              <b>{steps[tour].title}</b>
              <span>{steps[tour].description}</span>
            </div>
            <div className="tour-actions">
              <button
                className="text-btn"
                disabled={tour === 0}
                onClick={() => navigateTour(tour - 1)}
              >
                上一步
              </button>
              <Btn
                small
                onClick={() =>
                  tour === 7
                    ? (setTour(-1), notify("演示结束，当前业务状态已保留"))
                    : navigateTour(tour + 1)
                }
              >
                {tour === 7 ? "结束引导" : "下一环节"}
                <ArrowRight size={14} />
              </Btn>
              <button
                className="icon-btn"
                aria-label="退出演示引导"
                onClick={() => setTour(-1)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        <div className="page-content">{content}</div>
        <footer>
          <span>
            智能是能力 <i /> 统一是体验 <i /> 平台来运营
          </span>
          <span>概念演示 · 无真实设备连接与商业交易</span>
        </footer>
      </main>
      <button
        className="floating-aico"
        onClick={() => setAssistant(!assistant)}
        aria-label="打开Aico助手"
      >
        <Sparkles size={20} />
        <span>Aico</span>
      </button>
      {assistant && (
        <div className="assistant-drawer">
          <div className="modal-head">
            <div>
              <h2>Aico 智能助手</h2>
              <p>
                当前上下文：{pageTitle}
                {page === "unified" || page === "assurance"
                  ? ` / ${selectedSite} / ${selectedDevice}`
                  : ""}
              </p>
            </div>
            <button
              className="icon-btn"
              aria-label="关闭智能助手"
              onClick={() => setAssistant(false)}
            >
              <X size={19} />
            </button>
          </div>
          {chatPanel()}
        </div>
      )}
      {modal && (
        <Modal
          title={titles[modal] || "演示详情"}
          onClose={close}
          wide={["report", "caseForm", "risk"].includes(modal)}
        >
          {dialog}
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button aria-label="关闭提示" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
