/* SOCLab — dữ liệu mô phỏng phân loại cảnh báo, IOC và điểm nghiêm trọng */
window.SOC_SEED = {
  lab: {
    heading: "Ba bước trực ca",
    intro: "Ước lượng khối lượng cảnh báo thật trong một ca, đo số máy còn phơi nhiễm sau khi chặn IOC và tính điểm nghiêm trọng theo CVSS cùng ngữ cảnh. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "triage",
        label: "Phân loại",
        title: "Ca trực",
        badge: "alert",
        runLabel: "Tính tải ca trực",
        hint: "Cảnh báo thật = tổng cảnh báo × (1 − tỉ lệ báo nhầm). Mỗi cảnh báo thật tốn 15 phút xử lý; một ca 8 giờ chỉ chứa được 32 cảnh báo thật.",
        fields: [
          { id: "alerts", label: "Cảnh báo trong ca", type: "number", min: 10, max: 200, step: 10, value: 120 },
          { id: "falseRate", label: "Tỉ lệ báo nhầm (%)", type: "number", min: 5, max: 50, step: 5, value: 25 },
          { id: "critical", label: "Cảnh báo nghiêm trọng", type: "number", min: 0, max: 20, step: 1, value: 5 }
        ]
      },
      {
        id: "ioc",
        label: "Dấu vết",
        title: "Chặn IOC",
        badge: "exposure",
        runLabel: "Đo phơi nhiễm",
        hint: "Lượt khớp = bản ghi × tỉ lệ đáng ngờ; đã chặn = lượt khớp × tỉ lệ chặn. Còn quá 5 lượt chưa chặn là còn phơi nhiễm, phải xử lý tiếp.",
        fields: [
          { id: "logs", label: "Bản ghi log", type: "number", min: 1000, max: 100000, step: 1000, value: 50000 },
          { id: "suspectPct", label: "Đáng ngờ (%)", type: "number", min: 1, max: 20, step: 1, value: 2 },
          { id: "blockPct", label: "Đã chặn (%)", type: "number", min: 0, max: 100, step: 5, value: 90 }
        ]
      },
      {
        id: "severity",
        label: "Nghiêm trọng",
        title: "Chấm sự cố",
        badge: "CVSS",
        runLabel: "Chấm điểm",
        hint: "Điểm = CVSS × 10, cộng 20 nếu máy hở Internet, cộng 15 nếu chạm dữ liệu nhạy cảm; tối đa 100. Từ 70 trở lên là ưu tiên cao.",
        fields: [
          { id: "cvss", label: "Điểm CVSS", type: "number", min: 1, max: 10, step: 0.1, value: 7.5 },
          {
            id: "exposure",
            label: "Vị trí",
            type: "select",
            value: "internet",
            options: [
              { value: "internet", label: "Hở Internet" },
              { value: "internal", label: "Chỉ nội bộ" }
            ]
          },
          {
            id: "sensitive",
            label: "Dữ liệu nhạy cảm",
            type: "select",
            value: "1",
            options: [
              { value: "1", label: "Có" },
              { value: "0", label: "Không" }
            ]
          }
        ]
      }
    ],
    defaults: {
      triage: { alerts: 120, falseRate: 25, critical: 5 },
      ioc: { logs: 50000, suspectPct: 2, blockPct: 90 },
      severity: { cvss: 7.5, exposure: "internet", sensitive: "1" }
    },
    presets: {
      triage: [
        { id: "soc-triage-base", label: "120 cảnh báo, 25% nhầm", dataset: { alerts: 120, falseRate: 25, critical: 5 } },
        { id: "soc-triage-calm", label: "40 cảnh báo, ca nhẹ", dataset: { alerts: 40, falseRate: 25, critical: 10 } },
        { id: "soc-triage-storm", label: "200 cảnh báo, 40% nhầm", dataset: { alerts: 200, falseRate: 40, critical: 12 } }
      ],
      ioc: [
        { id: "soc-ioc-base", label: "50.000 log, chặn 90%", dataset: { logs: 50000, suspectPct: 2, blockPct: 90 } },
        { id: "soc-ioc-clean", label: "10.000 log, chặn 99%", dataset: { logs: 10000, suspectPct: 1, blockPct: 99 } },
        { id: "soc-ioc-leak", label: "80.000 log, chặn 50%", dataset: { logs: 80000, suspectPct: 5, blockPct: 50 } }
      ],
      severity: [
        { id: "soc-sev-base", label: "CVSS 7,5 hở Internet", dataset: { cvss: 7.5, exposure: "internet", sensitive: "1" } },
        { id: "soc-sev-low", label: "CVSS 4,0 nội bộ", dataset: { cvss: 4, exposure: "internal", sensitive: "0" } },
        { id: "soc-sev-high", label: "CVSS 9,8 hở Internet", dataset: { cvss: 9.8, exposure: "internet", sensitive: "1" } }
      ]
    },
    examples: [
      { id: "ex-triage", kind: "triage", label: "Ca 200 cảnh báo có quá tải?", dataset: { alerts: 200, falseRate: 40, critical: 12 } },
      { id: "ex-ioc", kind: "ioc", label: "Chặn một nửa IOC thì sao?", dataset: { logs: 80000, suspectPct: 5, blockPct: 50 } },
      { id: "ex-sev", kind: "severity", label: "CVSS 9,8 hở Internet", dataset: { cvss: 9.8, exposure: "internet", sensitive: "1" } }
    ],
    missions: [
      {
        id: "m-triage-true",
        kind: "triage",
        title: "Đếm cảnh báo thật",
        prompt: "Ca có 120 cảnh báo, trong đó 25% là báo nhầm. Ghi lại số cảnh báo thật phải xử lý.",
        metric: "trueAlerts",
        expect: 90,
        hint: "120 × 0,75 = 90 cảnh báo thật.",
        dataset: { alerts: 120, falseRate: 25, critical: 5 }
      },
      {
        id: "m-triage-ok",
        kind: "triage",
        title: "Ca có kham được không?",
        prompt: "Ca 40 cảnh báo, 25% báo nhầm, 10 cảnh báo nghiêm trọng. Engine phải kết luận ca trực kham được.",
        metric: "ok",
        expect: 1,
        hint: "Còn 30 cảnh báo thật, tốn 7,5 giờ; 10 cảnh báo nghiêm trọng vẫn nằm trong 30.",
        dataset: { alerts: 40, falseRate: 25, critical: 10 }
      },
      {
        id: "m-ioc-exposure",
        kind: "ioc",
        title: "Còn bao nhiêu máy hở?",
        prompt: "50.000 bản ghi log, 2% khớp IOC và đã chặn 90% số lượt khớp. Ghi lại số lượt còn chưa chặn.",
        metric: "exposure",
        expect: 100,
        hint: "1.000 lượt khớp, chặn 900, còn 100 lượt phơi nhiễm.",
        dataset: { logs: 50000, suspectPct: 2, blockPct: 90 }
      },
      {
        id: "m-ioc-ok",
        kind: "ioc",
        title: "Đã sạch chưa?",
        prompt: "10.000 bản ghi, 1% khớp IOC, chặn 99%. Engine phải kết luận phơi nhiễm trong mức chấp nhận.",
        metric: "ok",
        expect: 1,
        hint: "100 lượt khớp, chặn 99, còn 1 lượt; ngưỡng chấp nhận là 5.",
        dataset: { logs: 10000, suspectPct: 1, blockPct: 99 }
      },
      {
        id: "m-sev-score",
        kind: "severity",
        title: "Sự cố chạm dữ liệu",
        prompt: "CVSS 7,5, máy hở Internet, có dữ liệu nhạy cảm. Ghi lại điểm nghiêm trọng sau khi chặn trần 100.",
        metric: "score",
        expect: 100,
        hint: "75 + 20 + 15 = 110, chặn trần còn 100.",
        dataset: { cvss: 7.5, exposure: "internet", sensitive: "1" }
      },
      {
        id: "m-sev-ok",
        kind: "severity",
        title: "Máy nội bộ chạm dữ liệu",
        prompt: "CVSS 6,0, chỉ nội bộ, có dữ liệu nhạy cảm. Engine phải kết luận ưu tiên cao.",
        metric: "ok",
        expect: 1,
        hint: "60 + 0 + 15 = 75, vượt ngưỡng 70 nên vẫn ưu tiên cao.",
        dataset: { cvss: 6, exposure: "internal", sensitive: "1" }
      }
    ]
  }
};

window.SOC_SEED.home = {
  "title": "SOCLab — Trực SOC, nhìn thấy từng ca",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một cảnh báo.<br><span class=\"hl\">Thấy</span> cả ca trực.",
  "sub": "Đi từ hàng đợi cảnh báo, phân loại và ưu tiên đến dấu vết tấn công, dựng dòng thời gian và viết báo cáo sự cố. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng đo tải ca trực, phơi nhiễm IOC và điểm nghiêm trọng ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Tải ca trực, phơi nhiễm và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một ca trực",
  "modesSub": "Không chỉ đọc quy trình. Bạn xem cảnh báo đi qua từng bước, tự chấm một ca cụ thể và sửa hiểu nhầm ngay.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng cảnh báo, dấu vết và bước xử lý hiện ra theo trình tự, kèm một ca cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: báo nhầm, IOC sót, dòng thời gian lệch và báo cáo thiếu bằng chứng.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Tính tải ca trực, đo lượt phơi nhiễm sau khi chặn IOC và chấm điểm nghiêm trọng, kèm 6 nhiệm vụ.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng phân loại cảnh báo, mẫu IOC, lệnh điều tra log và checklist báo cáo — tra nhanh khi trực.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ hàng đợi cảnh báo đến báo cáo sự cố: mỗi module trả lời một câu hỏi lớn của ca trực.",
  "faq": [
    {
      "q": "Đây có phải công cụ SOC thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: ước lượng số cảnh báo thật, lượt khớp IOC và điểm nghiêm trọng. Đủ để thấy vì sao từng bước tồn tại — không thay thế SIEM, EDR hay một ca trực thật."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: 120 cảnh báo, 25% báo nhầm, 50.000 dòng log. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được, không phụ thuộc dữ liệu ngẫu nhiên."
    },
    {
      "q": "Có cần biết Linux trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ và ví dụ; lệnh grep, jq xuất hiện ở cheatsheet để tra khi cần. Người đã quen log sẽ đi nhanh hơn ở phần điều tra."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "S",
  "brand": "SOCLab",
  "hero": {
    "bar": "soc://shift",
    "title": "phân loại · điều tra · dựng dòng thời gian · báo cáo",
    "aria": "Cảnh báo đi qua phân loại, điều tra, dựng dòng thời gian và báo cáo",
    "states": [
      {
        "label": "Alert"
      },
      {
        "label": "Triage"
      },
      {
        "label": "Trace"
      },
      {
        "label": "Report"
      }
    ],
    "final": "Đóng",
    "queueSmall": "Ca trực",
    "queueChip": "Ưu tiên cao",
    "queueVerdict": "2 sự cố",
    "frames": [
      {
        "small": "Báo nhầm lọc",
        "b": "25%",
        "cls": "hit"
      },
      {
        "small": "IOC còn hở",
        "b": "100",
        "cls": "miss"
      },
      {
        "small": "Điểm sự cố",
        "b": "100"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một ca trực.<br>Ba câu hỏi.",
    "p": "Ước lượng số cảnh báo thật và tải giờ của ca, đo số lượt còn phơi nhiễm sau khi chặn IOC, rồi chấm điểm nghiêm trọng từ CVSS và ngữ cảnh. Sáu nhiệm vụ chấm điểm ngay trên kết quả, kèm gợi ý sửa từng cấu hình yếu.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "alert",
        "label": "Cảnh báo",
        "sub": "hàng đợi",
        "hot": true
      },
      {
        "icon": "grid",
        "label": "Phân loại",
        "sub": "thật/giả"
      },
      {
        "icon": "file",
        "label": "IOC",
        "sub": "dấu vết"
      },
      {
        "icon": "clock",
        "label": "Dòng thời gian",
        "sub": "sự kiện",
        "hot": true
      },
      {
        "icon": "shield",
        "label": "Chặn",
        "sub": "containment"
      },
      {
        "icon": "audit",
        "label": "Báo cáo",
        "sub": "bằng chứng"
      },
      {
        "icon": "check",
        "label": "Đóng ca",
        "sub": "bàn giao"
      }
    ]
  }
};
window.SOCLAB = window.SOCLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
window.SOCLAB.home = window.SOC_SEED.home;

(function () {
  const D = window.SOCLAB;
  if (!D) return;
  Object.values(D.lessons || {}).forEach((lesson) => {
    (lesson.steps || []).forEach((step) => {
      if (Array.isArray(step.metrics)) {
        const keyed = {};
        step.metrics.forEach((m) => { if (m && m.key != null) keyed[m.key] = m.value; });
        step.metrics = keyed;
      }
      if (Array.isArray(step.changes)) {
        step.changes = step.changes.map((c) => {
          if (!c || typeof c !== "object") return String(c);
          if (c.before && c.after) return c.label + ": " + c.before + " thành " + c.after;
          return String(c.label || c.after || "");
        });
      }
    });
  });
})();
