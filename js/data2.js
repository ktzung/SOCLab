/* SOCLab - dữ liệu phần 2: module Dấu vết tấn công */
window.SOCLAB = window.SOCLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

window.SOCLAB.modules.push({
  id: "dau-vet-tan-cong",
  num: "02",
  tone: "mint",
  title: "Dấu vết tấn công",
  blurb: "Bốn bài đi theo thứ tự một ca điều tra: nhận dạng chỉ báo thỏa hiệp, đọc log và lọc nhiễu, dựng dòng thời gian, rồi khoanh vùng và cô lập máy nhiễm. Mỗi bài có sơ đồ bảy nút, năm bước phân tích và một tình huống luyện dùng bộ số liệu 50.000 bản ghi.",
  lessons: ["ioc", "log", "timeline", "containment"]
});

window.SOCLAB.lessons["ioc"] = {
  id: "ioc",
  module: "dau-vet-tan-cong",
  title: "Chỉ báo thỏa hiệp",
  shortTitle: "IOC",
  subtitle: "Từ một hash tệp đến 100 lượt còn phơi nhiễm",
  blurb: "Chỉ báo thỏa hiệp là dấu vết cụ thể của một vụ xâm nhập: hash tệp, địa chỉ IP, tên miền. Bài đi từ một mẫu IOC nhỏ, đối chiếu với 50.000 bản ghi, chặn 90% và chỉ ra 100 lượt còn phơi nhiễm.",
  duration: "12 phút",
  level: "Cơ bản",
  tags: ["IOC", "hash", "đối chiếu", "phơi nhiễm", "danh sách chặn"],
  metrics: [
    { key: "hits", label: "Lượt khớp", tone: "yellow" },
    { key: "blocked", label: "Đã chặn", tone: "mint" },
    { key: "exposure", label: "Còn hở", tone: "coral" },
    { key: "verdict", label: "Kết luận", tone: "blue" }
  ],
  nodes: [
    { id: "host", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Máy bị mã hóa", sub: "kế toán, 2 giờ sáng" },
    { id: "file", type: "file", x: 340, y: 80, w: 200, h: 70, label: "Mẫu IOC", sub: "hash, IP, tên miền" },
    { id: "key", type: "key", x: 625, y: 80, w: 200, h: 70, label: "Danh sách đen", sub: "máy chủ chia sẻ" },
    { id: "grid", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Đối chiếu log", sub: "so từng trường" },
    { id: "signal", type: "signal", x: 625, y: 310, w: 200, h: 70, label: "Lượt khớp", sub: "1.000 trên 50.000" },
    { id: "shield", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Chặn tự động", sub: "900 lượt bị chặn" },
    { id: "alert", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Còn phơi nhiễm", sub: "100 lượt chưa chặn" }
  ],
  edges: [
    { id: "host-file", from: "host", to: "file", kind: "request", label: "báo hash" },
    { id: "file-grid", from: "file", to: "grid", kind: "data", label: "mẫu đối chiếu" },
    { id: "key-grid", from: "key", to: "grid", kind: "data", label: "danh sách chặn" },
    { id: "grid-signal", from: "grid", to: "signal", kind: "data", label: "lượt khớp" },
    { id: "signal-shield", from: "signal", to: "shield", kind: "request", label: "đẩy chặn" },
    { id: "shield-alert", from: "shield", to: "alert", kind: "control", label: "còn sót" }
  ],
  learn: [
    "IOC là dấu vết cụ thể: <code>hash</code> tệp, IP máy chủ điều khiển, tên miền phát tán.",
    "Đối chiếu IOC với toàn bộ log biến 50.000 dòng thành 1.000 lượt khớp đọc được.",
    "Chặn 90% số lượt khớp để lại <strong>100 lượt</strong> phải xử lý tay, vượt ngưỡng 5.",
    "Bản ghi gốc phải giữ nguyên, vì lệnh chặn không được phép xóa dấu vết."
  ],
  steps: [
    {
      short: "Dấu vết",
      type: "concept",
      title: "Một chỉ báo gồm những gì",
      body: "Một chỉ báo thỏa hiệp, hay IOC, là dấu vết cụ thể cho thấy hệ thống đã bị chạm: mã hash của tệp độc, địa chỉ IP máy chủ điều khiển, tên miền phát tán, khóa registry hay chuỗi lệnh bất thường. Ca trực đêm nhận cảnh báo từ EDR trên máy kế toán: một tệp <code>hoadon.exe</code> vừa mã hóa 300 tệp văn bản lúc 2 giờ sáng. Nhóm điều tra ghi lại hash SHA-256 của tệp, IP mà máy gọi ra và tên miền trong bản ghi DNS. Ba mẩu dấu vết ấy đủ để dựng một mẫu IOC, đem đối chiếu với toàn bộ log của tòa nhà thay vì chỉ nhìn một máy.",
      focus: ["host", "file", "key"],
      edges: ["host-file", "file-grid", "key-grid"],
      metrics: { hits: "0", blocked: "0", exposure: "chưa đo", verdict: "ghi nhận" },
      changes: ["Ghi nhận hash tệp và IP gọi ra", "Mẫu IOC đầu tiên được dựng"],
      note: "Một IOC chỉ có giá trị khi kèm thời điểm và nguồn ghi nhận."
    },
    {
      short: "Đối chiếu",
      type: "flow",
      title: "50.000 dòng, 1.000 lượt khớp",
      body: "Cổng gom log nhận 50.000 bản ghi trong một ca, gồm tường lửa, proxy và nhật ký đăng nhập. Bộ đối chiếu so từng trường với danh sách IOC: hash tệp so khớp tuyệt đối, IP và tên miền so khớp chuỗi, còn chuỗi lệnh thì so khớp mẫu. Với tỉ lệ đáng ngờ 2%, phép nhân <code>50.000 × 2%</code> cho 1.000 lượt khớp. Con số này quan trọng vì nó biến một danh sách dài thành việc làm được trong ca trực: 1.000 dòng đủ để lọc bằng mắt theo từng nhóm máy. Nếu không có bước đối chiếu, người trực phải đọc cả 50.000 dòng và gần như chắc chắn bỏ sót.",
      focus: ["file", "key", "grid", "signal"],
      edges: ["file-grid", "key-grid", "grid-signal"],
      metrics: { hits: "1.000", blocked: "0", exposure: "1.000", verdict: "chưa chặn" },
      changes: ["1.000 lượt khớp được tách ra", "Danh sách chia theo nhóm máy"],
      note: "Đối chiếu phải chạy trên log gốc, không chạy trên bản đã lọc."
    },
    {
      short: "Chặn",
      type: "detail",
      title: "900 lượt chặn, 100 lượt còn",
      body: "Chặn tự động xử lý phần lớn lượt khớp: 90% của 1.000 là 900 lượt bị đẩy vào danh sách chặn của tường lửa và EDR, chỉ 100 lượt còn lại cần người xem. Điểm mấu chốt là phân biệt chặn với xóa: lệnh chặn giữ nguyên bản ghi gốc, kèm thời điểm, IP nguồn và tài khoản liên quan, để sau này còn dựng lại được. Với 100 lượt còn hở, người trực kiểm tra xem máy nào thật sự gọi ra ngoài, máy nào chỉ trùng IP với dịch vụ dùng chung. Ngưỡng chấp nhận của phòng là 5 lượt; 100 lớn hơn ngưỡng 20 lần nên sự cố vẫn mở.",
      focus: ["signal", "shield", "alert"],
      edges: ["grid-signal", "signal-shield", "shield-alert"],
      metrics: { hits: "1.000", blocked: "900", exposure: "100", verdict: "còn hở" },
      changes: ["900 lượt bị chặn tự động", "100 lượt chuyển sang xử lý tay"],
      note: "Ngưỡng 5 lượt là mức chấp nhận của phòng, không phải mục tiêu cần đạt."
    },
    {
      short: "Giới hạn",
      type: "pitfall",
      title: "Chỉ chặn hash thì hụt",
      body: "Chặn theo hash chỉ bắt được đúng tệp đã biết. Khi ca lớn hơn, ví dụ 80.000 bản ghi với 5% đáng ngờ, số lượt khớp là 4.000; nếu chỉ chặn được 50% thì còn 2.000 lượt phơi nhiễm, gấp 400 lần ngưỡng 5. Kẻ tấn công đổi một byte trong tệp là hash đổi hoàn toàn, còn tên miền thì sinh tự động theo ngày. Vì vậy IOC phải đi kèm hành vi: tệp mã hóa hàng loạt trong một phút, tiến trình con của Word gọi PowerShell, đăng nhập thành công từ hai quốc gia trong mười phút. Chỉ số lượng thôi chưa đủ, cần cả ngữ cảnh.",
      focus: ["grid", "signal", "alert"],
      edges: ["grid-signal", "shield-alert"],
      metrics: { hits: "4.000", blocked: "2.000", exposure: "2.000", verdict: "quá tải" },
      changes: ["Ca lớn cho 4.000 lượt khớp", "2.000 lượt vẫn phơi nhiễm"],
      note: "Mẫu IOC cũ đi kèm hành vi mới là thứ bắt được biến thể."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Thứ tự mới là bài học",
      body: "Tổng kết chuỗi điều tra: một mẫu IOC gồm hash, IP và tên miền được đối chiếu với 50.000 bản ghi, ra 1.000 lượt khớp; chặn tự động 90% giữ lại 900, còn 100 lượt phải xử lý tay vì vượt ngưỡng 5. Bài học nằm ở thứ tự: thu dấu vết trước, đối chiếu trên toàn bộ log, rồi mới chặn, và luôn giữ bản ghi gốc. Khi ca lớn lên 80.000 bản ghi, cùng cách làm cho 4.000 lượt khớp, cho thấy quy trình không đổi, chỉ có khối lượng tăng. Bài tiếp theo đi vào kỹ năng nền của mọi bước trên: đọc log và lọc nhiễu.",
      focus: "all",
      edges: "all",
      metrics: { hits: "1.000", blocked: "900", exposure: "100", verdict: "đóng sau 100" },
      changes: ["Đủ vòng đối chiếu, chặn, xử lý tay", "Mẫu IOC sẵn sàng chia sẻ"],
      note: "Con số 100 là việc còn lại của ca, không phải con số để báo cáo cho xong."
    }
  ]
};

window.SOCLAB.lessons["log"] = {
  id: "log",
  module: "dau-vet-tan-cong",
  title: "Đọc log và lọc nhiễu",
  shortTitle: "Đọc log",
  subtitle: "Ba nguồn log, 50.000 dòng và 2% đáng xem",
  blurb: "Log là nguồn sự thật duy nhất của ca trực nhưng phần lớn là nhiễu. Bài đi qua ba nguồn web, DNS và đăng nhập, cách tách trường, lọc luật có ghi lại và giữ 1.000 dòng đáng xem.",
  duration: "12 phút",
  level: "Cơ bản",
  tags: ["log", "DNS", "grep", "nhiễu", "tách trường"],
  metrics: [
    { key: "volume", label: "Dòng log", tone: "blue" },
    { key: "kept", label: "Dòng giữ lại", tone: "mint" },
    { key: "ratio", label: "Tỉ lệ giữ", tone: "yellow" },
    { key: "verdict", label: "Kết luận", tone: "coral" }
  ],
  nodes: [
    { id: "server", type: "server", x: 55, y: 80, w: 200, h: 70, label: "Máy chủ web", sub: "access.log 50.000 dòng" },
    { id: "api", type: "api", x: 340, y: 80, w: 200, h: 70, label: "Cổng gom log", sub: "syslog, agent" },
    { id: "code", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Bộ tách trường", sub: "thời gian, IP, mã lỗi" },
    { id: "grid", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Bộ lọc nhiễu", sub: "bỏ quét lặp, 404" },
    { id: "alert", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Cảnh báo thật", sub: "1.000 dòng cần xem" },
    { id: "file", type: "file", x: 625, y: 310, w: 200, h: 70, label: "Bản ghi gốc", sub: "giữ nguyên để đối chứng" },
    { id: "queue", type: "queue", x: 340, y: 310, w: 200, h: 70, label: "Hàng đợi", sub: "xếp theo mức ưu tiên" }
  ],
  edges: [
    { id: "server-api", from: "server", to: "api", kind: "data", label: "đẩy log" },
    { id: "api-code", from: "api", to: "code", kind: "data", label: "luồng thô" },
    { id: "code-grid", from: "code", to: "grid", kind: "data", label: "dòng đã tách" },
    { id: "grid-alert", from: "grid", to: "alert", kind: "request", label: "đẩy cảnh báo" },
    { id: "grid-queue", from: "grid", to: "queue", kind: "control", label: "xếp ưu tiên" },
    { id: "code-file", from: "code", to: "file", kind: "data", label: "lưu bản gốc" }
  ],
  learn: [
    "Ba nguồn cần đọc cùng lúc: <strong>web</strong> cho biết ai gọi, DNS cho biết đi đâu.",
    "Tách mỗi dòng thành trường <code>time, src, user, action, status</code> để lọc bằng máy.",
    "50.000 dòng sau khi bỏ mẫu lặp còn khoảng 1.000 dòng, đúng <strong>2%</strong>.",
    "Lọc là tạo khung nhìn, không phải xóa: luật lọc và số dòng bị loại phải được ghi."
  ],
  steps: [
    {
      short: "Ba nguồn",
      type: "concept",
      title: "Mỗi nguồn một câu hỏi",
      body: "Một ca trực nhận log từ ba nơi: máy chủ web ghi mỗi yêu cầu HTTP, máy chủ DNS ghi mỗi lần phân giải tên, hệ thống đăng nhập ghi mỗi lần xác thực. Cộng lại khoảng 50.000 dòng trong tám giờ, tức hơn 6.000 dòng mỗi giờ. Không ai đọc hết con số đó, nhưng cũng không được bỏ nguồn nào: log web cho biết ai gọi, log DNS cho biết máy gọi đi đâu, log đăng nhập cho biết kẻ tấn công vào bằng tài khoản nào. Bước đầu tiên của điều tra là biết mỗi nguồn trả lời câu hỏi gì.",
      focus: ["server", "api", "code"],
      edges: ["server-api", "api-code"],
      metrics: { volume: "50.000", kept: "50.000", ratio: "100%", verdict: "chưa lọc" },
      changes: ["Ba nguồn log được nối vào một cổng", "Xác định câu hỏi của từng nguồn"],
      note: "Thiếu một nguồn là mất một nửa câu chuyện, đừng bỏ DNS."
    },
    {
      short: "Tách trường",
      type: "flow",
      title: "Từ dòng thô đến trường",
      body: "Log thô rất khó so: mỗi nguồn một định dạng, thời gian một kiểu, tên trường một kiểu. Cổng gom log nhận cả ba luồng, rồi bộ tách trường chia mỗi dòng thành các phần cố định là thời điểm, địa chỉ nguồn, tài khoản, hành động và mã kết quả. Sau bước này, một dòng log trở thành <code>{time, src, user, action, status}</code> và có thể lọc bằng máy. Ví dụ lọc <code>status = 401</code> trên log đăng nhập cho ra danh sách đăng nhập thất bại, lọc <code>action = query</code> trên log DNS cho ra mọi tên miền máy đã hỏi.",
      focus: ["api", "code", "grid"],
      edges: ["api-code", "code-grid", "code-file"],
      metrics: { volume: "50.000", kept: "50.000", ratio: "100%", verdict: "đã tách" },
      changes: ["50.000 dòng được tách trường", "Bản gốc được lưu riêng"],
      note: "Tách trường sai múi giờ là lỗi sẽ trả giá ở bài dòng thời gian."
    },
    {
      short: "Lọc nhiễu",
      type: "detail",
      title: "Bỏ mẫu lặp, giữ tín hiệu",
      body: "Phần lớn log là nhiễu có quy luật: máy quét lỗ hổng nội bộ chạy mỗi phút, trình duyệt hỏi lại tên miền quảng cáo, giám sát gọi trang kiểm tra sức khỏe mỗi 30 giây. Nếu bỏ các mẫu lặp này, 50.000 dòng tụt còn khoảng 1.000 dòng đáng xem, đúng 2% và trùng với số lượt khớp IOC. Cách lọc an toàn là lọc theo luật có ghi lại, không xóa: ví dụ bỏ yêu cầu từ dải IP của máy quét, bỏ mã 404 lặp quá 100 lần mỗi phút từ cùng một IP. Người trực luôn giữ bản gốc để đối chứng.",
      focus: ["grid", "alert", "queue"],
      edges: ["code-grid", "grid-alert", "grid-queue"],
      metrics: { volume: "50.000", kept: "1.000", ratio: "2%", verdict: "đọc được" },
      changes: ["49.000 dòng nhiễu bị loại khỏi khung nhìn", "1.000 dòng vào hàng đợi"],
      note: "Luật lọc phải ghi kèm điều kiện và số dòng bị loại."
    },
    {
      short: "Lọc quá tay",
      type: "pitfall",
      title: "Sạch đến mức mất dấu",
      body: "Lỗi thường gặp là lọc cho sạch đến mức mất bằng chứng. Một người trực muốn bảng gọn đã xóa mọi dòng có mã 404, kể cả 12 dòng cho thấy kẻ tấn công dò đường dẫn quản trị trước khi vào được. Một người khác xóa log cũ để lấy dung lượng, làm mất đúng khoảng thời gian cần dựng lại. Nguyên tắc: lọc là tạo khung nhìn, không phải xóa dữ liệu; mọi bộ lọc phải ghi lại điều kiện và số dòng bị loại. Với 50.000 dòng, chỉ cần 12 dòng bị bỏ oan là đủ để kết luận sai về đường vào.",
      focus: ["code", "file", "grid"],
      edges: ["code-file", "code-grid"],
      metrics: { volume: "50.000", kept: "988", ratio: "2%", verdict: "mất 12 dòng" },
      changes: ["12 dòng dò quản trị bị loại oan", "Kết luận đường vào bị lệch"],
      note: "Dòng 404 hiếm khi vô nghĩa: đó là bước dò đường của kẻ tấn công."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Kỷ luật quan trọng hơn lệnh",
      body: "Tổng kết: ba nguồn log, 50.000 dòng mỗi ca, tách trường rồi lọc nhiễu có ghi lại, còn 1.000 dòng đáng xem, tương đương 2% và khớp đúng 1.000 lượt IOC. Chặn 90% để lại 900 lượt đã xử lý và 100 lượt cần làm tay. Giá trị của bài không nằm ở lệnh <code>grep</code> mà ở kỷ luật: biết nguồn nào trả lời câu hỏi gì, lọc bằng luật chứ không xóa, luôn giữ bản gốc. Có nền đó mới dựng được dòng thời gian ở bài sau, vì dòng thời gian chỉ đúng khi từng dòng log còn nguyên mốc thời gian.",
      focus: "all",
      edges: "all",
      metrics: { volume: "50.000", kept: "1.000", ratio: "2%", verdict: "sẵn sàng" },
      changes: ["Bộ lọc có ghi lại, bản gốc còn nguyên", "1.000 dòng chuyển sang dựng mốc"],
      note: "Nếu chỉ nhớ một điều: không bao giờ xóa log để bảng cho gọn."
    }
  ]
};

window.SOCLAB.lessons["timeline"] = {
  id: "timeline",
  module: "dau-vet-tan-cong",
  title: "Dựng dòng thời gian",
  shortTitle: "Dòng thời gian",
  subtitle: "Chuẩn hóa múi giờ, bỏ trùng và đọc khoảng trống",
  blurb: "Dòng thời gian biến 1.000 sự kiện rời rạc thành một câu chuyện đọc được. Bài đi qua chuẩn hóa múi giờ về UTC, gom và bỏ trùng, sắp trục và cách đọc khoảng trống 9 phút.",
  duration: "14 phút",
  level: "Trung cấp",
  tags: ["timeline", "UTC", "bỏ trùng", "khoảng trống", "bằng chứng"],
  metrics: [
    { key: "events", label: "Sự kiện", tone: "blue" },
    { key: "span", label: "Khoảng thời gian", tone: "mint" },
    { key: "gap", label: "Khoảng trống", tone: "coral" },
    { key: "verdict", label: "Kết luận", tone: "yellow" }
  ],
  nodes: [
    { id: "clock", type: "clock", x: 55, y: 80, w: 200, h: 70, label: "Đồng hồ máy chủ", sub: "lệch 7 giờ so với UTC" },
    { id: "file", type: "file", x: 340, y: 80, w: 200, h: 70, label: "Ba nguồn log", sub: "web, DNS, đăng nhập" },
    { id: "code", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Chuẩn hóa giờ", sub: "đổi hết về UTC" },
    { id: "grid", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Sắp theo giây", sub: "một trục thời gian" },
    { id: "event", type: "event", x: 55, y: 310, w: 200, h: 70, label: "Sự kiện rời", sub: "khó thấy nguyên nhân" },
    { id: "book", type: "book", x: 340, y: 310, w: 200, h: 70, label: "Dòng thời gian", sub: "một mạch liên tục" },
    { id: "alert", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Khoảng trống", sub: "thiếu log 9 phút" }
  ],
  edges: [
    { id: "clock-code", from: "clock", to: "code", kind: "data", label: "mốc đã đổi" },
    { id: "file-code", from: "file", to: "code", kind: "data", label: "gom sự kiện" },
    { id: "code-grid", from: "code", to: "grid", kind: "data", label: "sự kiện sạch" },
    { id: "event-book", from: "event", to: "book", kind: "control", label: "đối chiếu" },
    { id: "grid-book", from: "grid", to: "book", kind: "request", label: "nối mạch" },
    { id: "book-alert", from: "book", to: "alert", kind: "control", label: "thấy hở" }
  ],
  learn: [
    "Mọi mốc phải quy về một múi giờ, thường là <code>UTC</code>, trước khi sắp xếp.",
    "Gom theo khóa thời điểm, tài khoản và IP nguồn để <strong>bỏ trùng</strong> ba nguồn.",
    "1.000 sự kiện trải 6 giờ, trung bình khoảng 20 giây một sự kiện.",
    "Khoảng trống 9 phút cũng là bằng chứng: im lặng thường nghĩa là log đã bị tắt."
  ],
  steps: [
    {
      short: "Múi giờ",
      type: "concept",
      title: "Chốt một múi giờ duy nhất",
      body: "Dòng thời gian chỉ đáng tin khi mọi mốc đã về cùng một múi giờ. Trong ca điều tra, máy chủ web ghi theo UTC, tường lửa ghi theo giờ Việt Nam, còn máy trạm để giờ địa phương lệch 7 giờ. Ba nguồn, ba kiểu giờ, nếu ghép thẳng thì sự kiện xảy ra lúc 2 giờ sáng sẽ nằm sau sự kiện lúc 9 giờ. Bước đầu là ghi lại độ lệch của từng máy so với đồng hồ chuẩn, kiểm tra dịch vụ đồng bộ giờ đã chạy chưa, và chốt một múi giờ duy nhất là UTC cho toàn bộ hồ sơ.",
      focus: ["clock", "file", "code"],
      edges: ["clock-code", "file-code"],
      metrics: { events: "1.000", span: "6 giờ", gap: "chưa rõ", verdict: "lệch 7 giờ" },
      changes: ["Ghi nhận lệch 7 giờ ở máy trạm", "Chốt UTC làm múi giờ hồ sơ"],
      note: "Đừng đổi giờ từng sự kiện bằng tay, hãy đổi ở bước nạp dữ liệu."
    },
    {
      short: "Bỏ trùng",
      type: "flow",
      title: "Gom sự kiện, bỏ bản trùng",
      body: "Ba nguồn log cho 1.000 sự kiện đáng xem sau khi lọc. Bước gom phải bỏ trùng: một lần đăng nhập sai xuất hiện ở cả log web, log xác thực và log của proxy, nếu cộng thô sẽ thành ba sự kiện. Cách làm là gom theo khóa gồm thời điểm làm tròn đến giây, tài khoản và địa chỉ nguồn; bản ghi nào trùng khóa thì giữ bản có nhiều trường nhất và ghi chú nguồn gốc. Kết quả là một danh sách phẳng, mỗi dòng một sự kiện, đủ trường để sắp xếp và đủ nguồn để kiểm chứng khi cần.",
      focus: ["file", "code", "grid"],
      edges: ["file-code", "code-grid"],
      metrics: { events: "1.000", span: "6 giờ", gap: "chưa sắp", verdict: "đã bỏ trùng" },
      changes: ["Ba bản ghi trùng gộp thành một", "Danh sách sự kiện phẳng ra đời"],
      note: "Bỏ trùng sai khóa sẽ nuốt mất sự kiện thật, luôn giữ nguồn gốc."
    },
    {
      short: "Sắp trục",
      type: "detail",
      title: "Đọc mạch sự kiện",
      body: "1.000 sự kiện được sắp tăng dần theo UTC, cách nhau trung bình khoảng 20 giây trong khoảng 6 giờ của ca. Đọc theo trục cho ra câu chuyện: 2 giờ 03 phút có đăng nhập từ IP lạ, 2 giờ 05 phút có tệp lạ xuất hiện, 2 giờ 11 phút có 300 tệp bị đổi phần mở rộng. Mỗi mốc phải kèm nguồn, nếu không thì chỉ là phỏng đoán. Khi hai sự kiện cách nhau quá xa, đừng vội nối chúng; hãy tìm sự kiện trung gian trong log DNS hoặc log tiến trình. Dòng thời gian tốt trả lời được câu hỏi vào lúc nào, bằng gì và từ đâu.",
      focus: ["grid", "book", "event"],
      edges: ["code-grid", "event-book", "grid-book"],
      metrics: { events: "1.000", span: "6 giờ", gap: "chưa thấy", verdict: "có mạch" },
      changes: ["Ba mốc chính hiện trên trục", "Câu chuyện vào, dừng, mã hóa rõ dần"],
      note: "Mỗi mốc cần nguồn và cần một mốc trước đó giải thích vì sao nó xảy ra."
    },
    {
      short: "Khoảng trống",
      type: "pitfall",
      title: "Chín phút im lặng",
      body: "Điều nguy hiểm nhất trên dòng thời gian không phải sự kiện lạ mà là khoảng trống. Trong ca mẫu, từ 2 giờ 11 phút đến 2 giờ 20 phút không có dòng log nào từ máy kế toán, đúng 9 phút. Nhiều người trực coi đó là máy nghỉ, nhưng thường là agent ghi log bị dừng, hoặc kẻ tấn công đã tắt dịch vụ ghi log trước khi mã hóa. Cách kiểm: so với máy khác cùng dải mạng, xem có log nhịp tim không, và đối chiếu thời điểm dịch vụ khởi động lại. Khoảng trống 9 phút ấy chính là chỗ cần giải thích trong báo cáo.",
      focus: ["book", "alert", "clock"],
      edges: ["grid-book", "book-alert"],
      metrics: { events: "1.000", span: "6 giờ", gap: "9 phút", verdict: "phải giải thích" },
      changes: ["Khoảng trống 9 phút hiện rõ", "Nghi vấn dịch vụ ghi log bị tắt"],
      note: "Khoảng trống không phải chỗ trống trong báo cáo, đó là chỗ cần lời giải."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Im lặng cũng là bằng chứng",
      body: "Tổng kết: dòng thời gian gồm 1.000 sự kiện đã bỏ trùng, trải 6 giờ, tất cả quy về UTC, và có một khoảng trống 9 phút phải giải thích. Ba bước không thể đảo: chuẩn hóa múi giờ, gom và bỏ trùng, rồi mới sắp trục. Bài học lớn nhất là khoảng trống cũng là bằng chứng; im lặng 9 phút đáng chú ý ngang một dòng lỗi. Khi dòng thời gian đã đứng vững, bước tiếp theo là quyết định khoanh vùng và cô lập máy nào, theo thứ tự nào, để không cắt nhầm dịch vụ đang chạy.",
      focus: "all",
      edges: "all",
      metrics: { events: "1.000", span: "6 giờ", gap: "9 phút", verdict: "đủ mạch" },
      changes: ["Hồ sơ thời gian thống nhất một múi giờ", "Khoảng trống được đưa vào báo cáo"],
      note: "Dòng thời gian không cần đẹp, chỉ cần mỗi mốc đứng được khi bị hỏi lại."
    }
  ]
};

window.SOCLAB.lessons["containment"] = {
  id: "containment",
  module: "dau-vet-tan-cong",
  title: "Khoanh vùng và cô lập",
  shortTitle: "Cô lập",
  subtitle: "Chặn lây lan mà không mất bằng chứng",
  blurb: "Khoanh vùng trả lời còn máy nào đã chạm dấu vết, cô lập trả lời cắt đường nào trước. Bài đi qua thu bằng chứng, ba lát cắt phạm vi, cô lập theo thứ tự và cái giá của việc tắt máy quá sớm.",
  duration: "13 phút",
  level: "Trung cấp",
  tags: ["containment", "cô lập", "khoanh vùng", "bằng chứng", "subnet"],
  metrics: [
    { key: "scope", label: "Phạm vi", tone: "blue" },
    { key: "isolated", label: "Đã cô lập", tone: "mint" },
    { key: "exposure", label: "Còn hở", tone: "coral" },
    { key: "verdict", label: "Kết luận", tone: "yellow" }
  ],
  nodes: [
    { id: "alert", type: "alert", x: 55, y: 80, w: 200, h: 70, label: "Máy nhiễm", sub: "mã hóa tệp 2 giờ sáng" },
    { id: "grid", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Khoanh vùng", sub: "theo IOC và subnet" },
    { id: "shield", type: "shield", x: 625, y: 80, w: 200, h: 70, label: "Cô lập mạng", sub: "chặn cổng, giữ log" },
    { id: "server", type: "server", x: 340, y: 195, w: 200, h: 70, label: "Máy chủ nội bộ", sub: "dữ liệu kế toán" },
    { id: "key", type: "key", x: 55, y: 310, w: 200, h: 70, label: "Thu hồi khóa", sub: "mật khẩu, token" },
    { id: "check", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Quét lại", sub: "xác minh đã sạch" },
    { id: "audit", type: "audit", x: 625, y: 310, w: 200, h: 70, label: "Ghi bằng chứng", sub: "ảnh đĩa, mã hash" }
  ],
  edges: [
    { id: "alert-grid", from: "alert", to: "grid", kind: "data", label: "báo máy nhiễm" },
    { id: "grid-shield", from: "grid", to: "shield", kind: "request", label: "lệnh cô lập" },
    { id: "shield-server", from: "shield", to: "server", kind: "control", label: "cắt truy cập" },
    { id: "grid-key", from: "grid", to: "key", kind: "control", label: "thu hồi" },
    { id: "shield-check", from: "shield", to: "check", kind: "request", label: "xác minh" },
    { id: "check-audit", from: "check", to: "audit", kind: "data", label: "lưu bằng chứng" }
  ],
  learn: [
    "Cô lập là cắt đường liên lạc với máy chủ điều khiển, không phải <strong>tắt máy</strong>.",
    "Khoanh vùng bằng ba lát: cùng hash, cùng IP điều khiển, cùng tài khoản.",
    "Ba máy cùng dải mạng bị cô lập theo thứ tự, giữ log và thu hồi token.",
    "Thu bằng chứng trước, cô lập sau; cài lại hệ điều hành là mất <code>hash</code>."
  ],
  steps: [
    {
      short: "Giữ trạng thái",
      type: "concept",
      title: "Đừng rút dây quá sớm",
      body: "Khi xác nhận máy kế toán bị mã hóa tệp, phản xạ đầu tiên là rút dây mạng. Việc đó dừng lây lan nhưng cũng xóa mất phiên làm việc đang mở và có thể làm mất bộ nhớ chứa mã độc. Bước đúng là ghi lại trạng thái trước: ảnh đĩa, danh sách tiến trình, kết nối mạng đang mở, rồi mới cô lập bằng cách chặn ở tường lửa hoặc chuyển sang mạng cách ly. Cô lập mục tiêu là cắt đường liên lạc với máy chủ điều khiển, không phải tắt máy. Giữ máy chạy để còn quan sát.",
      focus: ["alert", "shield", "audit"],
      edges: ["alert-grid", "grid-shield"],
      metrics: { scope: "1 máy", isolated: "0", exposure: "1", verdict: "chưa cô lập" },
      changes: ["Ảnh đĩa và danh sách tiến trình được thu", "Máy vẫn chạy để quan sát"],
      note: "Tắt máy là mất dữ liệu bộ nhớ, thứ thường quý hơn ổ đĩa."
    },
    {
      short: "Khoanh vùng",
      type: "flow",
      title: "Ba lát cắt phạm vi",
      body: "Khoanh vùng là trả lời câu hỏi còn máy nào khác đã chạm cùng dấu vết. Từ mẫu IOC của máy đầu tiên, nhóm điều tra quét toàn bộ 50.000 bản ghi và thấy 1.000 lượt khớp, tập trung ở ba máy cùng một dải mạng nội bộ. Cách khoanh vùng đáng tin là kết hợp ba lát: cùng hash tệp, cùng máy chủ điều khiển, và cùng tài khoản đăng nhập trong khung 6 giờ. Ba lát giao nhau cho danh sách ngắn, tránh cô lập cả phòng kế toán vì một máy. Phạm vi ban đầu thường hẹp hơn cảm giác và rộng hơn một máy.",
      focus: ["alert", "grid", "server"],
      edges: ["alert-grid", "shield-server"],
      metrics: { scope: "3 máy", isolated: "1", exposure: "2", verdict: "đã khoanh" },
      changes: ["Ba máy cùng dải mạng được xác định", "Hai máy chờ lệnh cô lập"],
      note: "Ba lát giao nhau tốt hơn một lát rất mạnh, vì một lát dễ trùng giả."
    },
    {
      short: "Cô lập",
      type: "detail",
      title: "Cắt theo thứ tự, giữ log",
      body: "Ba máy trong phạm vi được cô lập theo thứ tự: máy đang mã hóa trước, hai máy còn lại sau, mỗi lần cách nhau vài phút để theo dõi phản ứng. Cô lập gồm chặn toàn bộ lưu lượng ra ngoài trừ kênh quản trị nội bộ, giữ nguyên log, và thu hồi token của tài khoản liên quan. Máy chủ nội bộ chứa dữ liệu kế toán được chặn truy cập từ ba máy này nhưng vẫn chạy cho người khác. Sau khi cô lập, 900 trong 1.000 lượt khớp đã bị chặn, còn 100 lượt nằm ở máy chưa xác định, buộc phải quét tiếp.",
      focus: ["grid", "shield", "key", "check"],
      edges: ["grid-shield", "shield-server", "grid-key", "shield-check"],
      metrics: { scope: "3 máy", isolated: "3", exposure: "0 trên 3 máy", verdict: "đã cắt" },
      changes: ["Ba máy bị cắt lưu lượng ra ngoài", "Token của tài khoản liên quan bị thu hồi"],
      note: "Giữ kênh quản trị nội bộ để còn thu thập log từ máy đã cô lập."
    },
    {
      short: "Mất dấu",
      type: "pitfall",
      title: "Cô lập mà xóa dấu vết",
      body: "Hai lỗi hay đi cùng nhau: cô lập bằng cách tắt máy, và cài lại hệ điều hành để dọn nhanh. Tắt máy làm mất dữ liệu bộ nhớ như danh sách kết nối và tiến trình ẩn; cài lại thì mất luôn tệp mã độc, không còn hash để đối chiếu. Trong ca lớn 80.000 bản ghi với 5% khớp, nếu chỉ chặn được 50% thì 2.000 lượt vẫn phơi nhiễm; lúc đó bằng chứng trên máy là thứ duy nhất giúp mở rộng phạm vi. Nguyên tắc: thu bằng chứng trước, cô lập sau, và ghi lại mọi lệnh đã chạy trên máy.",
      focus: ["audit", "shield", "check"],
      edges: ["shield-check", "check-audit"],
      metrics: { scope: "3 máy", isolated: "3", exposure: "2.000 lượt", verdict: "hở rộng" },
      changes: ["2.000 lượt hở lộ ra khi chặn thiếu", "Máy bị cài lại mất hash đối chiếu"],
      note: "Một ảnh đĩa giá trị hơn mười lần cài lại hệ điều hành."
    },
    {
      short: "Tổng kết",
      type: "final",
      tone: "final",
      title: "Thứ tự quyết định bằng chứng",
      body: "Tổng kết: từ một máy bị mã hóa, khoanh vùng theo ba lát cắt cho ra ba máy cùng dải mạng, cô lập theo thứ tự, chặn được 900 trong 1.000 lượt khớp và còn 100 lượt phải quét tiếp. Sự cố chỉ đóng khi 100 lượt đó về 0 hoặc dưới ngưỡng 5. Bài học là thứ tự: ghi bằng chứng, khoanh vùng, cô lập, xác minh, rồi mới khôi phục. Làm ngược thứ tự thì nhanh hơn nhưng mất khả năng chứng minh. Đây cũng là cầu nối sang phần báo cáo sự cố, nơi mỗi bước trên cần một mốc thời gian và một bằng chứng.",
      focus: "all",
      edges: "all",
      metrics: { scope: "3 máy", isolated: "3", exposure: "100 lượt", verdict: "còn quét" },
      changes: ["Ba máy cô lập, log còn nguyên", "100 lượt hở được đưa vào kế hoạch quét"],
      note: "Khôi phục sớm hơn xác minh là mở lại đúng cánh cửa vừa đóng."
    }
  ]
};

window.SOCLAB.practice.push(
  {
    id: "soc-ioc-count",
    module: "dau-vet-tan-cong",
    tag: "IOC",
    title: "Còn bao nhiêu lượt chưa chặn",
    scenario: "Sau khi chặn một chiến dịch phát tán, nhóm trực đối chiếu danh sách IOC với log tường lửa của ca. Có 50.000 bản ghi, tỉ lệ đáng ngờ 2%, và hệ thống tự động chặn 90% số lượt khớp; mỗi lượt khớp là một lần máy nội bộ liên lạc với hạ tầng của kẻ tấn công. Trưởng ca hỏi còn bao nhiêu lượt chưa được chặn để quyết định có mở sự cố hay không, biết ngưỡng chấp nhận của phòng là 5 lượt phơi nhiễm. Kết quả phải ghi rõ số lượt khớp, số đã chặn và số còn lại.",
    metrics: [
      { label: "Bản ghi", value: "50.000" },
      { label: "Khớp IOC", value: "1.000" },
      { label: "Đã chặn", value: "900" }
    ],
    options: [
      "Còn 100 lượt, vượt ngưỡng 5 nên sự cố vẫn mở.",
      "Còn 1.000 lượt, vì chưa chặn được lượt nào.",
      "Còn 900 lượt, đúng bằng số lượt đã chặn.",
      "Còn 5 lượt, đúng bằng ngưỡng nên đóng được."
    ],
    correct: 0,
    explain: "Đáp án đúng là 100 lượt. Trước hết lấy 50.000 nhân 2% được 1.000 lượt khớp IOC; sau đó 1.000 nhân 90% được 900 lượt đã chặn; phần còn lại là <code>1.000 − 900 = 100</code> lượt chưa chặn. Vì 100 lớn hơn ngưỡng 5 rất nhiều, sự cố phải tiếp tục mở và cần xử lý tay từng lượt. Phương án 1.000 bỏ qua bước chặn nên sai; phương án 900 nhầm số đã chặn thành số còn hở; phương án 5 hiểu sai ngưỡng, ngưỡng là mức chấp nhận chứ không phải kết quả. Con số 100 cũng cho thấy chặn tự động 90% chưa đủ cho một ca lớn."
  },
  {
    id: "soc-log-signal",
    module: "dau-vet-tan-cong",
    tag: "LOG",
    title: "Bộ lọc DNS có che dấu vết",
    scenario: "Một máy trạm liên tục gọi ra tên miền lạ, nhưng bảng cảnh báo lại im lặng vì bộ lọc đã bỏ mọi truy vấn DNS trùng lặp trong 5 phút. Ca trực có 10.000 dòng log, tỉ lệ khớp IOC 1%, và hệ thống đã chặn 99% số lượt khớp. Trưởng ca yêu cầu đánh giá xem có phải mở sự cố hay không, đồng thời kiểm tra xem bộ lọc có đang che mất dấu vết thật. Người trực phải quyết định trong ca này và ghi lại căn cứ. Mọi kết luận cần dẫn được tới dòng log gốc.",
    metrics: [
      { label: "Dòng log", value: "10.000" },
      { label: "Khớp IOC", value: "100" },
      { label: "Còn hở", value: "1" }
    ],
    options: [
      "Mở sự cố ngay vì bộ lọc DNS luôn che dấu vết.",
      "Đóng ca vì 1.000 lượt khớp đã được chặn hết.",
      "Chỉ còn 1 lượt phơi nhiễm, dưới ngưỡng 5, nhưng vẫn phải rà lại luật lọc DNS.",
      "Đóng ca vì 99% là tỉ lệ chặn đủ tốt, không cần xem log."
    ],
    correct: 2,
    explain: "Đáp án đúng là phương án nêu 1 lượt phơi nhiễm và yêu cầu rà lại luật lọc. Phép tính: 10.000 nhân 1% được 100 lượt khớp, 100 nhân 99% được 99 lượt đã chặn, còn <code>100 − 99 = 1</code> lượt. Vì 1 nhỏ hơn ngưỡng 5 nên phơi nhiễm đạt mức chấp nhận, không cần mở sự cố lớn. Tuy vậy bộ lọc bỏ truy vấn trùng trong 5 phút có thể che chuỗi gọi ra đều đặn của mã độc, nên vẫn phải kiểm tra luật lọc. Phương án mở sự cố ngay là phản ứng thái quá; phương án đóng ca vì 1.000 lượt là tính sai; phương án bỏ qua log là bỏ bằng chứng."
  },
  {
    id: "soc-timeline-offset",
    module: "dau-vet-tan-cong",
    tag: "TIMELINE",
    title: "Dòng thời gian chạy ngược",
    scenario: "Hai nguồn log của cùng một sự cố được ghép lại: tường lửa ghi theo giờ Việt Nam, máy chủ web ghi theo UTC. Kết quả ban đầu cho thấy máy bị mã hóa trước khi kẻ tấn công đăng nhập, một chuỗi vô lý. Có 1.000 sự kiện đáng xem trải trên 6 giờ và một khoảng trống 9 phút chưa giải thích. Nhóm trực phải sửa dòng thời gian trước khi viết báo cáo. Sai một mốc là sai toàn bộ kết luận về đường vào và thứ tự thiệt hại. Trưởng ca yêu cầu nêu rõ bước sửa và căn cứ.",
    metrics: [
      { label: "Sự kiện", value: "1.000" },
      { label: "Khoảng trống", value: "9 phút" },
      { label: "Lệch giờ", value: "7 giờ" }
    ],
    options: [
      "Đổi giờ máy chủ web sang giờ Việt Nam cho khớp tường lửa.",
      "Chuẩn hóa mọi mốc về UTC rồi sắp lại, sau đó giải thích khoảng trống 9 phút.",
      "Bỏ các sự kiện trong khoảng trống 9 phút vì không có log.",
      "Sắp theo thứ tự xuất hiện trong tệp log thay vì theo thời gian."
    ],
    correct: 1,
    explain: "Đáp án đúng là chuẩn hóa về UTC rồi sắp lại. Múi giờ là gốc của lỗi: 9 giờ sáng giờ Việt Nam là 2 giờ sáng UTC, nên ghép thẳng hai nguồn sẽ đảo thứ tự. Sau khi đổi hết về UTC, 1.000 sự kiện xếp đúng trục trong 6 giờ và khoảng trống 9 phút hiện ra đúng chỗ. Phương án đổi máy chủ web sang giờ Việt Nam chỉ đổi chỗ lệch, không giải quyết gốc và dễ sai khi có thêm nguồn khác. Phương án bỏ sự kiện trong khoảng trống là xóa bằng chứng. Phương án sắp theo thứ tự tệp là sai vì tệp log không được ghi theo thời gian."
  },
  {
    id: "soc-contain-order",
    module: "dau-vet-tan-cong",
    tag: "CONTAIN",
    title: "Ba máy đang mã hóa",
    scenario: "Một chiến dịch mã hóa tống tiền đang lan trong dải mạng kế toán. Log của ca có 80.000 bản ghi, tỉ lệ đáng ngờ 5%, hệ thống mới chặn được 50% số lượt khớp vì danh sách IOC cập nhật chậm. Có ba máy đang mã hóa tệp và hai máy chủ nội bộ chứa dữ liệu. Còn 2.000 lượt chưa bị chặn nếu không xử lý thêm. Mỗi phút chậm là thêm tệp bị mã hóa. Trưởng ca yêu cầu chọn cách xử lý vừa cắt lây lan vừa giữ được bằng chứng. Quyết định phải nêu thứ tự hành động.",
    metrics: [
      { label: "Bản ghi", value: "80.000" },
      { label: "Khớp IOC", value: "4.000" },
      { label: "Còn hở", value: "2.000" }
    ],
    options: [
      "Tắt nguồn ba máy ngay để dừng mã hóa, sau đó cài lại hệ điều hành.",
      "Xóa log cũ và tắt dịch vụ ghi log để giải phóng dung lượng.",
      "Chặn nốt phần còn lại bằng cách nâng ngưỡng lọc, không cần cô lập máy.",
      "Thu bằng chứng, cô lập ba máy và chặn bổ sung theo subnet, giữ log cho tới khi quét xong 2.000 lượt còn hở."
    ],
    correct: 3,
    explain: "Đáp án đúng là thu bằng chứng rồi cô lập, chặn bổ sung và giữ log. Phép tính cho thấy 80.000 nhân 5% là 4.000 lượt khớp, chỉ 2.000 lượt bị chặn, còn 2.000 lượt phơi nhiễm, gấp 400 lần ngưỡng 5, nên phải mở rộng chặn theo dải mạng. Tắt nguồn làm mất dữ liệu bộ nhớ và có thể để lại tệp mã hóa chưa ghi xong; cài lại hệ điều hành thì mất luôn hash để đối chiếu. Xóa log là phá bằng chứng. Nâng ngưỡng lọc chỉ làm cảnh báo im đi, không giảm số lượt gọi ra ngoài. Vì vậy thứ tự đúng là ghi bằng chứng, cô lập, chặn bổ sung, rồi xác minh."
  }
);

window.SOCLAB.cheatsheets.push({
  id: "forensics",
  num: "02",
  title: "Điều tra dấu vết",
  intro: "Bảng tra dùng ngay trong ca trực: nguồn log nào trả lời câu hỏi gì, mẫu IOC theo từng loại, lệnh lọc nhanh, checklist khoanh vùng và các mốc thời gian cần chuẩn hóa trước khi dựng dòng thời gian.",
  cards: [
    {
      title: "Chọn nguồn log theo câu hỏi",
      wide: true,
      html: "<table><thead><tr><th>Câu hỏi</th><th>Nguồn log</th><th>Trường cần xem</th></tr></thead><tbody><tr><td>Ai gọi vào?</td><td>Tường lửa, proxy</td><td>IP nguồn, cổng, mã phản hồi</td></tr><tr><td>Máy gọi đi đâu?</td><td>DNS, proxy</td><td>tên miền, IP đích, kích thước</td></tr><tr><td>Vào bằng tài khoản nào?</td><td>Xác thực, VPN</td><td>tài khoản, mã 401/4625</td></tr><tr><td>Chạy gì trên máy?</td><td>EDR, tiến trình</td><td>dòng lệnh, tiến trình cha</td></tr></tbody></table>"
    },
    {
      title: "Mẫu IOC theo loại dấu vết",
      html: "<table><thead><tr><th>Loại</th><th>Ví dụ</th><th>So khớp</th></tr></thead><tbody><tr><td>Hash tệp</td><td><code>SHA-256</code> đầy đủ</td><td>tuyệt đối</td></tr><tr><td>IP điều khiển</td><td><code>203.0.113.44</code></td><td>chuỗi, kèm cổng</td></tr><tr><td>Tên miền</td><td><code>cdn-hoadon.top</code></td><td>hậu tố</td></tr><tr><td>Hành vi</td><td>300 tệp đổi đuôi trong 1 phút</td><td>ngưỡng đếm</td></tr></tbody></table>"
    },
    {
      title: "Lệnh lọc nhanh trên log",
      wide: true,
      html: "<pre><code># đếm theo mã trạng thái\ngrep -o 'status=[0-9]*' access.log | sort | uniq -c | sort -rn\n\n# tên miền bị hỏi nhiều nhất\ngrep 'action=query' dns.log | awk '{print $5}' | sort | uniq -c | sort -rn | head -20\n\n# đăng nhập thất bại theo tài khoản\njq -r 'select(.status==401) | .user' auth.jsonl | sort | uniq -c | sort -rn</code></pre>"
    },
    {
      title: "Checklist khoanh vùng và cô lập",
      html: "<ul><li>Chụp ảnh đĩa và lưu danh sách tiến trình trước khi chặn.</li><li>Khoanh vùng theo ba lát: hash, IP điều khiển, tài khoản.</li><li>Cô lập máy đang mã hóa trước, cách nhau vài phút.</li><li>Giữ kênh quản trị nội bộ để thu log, chặn mọi lối ra khác.</li><li>Thu hồi token, đổi mật khẩu tài khoản liên quan.</li><li>Quét lại toàn dải, chỉ khôi phục khi số lượt hở dưới 5.</li></ul>"
    },
    {
      title: "Mốc thời gian phải chuẩn hóa",
      html: "<ul><li>Ghi độ lệch của từng máy so với đồng hồ chuẩn.</li><li>Đổi mọi mốc về <code>UTC</code> trước khi sắp xếp.</li><li>Làm tròn đến giây khi gom và bỏ trùng.</li><li>Đánh dấu khoảng trống, không lấp bằng phỏng đoán.</li></ul>"
    }
  ]
});
