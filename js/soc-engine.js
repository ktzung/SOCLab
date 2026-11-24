/* SOCLab — engine mô phỏng tải ca trực, phơi nhiễm IOC và điểm nghiêm trọng */
(function () {
  "use strict";

  const SEED = window.SOC_SEED;
  if (!SEED) return;

  const fmt = new Intl.NumberFormat("vi-VN");

  function clampInt(value, min, max, fallback) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function clampNum(value, min, max, fallback) {
    const n = parseFloat(value);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function round1(n) {
    return Math.round(n * 10) / 10;
  }

  function runTriage(input) {
    const box = input || {};
    const alerts = clampInt(box.alerts, 10, 200, 120);
    const falseRate = clampInt(box.falseRate, 5, 50, 25);
    const critical = clampInt(box.critical, 0, 20, 5);
    const trueAlerts = Math.round(alerts * (1 - falseRate / 100));
    const hours = round1((trueAlerts * 15) / 60);
    const ok = critical <= trueAlerts && hours <= 8;
    const overload = Math.max(0, round1(hours - 8));
    const trace = [
      {
        step: "alerts",
        label: "Cảnh báo vào ca",
        result: "ok",
        note: `${alerts} cảnh báo · ${falseRate}% báo nhầm`
      },
      {
        step: "true",
        label: "Cảnh báo thật",
        result: "ok",
        note: `${trueAlerts} cảnh báo cần xử lý`
      },
      {
        step: "load",
        label: "Tải ca trực",
        result: ok ? "ok" : "warn",
        note: `${hours} giờ cho ca 8 giờ`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: ok ? "ok" : "fail",
        note: ok ? "ca trực kham được" : `quá tải ${overload} giờ hoặc thiếu người`
      }
    ];
    return {
      ok,
      verdict: ok ? "Kham được" : "Quá tải",
      meta: `${trueAlerts} cảnh báo thật · ${hours} giờ`,
      statusText: `${trueAlerts} cảnh báo thật, ${hours} giờ xử lý`,
      tags: ["Triage", `${hours} giờ`],
      trace,
      payload: {
        "cảnh báo": alerts,
        "báo nhầm": `${falseRate}%`,
        "cảnh báo thật": trueAlerts,
        "tải": `${hours} giờ`
      },
      metrics: [
        { label: "Cảnh báo", value: alerts },
        { label: "Thật", value: trueAlerts },
        { label: "Tải", value: `${hours} giờ` },
        { label: "Kết luận", value: ok ? "kham được" : "quá tải" }
      ],
      values: { alerts, falseRate, critical, trueAlerts, hours, ok: ok ? 1 : 0 }
    };
  }

  function runIoc(input) {
    const box = input || {};
    const logs = clampInt(box.logs, 1000, 100000, 50000);
    const suspectPct = clampInt(box.suspectPct, 1, 20, 2);
    const blockPct = clampInt(box.blockPct, 0, 100, 90);
    const hits = Math.round((logs * suspectPct) / 100);
    const blocked = Math.round((hits * blockPct) / 100);
    const exposure = hits - blocked;
    const ok = exposure <= 5;
    const trace = [
      {
        step: "logs",
        label: "Log trong cửa sổ",
        result: "ok",
        note: `${fmt.format(logs)} bản ghi · ${suspectPct}% đáng ngờ`
      },
      {
        step: "hits",
        label: "Lượt khớp IOC",
        result: "ok",
        note: `${hits} lượt`
      },
      {
        step: "blocked",
        label: "Đã chặn",
        result: "ok",
        note: `${blocked} lượt · ${blockPct}%`
      },
      {
        step: "verdict",
        label: "Còn phơi nhiễm",
        result: ok ? "ok" : "fail",
        note: `${exposure} lượt · ngưỡng 5`
      }
    ];
    return {
      ok,
      verdict: ok ? "Sạch" : "Còn hở",
      meta: `${exposure} lượt hở`,
      statusText: ok ? `còn ${exposure} lượt, trong ngưỡng` : `còn ${exposure} lượt chưa chặn`,
      tags: ["IOC", `${exposure} hở`],
      trace,
      payload: {
        log: fmt.format(logs),
        "khớp IOC": hits,
        "đã chặn": blocked,
        "phơi nhiễm": exposure
      },
      metrics: [
        { label: "Log", value: fmt.format(logs) },
        { label: "Khớp", value: hits },
        { label: "Đã chặn", value: blocked },
        { label: "Còn hở", value: exposure }
      ],
      values: { logs, suspectPct, blockPct, hits, blocked, exposure, ok: ok ? 1 : 0 }
    };
  }

  function runSeverity(input) {
    const box = input || {};
    const cvss = clampNum(box.cvss, 1, 10, 7.5);
    const exposure = box.exposure === "internal" ? "internal" : "internet";
    const sensitive = String(box.sensitive) === "1" ? 1 : 0;
    const base = Math.round(cvss * 10);
    const exposurePts = exposure === "internet" ? 20 : 0;
    const dataPts = sensitive ? 15 : 0;
    const raw = base + exposurePts + dataPts;
    const score = Math.min(100, raw);
    const ok = score >= 70;
    const trace = [
      {
        step: "cvss",
        label: "Điểm CVSS",
        result: "ok",
        note: `${round1(cvss)} × 10 = ${base}`
      },
      {
        step: "context",
        label: "Ngữ cảnh",
        result: "ok",
        note: `${exposure === "internet" ? "hở Internet +20" : "nội bộ +0"} · dữ liệu nhạy cảm ${sensitive ? "+15" : "+0"}`
      },
      {
        step: "score",
        label: "Tổng điểm",
        result: ok ? "ok" : "warn",
        note: `${raw} điểm, chặn trần còn ${score}`
      },
      {
        step: "verdict",
        label: "Kết luận",
        result: ok ? "ok" : "fail",
        note: ok ? "ưu tiên cao" : "ưu tiên thường"
      }
    ];
    return {
      ok,
      verdict: ok ? "Ưu tiên cao" : "Thường",
      meta: `${score} điểm`,
      statusText: `${score}/100 · ${ok ? "ưu tiên cao" : "ưu tiên thường"}`,
      tags: ["CVSS", `${score} điểm`],
      trace,
      payload: {
        CVSS: round1(cvss),
        "vị trí": exposure === "internet" ? "Internet" : "nội bộ",
        "nhạy cảm": sensitive ? "có" : "không",
        "điểm": score
      },
      metrics: [
        { label: "CVSS", value: round1(cvss) },
        { label: "Gốc", value: base },
        { label: "Điểm", value: score },
        { label: "Kết luận", value: ok ? "cao" : "thường" }
      ],
      values: { cvss, exposure, sensitive, base, score, ok: ok ? 1 : 0 }
    };
  }

  function run(kind, values) {
    if (kind === "triage") return runTriage(values);
    if (kind === "ioc") return runIoc(values);
    if (kind === "severity") return runSeverity(values);
    throw new Error("Không rõ lát cắt: " + kind);
  }

  window.SOC_ENGINE = { run, formatNumber: (n) => fmt.format(n), round1, clampInt };
})();
