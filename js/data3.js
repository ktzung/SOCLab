/* SOCLab - dữ liệu phần 3: module Phân tích và báo cáo */
window.SOCLAB = window.SOCLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const DB = window.SOCLAB;

  DB.modules.push({
    id: "phan-tich-bao-cao",
    num: "03",
    tone: "yellow",
    title: "Phân tích và báo cáo",
    blurb: "Bốn bài cuối khép vòng trực ca: chấm điểm CVSS kèm ngữ cảnh, truy tìm máy nguồn từ log, viết báo cáo sự cố cho người ngoài ca và tổ chức diễn tập để cải tiến. Mỗi bài có sơ đồ, năm bước phân tích, bài luyện và cheatsheet để tra khi đang trực.",
    lessons: ["cvss", "truy-tim", "bao-cao", "dien-tap"]
  });

  /* ---------------------------------------------------------------- */
  DB.lessons["cvss"] = {
    id: "cvss",
    module: "phan-tich-bao-cao",
    title: "Chấm điểm CVSS và ngữ cảnh",
    shortTitle: "CVSS",
    subtitle: "Vì sao 7,5 chỉ thành 75 còn một ca khác lại chạm 100",
    blurb: "Điểm CVSS nói mức nặng lỗ hổng, còn vị trí máy và dữ liệu quyết định thứ tự xử lý. Bài đi qua ba phép cộng: 75 điểm gốc, hở Internet thành 95, dữ liệu thành 110, chặn trần 100; ngưỡng 70 đổi quyết định.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["CVSS", "điểm gốc", "ngữ cảnh", "ngưỡng 70", "ưu tiên"],
    metrics: [
      { key: "base", label: "Điểm gốc", tone: "blue" },
      { key: "context", label: "Ngữ cảnh", tone: "mint" },
      { key: "score", label: "Điểm tổng", tone: "yellow" },
      { key: "verdict", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "alert", type: "alert", x: 55, y: 80, w: 200, h: 70, label: "Cảnh báo lỗ hổng", sub: "máy chủ web, 7,5" },
      { id: "base", type: "task", x: 340, y: 80, w: 200, h: 70, label: "Điểm gốc CVSS", sub: "7,5 × 10 = 75" },
      { id: "exposure", type: "server", x: 625, y: 80, w: 200, h: 70, label: "Vị trí máy chủ", sub: "hở Internet +20" },
      { id: "data", type: "disk", x: 340, y: 195, w: 200, h: 70, label: "Dữ liệu nhạy cảm", sub: "hồ sơ khách +15" },
      { id: "cap", type: "shield", x: 55, y: 310, w: 200, h: 70, label: "Chặn trần 100", sub: "110 thành 100" },
      { id: "total", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Điểm tổng", sub: "ưu tiên cao từ 70" },
      { id: "ticket", type: "page", x: 625, y: 310, w: 200, h: 70, label: "Phiếu xử lý", sub: "vá trong 24 giờ" }
    ],
    edges: [
      { id: "alert-base", from: "alert", to: "base", kind: "request", label: "điểm 7,5" },
      { id: "alert-data", from: "alert", to: "data", kind: "request", label: "phạm vi dữ liệu" },
      { id: "base-exposure", from: "base", to: "exposure", kind: "data", label: "xét vị trí" },
      { id: "exposure-data", from: "exposure", to: "data", kind: "data", label: "đã cộng 20" },
      { id: "data-cap", from: "data", to: "cap", kind: "data", label: "cộng 15 điểm" },
      { id: "cap-total", from: "cap", to: "total", kind: "control", label: "chặn trần" },
      { id: "total-ticket", from: "total", to: "ticket", kind: "response", label: "ưu tiên cao" }
    ],
    learn: [
      "Điểm gốc CVSS 7,5 nhân 10 thành <strong>75 điểm</strong> trước khi tính ngữ cảnh.",
      "Máy hở Internet cộng thêm <code>20</code> điểm, chạm dữ liệu nhạy cảm cộng <code>15</code> điểm.",
      "Tổng vượt 100 bị chặn ở trần, nên 110 và 100 cho cùng một kết luận.",
      "Ngưỡng <strong>70</strong> chia hai mức ưu tiên, không phải điểm CVSS gốc chia."
    ],
    steps: [
      {
        short: "Điểm gốc",
        type: "concept",
        title: "CVSS 7,5 chưa phải quyết định",
        body: "Một cảnh báo quét lỗ hổng trả về điểm CVSS 7,5 trên máy chủ web. Engine nhân điểm này với 10 để đổi sang thang 100, thu được <code>75</code> điểm gốc. Con số 75 đã vượt ngưỡng 70, nhưng đó chỉ là kết quả tạm: nó chưa biết máy nằm ở đâu và trên máy có gì. Trong thực tế, hai máy cùng lỗ hổng có thể nhận hai mức ưu tiên khác nhau vì một máy hở Internet còn máy kia chỉ trong mạng nội bộ. Vì vậy bước đầu tiên luôn là ghi lại điểm gốc, phiên bản phần mềm và mã tài sản, rồi mới bổ sung ngữ cảnh ở các bước sau. Ghi sai điểm gốc sẽ kéo mọi phép cộng phía sau lệch theo.",
        focus: ["alert", "base"],
        edges: ["alert-base"],
        metrics: { base: "7,5", context: "chưa xét", score: "75", verdict: "chờ ngữ cảnh" },
        changes: ["Ghi nhận điểm CVSS 7,5", "Đổi sang thang 100 được 75 điểm"],
        note: "Điểm gốc luôn tính trước, ngữ cảnh bổ sung sau, không trộn hai bước."
      },
      {
        short: "Vị trí",
        type: "flow",
        title: "Hở Internet cộng 20 điểm",
        body: "Bước thứ hai xét vị trí. Máy chủ web nhận lưu lượng từ ngoài nên được cộng 20 điểm, đưa tổng từ 75 lên <code>95</code>. Nếu cùng lỗ hổng đó nằm trên máy chỉ truy cập trong mạng nội bộ, mức cộng là 0 và tổng giữ nguyên 75. Cách cộng này phản ánh số người có thể chạm tới lỗ hổng: một cổng mở ra Internet có hàng nghìn người thử, còn máy nội bộ chỉ vài đồng nghiệp. Tuy nhiên, hở Internet không có nghĩa là chắc chắn bị khai thác; nó chỉ nâng xác suất. Đội trực ca nên kiểm tra lại bản ghi tường lửa để xác nhận cổng thật sự mở, thay vì tin vào nhãn tài sản cũ.",
        focus: ["base", "exposure", "data"],
        edges: ["base-exposure", "alert-data"],
        metrics: { base: "7,5", context: "Internet +20", score: "95", verdict: "ưu tiên cao" },
        changes: ["Xác nhận cổng 443 mở ra Internet", "Điểm tổng tăng từ 75 lên 95"],
        note: "Nhãn tài sản có thể lỗi thời, hãy đối chiếu tường lửa trước khi cộng 20."
      },
      {
        short: "Dữ liệu",
        type: "detail",
        title: "Dữ liệu nhạy cảm đẩy qua trần",
        body: "Máy chủ web giữ hồ sơ khách hàng gồm số điện thoại và địa chỉ, nên được cộng tiếp 15 điểm. Tổng thô là <code>75 + 20 + 15 = 110</code>, vượt thang 100, và engine chặn ở trần 100. Điểm cuối cùng là <code>100/100</code>, vẫn là ưu tiên cao nhưng không còn phân biệt được với một ca nặng hơn. Vì vậy khi đọc báo cáo, cần giữ cả ba thành phần: điểm gốc, phần cộng vị trí và phần cộng dữ liệu. Nếu chỉ ghi 100, người đọc không biết ca này sát trần vì dữ liệu hay vì vị trí. Cách trình bày tốt là ghi rõ 110 trước khi cắt, kèm lý do dữ liệu, để lần sau vẫn đối chiếu được.",
        focus: ["data", "cap", "total"],
        edges: ["exposure-data", "data-cap", "cap-total"],
        metrics: { base: "7,5", context: "Internet, dữ liệu", score: "100", verdict: "chặn trần" },
        changes: ["Cộng 15 điểm cho dữ liệu khách hàng", "Tổng thô 110 bị chặn còn 100"],
        note: "Ghi cả 110 và 100, vì trần che mất mức độ thật của sự cố."
      },
      {
        short: "Ba tổ hợp",
        type: "pitfall",
        title: "Ngưỡng 70 mới là thứ quyết định",
        body: "Ba tổ hợp cho thấy ngữ cảnh đổi kết luận thế nào. Ca 7,5 hở Internet có dữ liệu ra 110, chặn còn <code>100</code>. Ca 6,0 trên máy nội bộ có dữ liệu ra <code>60 + 0 + 15 = 75</code>, vẫn ưu tiên cao. Ca 4,0 nội bộ không có dữ liệu chỉ ra <code>40</code>, xếp ưu tiên thường. Ngưỡng 70 nằm giữa 75 và 40, nên chỉ cần một yếu tố ngữ cảnh là đủ đổi nhóm xử lý. Cái bẫy là chấm điểm một lần rồi để nguyên nhiều tháng: máy chuyển từ nội bộ ra Internet, hoặc dữ liệu mới được chép lên, đều làm điểm cũ sai. Hãy chấm lại mỗi khi tài sản đổi vị trí hoặc đổi loại dữ liệu.",
        focus: ["base", "exposure", "data", "total", "ticket"],
        edges: ["base-exposure", "data-cap", "total-ticket"],
        metrics: { base: "4,0 đến 7,5", context: "3 tổ hợp", score: "40 đến 100", verdict: "theo ngưỡng 70" },
        changes: ["Ca 6,0 nội bộ có dữ liệu đạt 75", "Ca 4,0 nội bộ không dữ liệu chỉ 40"],
        note: "Một yếu tố ngữ cảnh đủ đổi nhóm, nên đừng bỏ qua bước xác nhận."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Một thang điểm, ba lớp ngữ cảnh",
        body: "Tổng kết: điểm CVSS 7,5 nhân 10 thành 75, hở Internet cộng 20, dữ liệu nhạy cảm cộng 15, tổng thô 110 bị chặn còn <code>100</code>. Ngưỡng <code>70</code> biến con số thành quyết định: 100 và 75 đều là ưu tiên cao, còn 40 là ưu tiên thường. Bài học không nằm ở ba phép cộng mà ở thứ tự làm việc: chấm gốc trước, kiểm tra vị trí thật, xác nhận dữ liệu thật, rồi mới chốt phiếu xử lý. Khi trình bày, hãy ghi cả phần thô lẫn phần đã cắt trần để người đọc thấy mức độ. Bước tiếp theo là truy tìm nguồn gốc, nơi chính các con số này quyết định cách ly máy nào trước và máy nào chờ.",
        focus: "all",
        edges: "all",
        metrics: { base: "7,5", context: "đủ ba lớp", score: "100", verdict: "ưu tiên cao" },
        changes: ["Chốt được mức 100 cho ca đang xét", "Sẵn sàng mở phiếu xử lý"],
        note: "Điểm chỉ có nghĩa khi đi kèm lý do và thời hạn xử lý."
      }
    ]
  };

  /* ---------------------------------------------------------------- */
  DB.lessons["truy-tim"] = {
    id: "truy-tim",
    module: "phan-tich-bao-cao",
    title: "Truy tìm nguồn gốc sự cố",
    shortTitle: "Truy tìm",
    subtitle: "Từ 50.000 bản ghi log về chiếc máy kế toán đang gọi ra ngoài",
    blurb: "Một cảnh báo EDR không nói máy nào đã mở đường. Bài lần theo log tập trung, đối chiếu IOC, xác định máy nguồn và đo phần còn phơi nhiễm sau khi chặn, theo cách engine tính 1.000 lượt khớp và 100 lượt còn hở.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["log", "IOC", "truy vết", "phơi nhiễm", "cách ly"],
    metrics: [
      { key: "logs", label: "Bản ghi", tone: "blue" },
      { key: "ioc", label: "IOC khớp", tone: "mint" },
      { key: "blocked", label: "Đã chặn", tone: "yellow" },
      { key: "exposure", label: "Còn hở", tone: "coral" }
    ],
    nodes: [
      { id: "alert", type: "alert", x: 55, y: 80, w: 200, h: 70, label: "Cảnh báo EDR", sub: "PC kế toán nhiễm" },
      { id: "log", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Kho log tập trung", sub: "50.000 bản ghi" },
      { id: "ioc", type: "check", x: 625, y: 80, w: 200, h: 70, label: "Đối chiếu IOC", sub: "1.000 lượt khớp" },
      { id: "host", type: "server", x: 340, y: 195, w: 200, h: 70, label: "Máy nguồn", sub: "PC-KETOAN-07" },
      { id: "block", type: "shield", x: 55, y: 310, w: 200, h: 70, label: "Chặn tên miền", sub: "900 lượt, 90%" },
      { id: "expose", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Còn hở 100 lượt", sub: "ngưỡng cho phép 5" },
      { id: "ticket", type: "task", x: 625, y: 310, w: 200, h: 70, label: "Mở sự cố", sub: "cách ly máy" }
    ],
    edges: [
      { id: "alert-log", from: "alert", to: "log", kind: "request", label: "đẩy log" },
      { id: "log-ioc", from: "log", to: "ioc", kind: "data", label: "đối chiếu IOC" },
      { id: "ioc-host", from: "ioc", to: "host", kind: "data", label: "lần theo IP" },
      { id: "ioc-block", from: "ioc", to: "block", kind: "control", label: "chặn tên miền" },
      { id: "block-expose", from: "block", to: "expose", kind: "data", label: "còn 100 lượt" },
      { id: "host-expose", from: "host", to: "expose", kind: "control", label: "vẫn gọi ra" },
      { id: "expose-ticket", from: "expose", to: "ticket", kind: "request", label: "cách ly máy" }
    ],
    learn: [
      "Log tập trung cho phép đối chiếu <strong>50.000 bản ghi</strong> trong một cửa sổ thay vì mở từng máy.",
      "Tỉ lệ đáng ngờ 2% tạo ra <code>1.000</code> lượt khớp IOC cần xác minh.",
      "Chặn 90% vẫn để <code>100</code> lượt gọi ra, gấp 20 lần ngưỡng 5.",
      "Chỉ cách ly máy nguồn mới cắt được chuỗi, chặn tên miền chỉ xử lý phần đã biết."
    ],
    steps: [
      {
        short: "Cảnh báo",
        type: "concept",
        title: "Một cảnh báo, nhiều lớp log",
        body: "Lúc 9 giờ 12, EDR báo máy kế toán chạy một lệnh soạn thảo tài liệu bất thường. Cảnh báo chỉ có tên máy, tên tài khoản và một mã tiến trình, chưa đủ để kết luận. Đội trực ca kéo log của 24 giờ gần nhất từ kho tập trung, thu được <code>50.000</code> bản ghi gồm đăng nhập, DNS, tường lửa và tiến trình. Với tỉ lệ đáng ngờ 2%, khoảng <code>1.000</code> bản ghi cần soi kỹ. Điểm quan trọng là không mở từng máy để đọc log rời, vì cách đó vừa chậm vừa bỏ sót máy không bật ghi nhận. Kho tập trung giữ mọi thứ trong cùng một múi giờ, nên các mốc sự kiện ghép được với nhau trước khi đụng tới máy thật.",
        focus: ["alert", "log"],
        edges: ["alert-log"],
        metrics: { logs: "50.000", ioc: "chưa khớp", blocked: "0", exposure: "chưa rõ" },
        changes: ["Kéo được 50.000 bản ghi trong 24 giờ", "Khoanh ra 1.000 bản ghi đáng ngờ"],
        note: "Luôn chốt cửa sổ thời gian và múi giờ trước khi đối chiếu."
      },
      {
        short: "Đối chiếu",
        type: "flow",
        title: "1.000 lượt khớp IOC",
        body: "Danh sách IOC hiện có gồm ba tên miền và hai địa chỉ IP vừa được chia sẻ trong nhóm tình báo. Đối chiếu với 50.000 bản ghi cho ra <code>1.000</code> lượt khớp, tập trung ở ba máy. Mỗi máy gọi tên miền lạ khoảng 5 phút một lần, đều đặn như đồng hồ, dấu hiệu của beacon chờ lệnh. Tần suất đều đặn quan trọng hơn số lượng: 1.000 lượt rải ngẫu nhiên có thể là quảng cáo, còn 1.000 lượt đúng nhịp 5 phút thì gần như chắc chắn là mã độc. Bước này chưa chặn gì, chỉ khoanh vùng. Việc khoanh vùng sai sẽ khiến bước sau chặn nhầm dịch vụ hợp pháp và làm gián đoạn công việc của cả phòng.",
        focus: ["log", "ioc"],
        edges: ["log-ioc"],
        metrics: { logs: "50.000", ioc: "1.000", blocked: "0", exposure: "1.000" },
        changes: ["Khoanh được 1.000 lượt khớp IOC", "Thu hẹp về ba máy cùng gọi ra"],
        note: "Nhịp gọi đều đặn là dấu hiệu mạnh hơn tổng số lượt khớp."
      },
      {
        short: "Máy nguồn",
        type: "detail",
        title: "Lần về PC-KETOAN-07",
        body: "Trong ba máy, chỉ PC-KETOAN-07 vừa có lượt gọi ra vừa có tiến trình lạ. Tài khoản kế toán mở một tệp bảng tính có macro lúc 8 giờ 55, bảy phút trước lần gọi đầu tiên. Tệp được gửi từ địa chỉ ngoài công ty với tiêu đề hóa đơn, đúng mùa quyết toán nên không ai nghi ngờ. Chuỗi sự kiện ghép lại thành đường đi rõ ràng: mở tệp, macro chạy, tạo tiến trình nền, gọi tên miền điều khiển. Hai máy còn lại chỉ khớp một lần do trình duyệt tải quảng cáo trùng dải IP, không có tiến trình lạ. Kết luận máy nguồn là PC-KETOAN-07, và mọi hành động tiếp theo nên nhắm vào máy này trước.",
        focus: ["ioc", "host", "expose"],
        edges: ["ioc-host", "host-expose"],
        metrics: { logs: "50.000", ioc: "1.000", blocked: "0", exposure: "1.000" },
        changes: ["Xác định PC-KETOAN-07 là máy nguồn", "Loại hai máy khớp nhầm do quảng cáo"],
        note: "Ghép mốc thời gian của tệp, tiến trình và DNS để chứng minh chuỗi."
      },
      {
        short: "Chặn 90%",
        type: "pitfall",
        title: "Chặn 90% chưa phải đã sạch",
        body: "Đội trực ca đẩy luật chặn ba tên miền và hai địa chỉ IP, thu được <code>900</code> lượt bị chặn trên tổng 1.000. Con số này nghe tốt nhưng vẫn còn <code>100</code> lượt gọi ra thành công, gấp 20 lần ngưỡng cho phép là 5. Nguyên nhân là máy nguồn vẫn chạy và vẫn thử lại, chỉ chờ tên miền dự phòng trong mã độc. Chặn ở lớp tên miền không cắt được tiến trình đang chạy trên máy, nên phần còn hở sẽ tự sinh lại sau vài giờ. Việc đúng là cách ly PC-KETOAN-07 khỏi mạng, khóa tài khoản kế toán và thu ảnh bộ nhớ trước khi dọn. Chỉ khi số lượt hở về dưới 5 mới coi là tạm ổn để chuyển sang điều tra sâu.",
        focus: ["ioc", "block", "expose", "ticket"],
        edges: ["ioc-block", "block-expose", "expose-ticket"],
        metrics: { logs: "50.000", ioc: "1.000", blocked: "900", exposure: "100" },
        changes: ["Chặn được 900 lượt, còn 100 lượt", "Mở phiếu cách ly máy nguồn"],
        note: "Mốc 90% là con số đẹp trên báo cáo, không phải ngưỡng an toàn."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Truy vết là ghép mốc, không đoán",
        body: "Tổng kết: 50.000 bản ghi cho ra <code>1.000</code> lượt khớp IOC, lần về PC-KETOAN-07 qua tệp macro mở lúc 8 giờ 55. Chặn tên miền xử lý 900 lượt, còn 100 lượt buộc phải cách ly máy và khóa tài khoản. Chuỗi làm việc đúng là khoanh vùng bằng log, xác định máy nguồn bằng mốc thời gian, rồi mới chặn và cách ly. Nếu đảo thứ tự, đội trực ca dễ chặn nhầm dịch vụ hoặc bỏ sót máy thật. Mọi kết luận cần kèm mã bản ghi để người khác kiểm lại. Bước tiếp theo là viết báo cáo sự cố, nơi bốn mốc thời gian và 12 tệp bằng chứng phải đứng đúng chỗ để người ngoài ca đọc hiểu.",
        focus: "all",
        edges: "all",
        metrics: { logs: "50.000", ioc: "1.000", blocked: "900", exposure: "100" },
        changes: ["Chốt được máy nguồn và phần còn hở", "Sẵn sàng chuyển sang viết báo cáo"],
        note: "Giữ mã bản ghi cho từng kết luận, vì báo cáo sẽ cần dẫn lại."
      }
    ]
  };

  /* ---------------------------------------------------------------- */
  DB.lessons["bao-cao"] = {
    id: "bao-cao",
    module: "phan-tich-bao-cao",
    title: "Viết báo cáo sự cố",
    shortTitle: "Báo cáo",
    subtitle: "Năm phần, bốn mốc thời gian và bằng chứng đủ để người khác làm lại",
    blurb: "Báo cáo sự cố phục vụ quyết định của người không có mặt trong ca. Bài dựng dòng thời gian bốn mốc, gom 12 tệp bằng chứng và viết năm phần, để bản báo cáo đọc được bởi cả quản lý lẫn pháp chế.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["báo cáo", "dòng thời gian", "bằng chứng", "tác động", "bài học"],
    metrics: [
      { key: "parts", label: "Phần bắt buộc", tone: "blue" },
      { key: "timeline", label: "Mốc thời gian", tone: "mint" },
      { key: "evidence", label: "Bằng chứng", tone: "yellow" },
      { key: "audience", label: "Người đọc", tone: "coral" }
    ],
    nodes: [
      { id: "alert", type: "alert", x: 55, y: 80, w: 200, h: 70, label: "Sự cố 14:05", sub: "máy kế toán" },
      { id: "note", type: "page", x: 340, y: 80, w: 200, h: 70, label: "Ghi chép hiện trường", sub: "ảnh, log, lệnh" },
      { id: "clock", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Dòng thời gian", sub: "14:05 đến 16:40" },
      { id: "draft", type: "file", x: 340, y: 195, w: 200, h: 70, label: "Bản nháp", sub: "5 phần, 2 trang" },
      { id: "review", type: "audit", x: 55, y: 310, w: 200, h: 70, label: "Soát chéo", sub: "người khác đọc" },
      { id: "publish", type: "book", x: 340, y: 310, w: 200, h: 70, label: "Báo cáo chính thức", sub: "gửi trước 18:00" },
      { id: "learn", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Bài học", sub: "vá lỗi, thêm luật" }
    ],
    edges: [
      { id: "alert-note", from: "alert", to: "note", kind: "request", label: "ghi nhận" },
      { id: "note-clock", from: "note", to: "clock", kind: "data", label: "dựng mốc" },
      { id: "note-draft", from: "note", to: "draft", kind: "data", label: "bằng chứng" },
      { id: "clock-draft", from: "clock", to: "draft", kind: "data", label: "đưa vào nháp" },
      { id: "draft-review", from: "draft", to: "review", kind: "control", label: "soát chéo" },
      { id: "review-publish", from: "review", to: "publish", kind: "data", label: "duyệt" },
      { id: "publish-learn", from: "publish", to: "learn", kind: "response", label: "rút bài học" }
    ],
    learn: [
      "Báo cáo gồm <strong>năm phần</strong>: tóm tắt, dòng thời gian, tác động, việc đã làm, việc tiếp theo.",
      "Mỗi mốc phải kèm nguồn, ví dụ <code>14:20</code> cách ly máy theo log EDR.",
      "Bằng chứng là tệp log, ảnh chụp hoặc mã băm, không phải lời kể miệng.",
      "Người đọc chính là quản lý và pháp chế, nên tránh từ lóng nội bộ."
    ],
    steps: [
      {
        short: "Năm phần",
        type: "concept",
        title: "Báo cáo phục vụ quyết định",
        body: "Một báo cáo sự cố tốt giúp người không có mặt trong ca ra được quyết định mà không cần gọi điện hỏi lại. Vì vậy cấu trúc gồm đúng <code>năm phần</code>: tóm tắt một đoạn, dòng thời gian, tác động đo được, việc đã làm và việc tiếp theo kèm người phụ trách. Tóm tắt đứng đầu vì giám đốc vận hành chỉ có ba phút trước giờ họp. Dòng thời gian đứng thứ hai vì mọi tranh luận về trách nhiệm đều quy về mốc thời gian. Tác động phải có số: ba tài khoản, 12 tệp bằng chứng, thời gian gián đoạn. Việc đã làm và việc tiếp theo tách riêng để người đọc biết cái gì đã xong, cái gì còn nợ.",
        focus: ["alert", "draft"],
        edges: ["alert-note", "note-draft"],
        metrics: { parts: "5", timeline: "chưa dựng", evidence: "0", audience: "quản lý" },
        changes: ["Chốt khung năm phần cho bản nháp", "Xác định người đọc chính là quản lý"],
        note: "Nếu người đọc phải gọi hỏi lại, bản báo cáo chưa đạt."
      },
      {
        short: "Dòng thời gian",
        type: "flow",
        title: "Bốn mốc đủ kể câu chuyện",
        body: "Dòng thời gian của ca này có bốn mốc. Lúc <code>14:05</code>, EDR báo tiến trình lạ trên PC-KETOAN-07. Lúc <code>14:20</code>, đội trực ca cách ly máy và khóa tài khoản kế toán. Lúc <code>15:10</code>, đối chiếu log xác định tên miền điều khiển và ba máy liên quan. Lúc <code>16:40</code>, luật chặn có hiệu lực, 900 lượt bị chặn, còn 100 lượt cần theo dõi. Bốn mốc là đủ, không cần liệt kê từng thao tác nhỏ. Mỗi mốc phải ghi nguồn: log EDR, ảnh chụp màn hình hay biên bản của người trực. Mốc không có nguồn thì nên bỏ, vì một mốc sai làm lệch toàn bộ cách hiểu diễn biến và có thể khiến kết luận về trách nhiệm bị đặt sai chỗ.",
        focus: ["note", "clock", "draft"],
        edges: ["note-clock", "clock-draft"],
        metrics: { parts: "5", timeline: "4 mốc", evidence: "3 nhóm", audience: "trực ca" },
        changes: ["Dựng dòng thời gian 14:05 đến 16:40", "Gắn nguồn cho từng mốc"],
        note: "Bốn mốc có nguồn tốt hơn mười mốc không ai kiểm chứng được."
      },
      {
        short: "Bằng chứng",
        type: "detail",
        title: "Mười hai tệp, một phụ lục",
        body: "Bằng chứng của ca gồm <code>12</code> tệp: bốn đoạn log EDR, ba ảnh chụp tiến trình, hai danh sách tệp bị mã hóa, hai ảnh cấu hình tường lửa và một bảng băm của tệp macro. Tất cả nên nằm trong phụ lục, mỗi tệp có tên theo ngày giờ và mã sự cố, kèm mã băm. Thân báo cáo chỉ dẫn tới phụ lục, không dán nội dung dài. Cách này giúp người đọc lướt nhanh vẫn nắm được. Một lỗi thường gặp là chụp ảnh màn hình không có đồng hồ hệ thống, khiến mốc thời gian không đối chiếu được với log. Trước khi gửi, hãy mở thử từng đường dẫn trong phụ lục để chắc người nhận truy cập được.",
        focus: ["note", "draft"],
        edges: ["note-draft", "clock-draft"],
        metrics: { parts: "5", timeline: "4 mốc", evidence: "12 tệp", audience: "điều tra" },
        changes: ["Gom đủ 12 tệp vào phụ lục", "Mỗi tệp có tên và mã băm"],
        note: "Ảnh chụp thiếu đồng hồ hệ thống thì gần như không dùng được."
      },
      {
        short: "Soát chéo",
        type: "pitfall",
        title: "Người ngoài ca phải hiểu trong một lần đọc",
        body: "Bản nháp đầu tiên dày 3 trang và dùng nhiều từ lóng như beacon, hash, IOC. Người soát chéo không thuộc ca đọc xong hỏi lại ba chỗ, nghĩa là bản báo cáo chưa đạt. Cách sửa là đổi từ lóng sang việc cụ thể: beacon thành máy gọi ra ngoài đều 5 phút một lần, IOC thành danh sách tên miền và địa chỉ độc hại đã biết. Phần tác động phải nêu rõ ba tài khoản bị ảnh hưởng và khoảng thời gian gián đoạn, vì pháp chế cần con số này để quyết định có thông báo khách hàng hay không. Sau khi sửa, bản báo cáo còn 2 trang và không còn câu hỏi nào. Quy tắc: nhờ người ngoài ca đọc thử trước khi gửi.",
        focus: ["draft", "review", "publish"],
        edges: ["draft-review", "review-publish"],
        metrics: { parts: "5", timeline: "4 mốc", evidence: "12 tệp", audience: "quản lý, pháp chế" },
        changes: ["Bỏ từ lóng, thay bằng mô tả cụ thể", "Bản nháp rút từ 3 trang còn 2"],
        note: "Một người ngoài ca đọc hiểu là bài kiểm tra rẻ nhất."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Báo cáo là sản phẩm, không là thủ tục",
        body: "Tổng kết: bản báo cáo gồm <code>năm phần</code>, dòng thời gian bốn mốc từ 14:05 đến 16:40, <code>12</code> tệp bằng chứng trong phụ lục và phần tác động nêu ba tài khoản bị ảnh hưởng. Bản nháp ba trang được soát chéo, bỏ từ lóng, rút còn hai trang và gửi trước 18:00. Giá trị của báo cáo nằm ở chỗ người không có mặt trong ca vẫn ra được quyết định: có thông báo khách hàng hay không, có cần vá khẩn cấp hay không. Phần bài học nên gắn với việc cụ thể như thêm luật chặn tên miền dự phòng. Bước cuối của module là diễn tập, nơi chính các báo cáo này trở thành dữ liệu để đo thời gian phát hiện và khắc phục.",
        focus: "all",
        edges: "all",
        metrics: { parts: "5", timeline: "4 mốc", evidence: "12 tệp", audience: "toàn công ty" },
        changes: ["Báo cáo chính thức được gửi trước 18:00", "Chốt ba việc cải tiến kèm người phụ trách"],
        note: "Mỗi bài học trong báo cáo phải thành một việc có hạn và có người."
      }
    ]
  };

  /* ---------------------------------------------------------------- */
  DB.lessons["dien-tap"] = {
    id: "dien-tap",
    module: "phan-tich-bao-cao",
    title: "Diễn tập và cải tiến",
    shortTitle: "Diễn tập",
    subtitle: "Đo MTTD 12 phút, MTTR 95 phút rồi rút xuống 60",
    blurb: "Diễn tập có giá trị khi thời gian được bấm đồng hồ và kết quả dẫn tới thay đổi cụ thể. Bài chạy kịch bản không báo trước, đo hai chặng phát hiện và khắc phục, chọn một điểm nghẽn, rồi diễn lại.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["diễn tập", "MTTD", "MTTR", "kịch bản", "cải tiến"],
    metrics: [
      { key: "mttd", label: "Phát hiện", tone: "blue" },
      { key: "mttr", label: "Khắc phục", tone: "mint" },
      { key: "drill", label: "Kịch bản", tone: "yellow" },
      { key: "gap", label: "Điểm nghẽn", tone: "coral" }
    ],
    nodes: [
      { id: "plan", type: "book", x: 55, y: 80, w: 200, h: 70, label: "Kịch bản diễn tập", sub: "ransomware cuối tuần" },
      { id: "run", type: "task", x: 340, y: 80, w: 200, h: 70, label: "Chạy không báo trước", sub: "đội trực ca" },
      { id: "clock", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Bấm giờ", sub: "MTTD 12, MTTR 95" },
      { id: "gap", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Điểm nghẽn", sub: "trực đêm thiếu người" },
      { id: "fix", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Sửa quy trình", sub: "thêm ca đêm" },
      { id: "retest", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Diễn lại", sub: "MTTR còn 60 phút" },
      { id: "report", type: "audit", x: 625, y: 310, w: 200, h: 70, label: "Báo lãnh đạo", sub: "4 việc, 1 quý" }
    ],
    edges: [
      { id: "plan-run", from: "plan", to: "run", kind: "request", label: "phát kịch bản" },
      { id: "run-clock", from: "run", to: "clock", kind: "data", label: "bấm giờ" },
      { id: "clock-gap", from: "clock", to: "gap", kind: "data", label: "so mục tiêu" },
      { id: "gap-fix", from: "gap", to: "fix", kind: "control", label: "chọn việc sửa" },
      { id: "fix-retest", from: "fix", to: "retest", kind: "control", label: "chạy lại" },
      { id: "retest-report", from: "retest", to: "report", kind: "data", label: "kết quả mới" },
      { id: "clock-report", from: "clock", to: "report", kind: "data", label: "số liệu gốc" }
    ],
    learn: [
      "Diễn tập không báo trước cho thấy <strong>thời gian thật</strong>, không phải thời gian trên giấy.",
      "MTTD 12 phút và MTTR 95 phút là hai số đo riêng, không gộp làm một.",
      "Mỗi quý chọn <code>một</code> điểm nghẽn để sửa, thay vì sửa cả danh sách.",
      "Diễn lại sau khi sửa mới chứng minh cải tiến, MTTR từ 95 xuống 60 phút."
    ],
    steps: [
      {
        short: "Kịch bản",
        type: "concept",
        title: "Diễn tập để lộ chỗ hỏng",
        body: "Kịch bản quý này là một cuộc tấn công tống tiền vào tối thứ bảy, khi chỉ có một người trực. Kịch bản được duyệt trước với lãnh đạo nhưng không thông báo cho đội trực ca, vì báo trước sẽ biến buổi diễn thành buổi trình diễn. Mục tiêu không phải chứng minh đội giỏi mà là tìm chỗ quy trình gãy. Chu kỳ <code>1 quý/lần</code> đủ dày để nhớ bài, đủ thưa để không làm phiền công việc thật. Mỗi lần chỉ nên có một mục tiêu chính, ví dụ lần này đo thời gian từ lúc cảnh báo đến lúc cách ly máy. Đặt nhiều mục tiêu sẽ khiến kết quả khó đọc và đội trực ca mất tập trung vào chỗ cần đo.",
        focus: ["plan"],
        edges: ["plan-run"],
        metrics: { mttd: "chưa đo", mttr: "chưa đo", drill: "1 quý/lần", gap: "chưa rõ" },
        changes: ["Chốt kịch bản ransomware cuối tuần", "Mục tiêu chính là thời gian cách ly"],
        note: "Kịch bản phải được duyệt trước, nhưng người trực thì không."
      },
      {
        short: "Bấm giờ",
        type: "flow",
        title: "Hai chặng thời gian",
        body: "Khi kịch bản chạy, người quan sát bấm hai mốc. MTTD là thời gian từ lúc dấu hiệu đầu tiên xuất hiện đến lúc có cảnh báo, đo được <code>12 phút</code>. MTTR là thời gian từ cảnh báo đến lúc máy được cách ly và dịch vụ ổn định, đo được <code>95 phút</code>. Hai số này phải đo riêng vì cách cải thiện khác nhau: MTTD dài thì cần thêm luật phát hiện, MTTR dài thì cần thêm người hoặc đơn giản hóa thủ tục. Trong ca diễn tập, người trực phải gọi ba lần mới tìm được người có quyền khóa tài khoản, mất 40 phút chỉ cho một bước. Ghi lại từng lần chờ quan trọng hơn ghi cảm nhận chung.",
        focus: ["run", "clock"],
        edges: ["run-clock", "clock-gap"],
        metrics: { mttd: "12 phút", mttr: "95 phút", drill: "1 quý/lần", gap: "chưa chốt" },
        changes: ["Đo được MTTD 12 phút", "Đo được MTTR 95 phút"],
        note: "Đo từng lần chờ, vì tổng thời gian không chỉ ra được chỗ tắc."
      },
      {
        short: "Điểm nghẽn",
        type: "detail",
        title: "Chọn đúng một chỗ để sửa",
        body: "Bảng đo cho thấy 40 trong 95 phút là thời gian chờ người có quyền, tập trung ở ca đêm. Đó là điểm nghẽn rõ nhất, không phải công cụ hay kỹ năng phân tích. Đội chọn một việc: thêm một người trực đêm và trao quyền khóa tài khoản cho người đó, kèm danh sách ba bước kiểm tra trước khi khóa. Chỉ một việc, vì sửa bốn việc cùng lúc thì không biết việc nào tạo ra cải thiện. Mỗi việc cần có người phụ trách và hạn hoàn thành, ở đây là trước kỳ diễn tiếp theo sau sáu tuần. Bảng theo dõi ghi rõ việc nào xong, việc nào trễ, để buổi diễn sau có cơ sở so sánh thay vì tranh luận bằng cảm giác.",
        focus: ["clock", "gap", "fix"],
        edges: ["clock-gap", "gap-fix"],
        metrics: { mttd: "12 phút", mttr: "95 phút", drill: "1 quý/lần", gap: "trực đêm" },
        changes: ["Chốt điểm nghẽn là chờ quyền 40 phút", "Giao một việc: thêm người trực đêm"],
        note: "Một việc có hạn tốt hơn bốn việc không ai nhớ."
      },
      {
        short: "Diễn lại",
        type: "pitfall",
        title: "Sửa một việc rồi dừng là bẫy",
        body: "Sáu tuần sau, đội diễn lại đúng kịch bản cũ. MTTR giảm từ 95 xuống <code>60 phút</code>, đạt mục tiêu, nhưng MTTD vẫn 12 phút và vẫn còn ba việc trong danh sách chưa làm. Nếu dừng ở đây và báo cáo thành công, quý sau đội sẽ gặp lại đúng ba chỗ hỏng đó. Cách làm đúng là ghi nhận phần đã cải thiện, rồi giữ ba việc còn lại trong kế hoạch quý tới, mỗi việc vẫn có người và hạn. Cũng cần kiểm tra cải thiện có bền không: người trực đêm có thể nghỉ việc, quyền khóa có thể bị thu hồi khi đổi quy trình. Diễn tập chỉ đáng tin khi kết quả lặp lại, không phải một lần may mắn.",
        focus: ["fix", "retest", "report"],
        edges: ["fix-retest", "retest-report", "clock-report"],
        metrics: { mttd: "12 phút", mttr: "60 phút", drill: "1 quý/lần", gap: "đã vá 1" },
        changes: ["Diễn lại đạt MTTR 60 phút", "Ba việc còn lại chuyển sang quý sau"],
        note: "Một lần cải thiện chưa đủ, phải lặp lại được ở lần diễn sau."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Vòng cải tiến khép kín",
        body: "Tổng kết: kịch bản ransomware chạy không báo trước cho MTTD <code>12 phút</code> và MTTR <code>95 phút</code>. Điểm nghẽn là 40 phút chờ quyền trong ca đêm, được sửa bằng một người trực có quyền khóa tài khoản. Diễn lại sau sáu tuần đưa MTTR xuống 60 phút, còn ba việc chuyển sang quý sau. Chu trình đúng là đặt kịch bản, bấm giờ, chọn một điểm nghẽn, sửa, rồi diễn lại để chứng minh. Bốn bài của module khép lại ở đây: chấm điểm để chọn việc, truy tìm để biết máy nào, báo cáo để người khác ra quyết định, và diễn tập để biết quy trình có thật sự chạy được khi không có người giỏi nhất trong ca.",
        focus: "all",
        edges: "all",
        metrics: { mttd: "12 phút", mttr: "60 phút", drill: "1 quý/lần", gap: "còn 3 việc" },
        changes: ["Khép vòng đo, sửa và diễn lại", "Chốt bốn việc cải tiến cho quý sau"],
        note: "Đo được, sửa được, diễn lại được mới là cải tiến thật."
      }
    ]
  };

  /* ---------------------------------------------------------------- */
  DB.practice.push(
    {
      id: "cvss-ho-so-khach",
      module: "phan-tich-bao-cao",
      tags: ["CVSS", "ưu tiên", "ngữ cảnh"],
      tag: "CVSS",
      title: "Lỗ hổng 7,5 trên máy chủ hồ sơ",
      scenario: "Chín giờ sáng, hệ thống quét trả về một lỗ hổng CVSS 7,5 trên máy chủ web của phòng kinh doanh. Máy này mở cổng 443 ra Internet và lưu hồ sơ khách hàng gồm số điện thoại, địa chỉ giao hàng. Đội trực ca đã xác nhận cổng vẫn mở, dữ liệu vẫn nằm trên máy và chưa có bản vá chính thức, chỉ có biện pháp giảm thiểu tạm thời. Sếp hỏi nên xếp ca này vào nhóm nào và xử lý trong bao lâu, trong khi hàng đợi còn bốn lỗ hổng khác điểm thấp hơn. Bạn cần chấm theo đúng công thức của engine rồi trả lời.",
      metrics: [
        { label: "CVSS", value: "7,5" },
        { label: "Vị trí", value: "hở Internet" },
        { label: "Dữ liệu", value: "có", danger: true }
      ],
      options: [
        "75 điểm, ưu tiên cao, vá trong tuần",
        "110 điểm, ưu tiên cao, xử lý ngay",
        "100 điểm, ưu tiên cao, xử lý ngay",
        "40 điểm, ưu tiên thường, xếp hàng chờ"
      ],
      correct: 2,
      explain: "Điểm gốc là 7,5 × 10 = 75, hở Internet cộng 20 thành 95, dữ liệu nhạy cảm cộng 15 thành 110. Vì thang điểm dừng ở 100, engine chặn trần và trả về <code>100</code>; mức 100 vượt ngưỡng 70 nên là ưu tiên cao và phải xử lý ngay. Phương án 75 chỉ dùng điểm gốc, bỏ qua hai lớp ngữ cảnh đã được xác nhận. Phương án 110 giữ nguyên tổng thô, nhưng không ai chấm điểm trên thang 100 bằng 110, và báo cáo sẽ sai chuẩn. Phương án 40 là kết quả của ca 4,0 nội bộ không có dữ liệu, hoàn toàn khác tình huống này. Hãy nhớ ghi cả 110 và 100 để người đọc thấy phần bị cắt."
    },
    {
      id: "bao-cao-ngoai-ca",
      module: "phan-tich-bao-cao",
      tags: ["REPORT", "báo cáo", "dòng thời gian"],
      tag: "REPORT",
      title: "Báo cáo cho người không trực ca",
      scenario: "16 giờ 40, đội trực ca đã chặn xong tên miền độc hại và cách ly máy kế toán. Sự cố kéo dài từ 14 giờ 05, ảnh hưởng ba tài khoản, đã thu 12 tệp bằng chứng gồm log EDR, ảnh chụp tiến trình và danh sách tệp bị mã hóa. Giám đốc vận hành không có mặt trong ca, cần đọc báo cáo trước 18 giờ để quyết định có thông báo khách hàng hay không. Trong phòng còn nhiều từ lóng như beacon, IOC, hash. Bạn chọn cách trình bày nào cho bản báo cáo này?",
      metrics: [
        { label: "Thời lượng", value: "155 phút" },
        { label: "Tài khoản", value: "3" },
        { label: "Bằng chứng", value: "12 tệp" }
      ],
      options: [
        "Dán toàn bộ log thô vào email để giữ nguyên bằng chứng",
        "Tóm tắt tác động, dòng thời gian bốn mốc, việc đã làm và việc tiếp theo, kèm phụ lục bằng chứng",
        "Chỉ ghi đã xử lý xong, hẹn gặp trao đổi trực tiếp vào sáng mai",
        "Viết lại theo hướng kỹ thuật chi tiết, giữ nguyên từ lóng để chính xác"
      ],
      correct: 1,
      explain: "Báo cáo sự cố phục vụ quyết định, không phục vụ khoe kỹ thuật. Người đọc là giám đốc vận hành, cần biết chuyện gì xảy ra, ảnh hưởng ai, đã làm gì và tiếp theo làm gì, nên phần tóm tắt và tác động phải đứng đầu. Dòng thời gian bốn mốc 14:05, 14:20, 15:10, 16:40 đủ để người đọc dựng lại diễn biến mà không cần mở log. Mười hai tệp bằng chứng nên để ở phụ lục, có đường dẫn rõ ràng, thay vì dán vào thân báo cáo. Phương án dán log thô làm người đọc lạc giữa hàng nghìn dòng. Phương án đã xử lý xong không có số liệu để quyết định thông báo khách hàng. Phương án giữ từ lóng khiến người ngoài ca không đọc được."
    }
  );

  /* ---------------------------------------------------------------- */
  DB.cheatsheets.push({
    id: "reporting",
    num: "03",
    module: "phan-tich-bao-cao",
    title: "Phân tích và báo cáo",
    intro: "Ba trang gom công thức chấm điểm, mẫu dòng thời gian, năm phần báo cáo và chu kỳ diễn tập. Dùng khi trực ca cần chốt ưu tiên, khi viết báo cáo trước giờ họp, hoặc khi chuẩn bị kịch bản cho quý sau.",
    cards: [
      {
        title: "Công thức điểm sự cố",
        wide: true,
        html: "<table><thead><tr><th>Thành phần</th><th>Cách tính</th><th>Ví dụ</th></tr></thead><tbody><tr><td>Điểm gốc</td><td>CVSS × 10</td><td>7,5 thành 75</td></tr><tr><td>Hở Internet</td><td>cộng 20</td><td>75 thành 95</td></tr><tr><td>Dữ liệu nhạy cảm</td><td>cộng 15</td><td>95 thành 110</td></tr><tr><td>Chặn trần</td><td>tối đa 100</td><td>110 thành 100</td></tr><tr><td>Ngưỡng</td><td>từ 70 là ưu tiên cao</td><td>75 cao, 40 thường</td></tr></tbody></table>"
      },
      {
        title: "Dòng thời gian bốn mốc",
        html: "<pre><code>14:05  EDR báo tiến trình lạ trên PC-KETOAN-07\n14:20  Cách ly máy, khóa tài khoản kế toán\n15:10  Xác định tên miền điều khiển, 1.000 lượt khớp\n16:40  Chặn xong 900 lượt, còn 100 lượt theo dõi</code></pre>"
      },
      {
        title: "Năm phần báo cáo",
        html: "<ul><li><strong>Tóm tắt</strong>: một đoạn, nêu sự cố và mức ưu tiên.</li><li><strong>Dòng thời gian</strong>: bốn mốc, mỗi mốc kèm nguồn.</li><li><strong>Tác động</strong>: số tài khoản, thời gian gián đoạn.</li><li><strong>Việc đã làm</strong>: chặn gì, cách ly máy nào.</li><li><strong>Việc tiếp theo</strong>: người phụ trách và hạn.</li></ul>"
      },
      {
        title: "Câu hỏi truy tìm",
        wide: true,
        html: "<table><thead><tr><th>Nguồn</th><th>Câu hỏi</th><th>Dấu hiệu</th></tr></thead><tbody><tr><td>DNS</td><td>Máy nào gọi tên miền lạ?</td><td>đều 5 phút một lần</td></tr><tr><td>Tiến trình</td><td>Tiến trình nào sinh ra nó?</td><td>macro trong tệp bảng tính</td></tr><tr><td>Tường lửa</td><td>Cổng nào còn mở ra ngoài?</td><td>443 từ Internet</td></tr><tr><td>Đăng nhập</td><td>Tài khoản nào bị dùng?</td><td>kế toán, ngoài giờ</td></tr></tbody></table>"
      },
      {
        title: "Chu kỳ diễn tập",
        html: "<ul><li>Mỗi quý một kịch bản, không báo trước cho đội trực.</li><li>Đo <strong>MTTD</strong> và <strong>MTTR</strong> riêng, ghi từng lần chờ.</li><li>Chọn <code>một</code> điểm nghẽn, giao một người, một hạn.</li><li>Diễn lại sau sáu tuần để chứng minh cải tiến.</li><li>Báo lãnh đạo bằng số, không bằng cảm nhận.</li></ul>"
      }
    ]
  });
})();
