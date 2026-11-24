/* SOCLab - dữ liệu phần 1: module Đọc cảnh báo */
window.SOCLAB = window.SOCLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const T = window.SOCLAB;

  T.modules.push({
    id: "doc-canh-bao",
    num: "01",
    tone: "blue",
    title: "Đọc cảnh báo",
    blurb: "Bốn bài mở đầu của ca trực: hàng đợi cảnh báo, phân biệt thật với báo nhầm, xếp ưu tiên theo tác động và đo tải ca tám giờ. Mỗi bài có sơ đồ sáu đến bảy nút, năm bước phân tích và một tình huống luyện trước khi vào phòng mô phỏng.",
    lessons: ["canh-bao", "phan-loai", "uu-tien", "ca-truc"]
  });

  T.lessons["canh-bao"] = {
    id: "canh-bao",
    module: "doc-canh-bao",
    title: "Hàng đợi cảnh báo",
    shortTitle: "Hàng đợi",
    subtitle: "Một ca 120 cảnh báo và chỗ nên bắt đầu đọc",
    blurb: "Cảnh báo đến từ nhiều công cụ, còn người trực chỉ có một ca tám giờ. Bài đi qua hàng đợi: nguồn sinh, cách gộp mục trùng, chỗ nghẽn và vì sao phải đọc theo thứ tự thay vì theo thời gian.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["hàng đợi", "ca trực", "gộp trùng", "tải ca", "quy trình"],
    metrics: [
      { key: "alerts", label: "Cảnh báo", tone: "blue" },
      { key: "trueAlerts", label: "Mục thật", tone: "yellow" },
      { key: "hours", label: "Giờ cần", tone: "coral" },
      { key: "verdict", label: "Kết luận", tone: "mint" }
    ],
    nodes: [
      { id: "signal", type: "signal", x: 55, y: 80, w: 200, h: 70, label: "Tín hiệu thô", sub: "EDR, IDS, firewall" },
      { id: "queue", type: "queue", x: 340, y: 80, w: 200, h: 70, label: "Hàng đợi cảnh báo", sub: "120 cảnh báo mỗi ca" },
      { id: "user", type: "user", x: 625, y: 80, w: 200, h: 70, label: "Analyst trực ca", sub: "một người, ca 8 giờ" },
      { id: "clock", type: "clock", x: 340, y: 195, w: 200, h: 70, label: "Đồng hồ ca trực", sub: "480 phút mỗi ca" },
      { id: "event", type: "event", x: 55, y: 310, w: 200, h: 70, label: "Sự kiện nền", sub: "log không sinh cảnh báo" },
      { id: "check", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Sàng trùng", sub: "gộp cảnh báo cùng máy" },
      { id: "alert", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "Cảnh báo tồn", sub: "dồn sang ca sau" }
    ],
    edges: [
      { id: "signal-queue", from: "signal", to: "queue", kind: "data", label: "đẩy cảnh báo" },
      { id: "signal-event", from: "signal", to: "event", kind: "data", label: "ghi log nền" },
      { id: "queue-user", from: "queue", to: "user", kind: "request", label: "mở hàng đợi" },
      { id: "clock-user", from: "clock", to: "user", kind: "data", label: "đếm giờ" },
      { id: "queue-check", from: "queue", to: "check", kind: "request", label: "sàng trùng" },
      { id: "check-alert", from: "check", to: "alert", kind: "control", label: "dồn ca sau" },
      { id: "user-check", from: "user", to: "check", kind: "control", label: "đánh dấu xong" }
    ],
    learn: [
      "Một ca tám giờ nhận khoảng 120 cảnh báo từ hơn mười nguồn khác nhau.",
      "Sức chứa của ca là 480 phút chia 15 phút, tức 32 cảnh báo thật.",
      "Gộp cảnh báo trùng theo máy, tài khoản và khung 5 phút trước khi đọc.",
      "Mọi mục phải treo sang ca sau đều cần trạng thái, lý do và người nhận."
    ],
    steps: [
      {
        short: "Cảnh báo",
        type: "concept",
        title: "Cảnh báo không phải sự cố",
        body: "Mỗi công cụ trong hệ thống tự sinh cảnh báo theo luật riêng: EDR báo tiến trình lạ, tường lửa báo kết nối ra ngoài, hệ thống đăng nhập báo mười lần sai mật khẩu. Một ca tám giờ nhận khoảng <code>120</code> cảnh báo như vậy, đến từ hơn mười nguồn và không nguồn nào biết nguồn kia vừa báo gì. Cảnh báo chỉ là dấu hiệu cần xem, chưa phải sự cố đã xảy ra. Người trực phải biến đám dấu hiệu rời rạc thành hàng đợi có thứ tự, biết mục nào xem trước. Sai lầm quen thuộc là coi mọi cảnh báo đều khẩn cấp rồi chạy theo cái vừa hiện, trong khi mục cũ hơn và nặng hơn vẫn nằm im ở cuối danh sách.",
        focus: ["signal", "queue"],
        edges: ["signal-queue"],
        metrics: { alerts: "120", trueAlerts: "chưa đếm", hours: "chưa tính", verdict: "hỗn loạn" },
        changes: ["Hàng đợi mở với 120 mục", "Chưa có thứ tự ưu tiên"],
        note: "Cảnh báo là câu hỏi, không phải câu trả lời; đừng đóng mục nào trước khi đọc log."
      },
      {
        short: "Sức ca",
        type: "flow",
        title: "Chia việc cho một người",
        body: "Hàng đợi mở ra với <code>120</code> mục và một analyst duy nhất trong ca 480 phút. Mỗi cảnh báo thật tốn khoảng 15 phút để mở log, đối chiếu tài sản, gọi chủ máy và đóng phiếu, nên sức chứa lý thuyết của ca chỉ là 480 chia 15, tức 32 cảnh báo thật. Con số 32 nhỏ hơn nhiều so với hàng đợi, nghĩa là ngay từ phút đầu người trực đã phải chọn chứ không thể làm hết. Cách xếp hợp lý là đưa cảnh báo chạm tài khoản quản trị và máy chủ ra trước, gom các mục cùng máy vào một phiếu, còn phần lớn cảnh báo quét lịch thì đóng bằng một lần kiểm tra chung.",
        focus: ["queue", "user", "clock"],
        edges: ["queue-user", "clock-user"],
        metrics: { alerts: "120", trueAlerts: "32 là trần", hours: "8", verdict: "thiếu chỗ" },
        changes: ["Sức ca tính ra 32 cảnh báo thật", "Người trực buộc phải chọn"],
        note: "480 chia 15 bằng 32, hãy nhớ con số này trước khi mở bất kỳ hàng đợi nào."
      },
      {
        short: "Gộp trùng",
        type: "detail",
        title: "Sàng trùng trước khi đọc",
        body: "Trước khi mở từng cảnh báo, hãy gộp những mục nói về cùng một sự việc. Một máy bị quét cổng có thể sinh 25 cảnh báo trong ba phút, tất cả cùng địa chỉ và cùng tiến trình; đọc riêng từng mục chỉ tốn 25 lần công cho một câu trả lời. Bước sàng dùng ba khóa: địa chỉ máy, tài khoản liên quan và khung thời gian 5 phút. Sau khi gộp, hàng đợi 120 mục thường co lại còn khoảng 60 phiếu, mỗi phiếu có bằng chứng đi kèm. Nhật ký nền không sinh cảnh báo vẫn phải giữ, vì khi một phiếu được xác nhận là thật, chính log nền là thứ dựng lại dòng thời gian.",
        focus: ["queue", "check", "event"],
        edges: ["queue-check", "signal-event"],
        metrics: { alerts: "120", trueAlerts: "60 phiếu", hours: "15", verdict: "gọn hơn" },
        changes: ["120 mục gộp còn 60 phiếu", "Log nền được giữ làm bằng chứng"],
        note: "Gộp theo máy và tài khoản trước, đừng gộp theo tên luật vì dễ bỏ mất mục thật."
      },
      {
        short: "Dồn ca",
        type: "pitfall",
        title: "Dồn việc sang ca sau",
        body: "Khi hàng đợi vượt sức ca, phản xạ dễ thấy là đẩy phần còn lại sang ca sau rồi ghi một dòng ngắn. Nhưng cảnh báo tồn không tự mất: sang ca sau chúng nằm chung với 120 cảnh báo mới, và người trực kế tiếp không biết mục nào đã xem dở, mục nào chưa ai mở. Sau ba ca, hàng đợi phình lên vài trăm mục, thời gian tìm lại ngữ cảnh còn lớn hơn thời gian xử lý. Cách bàn giao đúng là mỗi mục tồn phải có trạng thái, lý do treo và người chịu trách nhiệm. Chỉ khi đó việc dồn ca mới là quyết định có kiểm soát thay vì che chỗ nghẽn.",
        focus: ["check", "alert", "user"],
        edges: ["check-alert", "user-check"],
        metrics: { alerts: "120", trueAlerts: "60 phiếu", hours: "15", verdict: "dồn ca" },
        changes: ["Phần tồn chuyển sang ca sau", "Mất ngữ cảnh nếu không ghi trạng thái"],
        note: "Dòng ghi 'còn 40 mục' không phải bàn giao, nó chỉ là danh sách việc cho người sau."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Một ca, một hàng đợi",
        body: "Tổng kết bài đầu: một ca tám giờ nhận khoảng <code>120</code> cảnh báo, sức chứa chỉ 32 cảnh báo thật nếu mỗi mục tốn 15 phút, nên hàng đợi luôn dài hơn khả năng đọc hết. Ba việc giữ ca trực không sụp: gộp mục trùng theo máy và tài khoản, đưa mục chạm quản trị lên trước, và ghi trạng thái cho mọi mục phải treo. Làm được ba việc này thì con số 120 không còn là cơn lũ mà là danh sách có thứ tự. Bài tiếp theo đi vào câu hỏi khó hơn: mục nào trong hàng đợi là thật, mục nào chỉ là báo nhầm.",
        focus: "all",
        edges: "all",
        metrics: { alerts: "120", trueAlerts: "60 phiếu", hours: "15", verdict: "có thứ tự" },
        changes: ["Hàng đợi có thứ tự và bằng chứng", "Sẵn sàng sang bài phân loại"],
        note: "Nhớ ba khóa gộp: máy, tài khoản, khung 5 phút."
      }
    ]
  };

  T.lessons["phan-loai"] = {
    id: "phan-loai",
    module: "doc-canh-bao",
    title: "Thật hay báo nhầm",
    shortTitle: "Phân loại",
    subtitle: "Tách 120 cảnh báo thành 90 mục thật và 30 mục nhầm",
    blurb: "Phân loại là so ba nguồn: nội dung cảnh báo, log hệ thống và giá trị tài sản. Bài chỉ ra hai kiểu sai và vì sao một mục bị đóng vì quen mắt lại nguy hiểm hơn chục mục báo nhầm.",
    duration: "13 phút",
    level: "Cơ bản",
    tags: ["phân loại", "báo nhầm", "bằng chứng", "bỏ sót", "chất lượng luật"],
    metrics: [
      { key: "alerts", label: "Cảnh báo", tone: "blue" },
      { key: "falseRate", label: "Báo nhầm", tone: "yellow" },
      { key: "trueAlerts", label: "Mục thật", tone: "coral" },
      { key: "verdict", label: "Kết luận", tone: "mint" }
    ],
    nodes: [
      { id: "signal", type: "signal", x: 55, y: 80, w: 200, h: 70, label: "Cảnh báo thô", sub: "120 mục trong ca" },
      { id: "check", type: "check", x: 340, y: 80, w: 200, h: 70, label: "Đối chiếu bằng chứng", sub: "log, danh tính, tài sản" },
      { id: "book", type: "book", x: 625, y: 80, w: 200, h: 70, label: "Luật phát hiện", sub: "ngưỡng và ngoại lệ" },
      { id: "file", type: "file", x: 340, y: 195, w: 200, h: 70, label: "Phiếu phân loại", sub: "thật, nhầm, cần xem" },
      { id: "alert", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Báo nhầm", sub: "30 cảnh báo, 25%" },
      { id: "star", type: "star", x: 340, y: 310, w: 200, h: 70, label: "Cảnh báo thật", sub: "90 mục phải xử lý" },
      { id: "audit", type: "audit", x: 625, y: 310, w: 200, h: 70, label: "Nhật ký quyết định", sub: "lý do cho từng mục" }
    ],
    edges: [
      { id: "signal-check", from: "signal", to: "check", kind: "request", label: "đưa cảnh báo" },
      { id: "book-check", from: "book", to: "check", kind: "data", label: "tra luật" },
      { id: "check-file", from: "check", to: "file", kind: "data", label: "ghi kết luận" },
      { id: "file-alert", from: "file", to: "alert", kind: "control", label: "loại nhầm" },
      { id: "file-star", from: "file", to: "star", kind: "control", label: "giữ mục thật" },
      { id: "star-audit", from: "star", to: "audit", kind: "data", label: "ghi lý do" },
      { id: "audit-book", from: "audit", to: "book", kind: "control", label: "siết luật" }
    ],
    learn: [
      "Báo nhầm làm mất thời gian, bỏ sót làm mất dữ liệu; hai giá này khác nhau.",
      "Trong 120 cảnh báo với 25% nhầm, còn 30 mục nhầm và 90 mục thật.",
      "Phân loại là so nội dung cảnh báo với log hệ thống và giá trị tài sản.",
      "Siết luật để giảm nhầm luôn phải cân lại khả năng bỏ sót."
    ],
    steps: [
      {
        short: "Hai kiểu sai",
        type: "concept",
        title: "Bộ lọc chỉ sai theo hai cách",
        body: "Bộ lọc chỉ có hai cách sai. Báo nhầm là khi luật kêu to nhưng điều tra cho thấy không có gì: phần mềm sao lưu đọc hàng nghìn tệp lúc hai giờ sáng, trông giống hành vi mã hóa tống tiền. Bỏ sót là khi có tấn công thật mà không luật nào kêu. Trong ca <code>120</code> cảnh báo, khoảng 25% là báo nhầm, tức 30 mục, còn 90 mục là thật và phải xử lý. Hai kiểu sai này có giá khác nhau: báo nhầm làm mất thời gian, bỏ sót làm mất dữ liệu. Vì vậy khi siết luật để giảm báo nhầm, phải luôn hỏi mình vừa đánh đổi bằng bao nhiêu khả năng bỏ sót.",
        focus: ["signal", "book"],
        edges: ["book-check"],
        metrics: { alerts: "120", falseRate: "25%", trueAlerts: "90", verdict: "30 nhầm" },
        changes: ["Xác định 30 mục nhầm", "90 mục thật vẫn cần người"],
        note: "Đừng tối ưu một phía: giảm nhầm mà tăng sót là đổi thời gian lấy dữ liệu."
      },
      {
        short: "So bằng chứng",
        type: "flow",
        title: "Ba nguồn, ba câu hỏi",
        body: "Phân loại là so ba nguồn: cảnh báo nói gì, log hệ thống ghi gì và tài sản đó có giá trị gì. Với một cảnh báo đăng nhập bất thường, bước một mở log xác thực xem có bao nhiêu lần thử và từ địa chỉ nào; bước hai kiểm tra tài khoản có quyền quản trị hay không; bước ba xem máy đó có dữ liệu khách hàng. Ba câu trả lời đủ để chia mục vào ba giỏ: nhầm, thật, cần xem thêm. Trong <code>120</code> mục, 30 mục rơi vào giỏ nhầm với bằng chứng rõ ràng, 90 mục còn lại phải có người nhận. Mỗi quyết định ghi kèm lý do để ca sau đọc lại mà không phải điều tra từ đầu.",
        focus: ["signal", "check", "file", "book"],
        edges: ["signal-check", "book-check", "check-file"],
        metrics: { alerts: "120", falseRate: "25%", trueAlerts: "90", verdict: "ba giỏ" },
        changes: ["Mỗi mục có bằng chứng kèm theo", "Phiếu phân loại tách ba nhóm"],
        note: "Ghi lý do ngay lúc đóng phiếu, vì một giờ sau bạn sẽ không còn nhớ đã xem gì."
      },
      {
        short: "Ba luật nhầm",
        type: "detail",
        title: "30 mục nhầm đến từ đâu",
        body: "Con số 25% không phải số xấu nếu biết nó đến từ đâu. Trong ví dụ này, 30 mục nhầm chủ yếu đến từ ba luật: quét lịch sao lưu, phần mềm cập nhật chạy đêm và tác vụ đồng bộ ổ đĩa mạng. Ba luật này hữu ích vì chúng cũng bắt được mã hóa tống tiền thật, nên không thể tắt. Cách xử lý là thêm ngoại lệ có thời hạn cho tài khoản dịch vụ và đường dẫn sao lưu, đồng thời giữ nguyên luật cho phần còn lại. Sau khi thêm ngoại lệ, tỉ lệ nhầm có thể giảm từ 25% xuống khoảng 15%, tức hàng đợi còn 102 mục thật thay vì 90, nhưng thời gian đọc giảm đáng kể.",
        focus: ["alert", "book", "file"],
        edges: ["file-alert", "audit-book"],
        metrics: { alerts: "120", falseRate: "15%", trueAlerts: "102", verdict: "bớt nhầm" },
        changes: ["30 mục nhầm quy về ba luật", "Ngoại lệ có hạn đưa tỉ lệ nhầm về 15%"],
        note: "Ngoại lệ phải có ngày hết hạn, nếu không nó thành lỗ hổng vĩnh viễn."
      },
      {
        short: "Quen mắt",
        type: "pitfall",
        title: "Đóng phiếu vì đã quen",
        body: "Khi một luật báo nhầm vài lần, người trực bắt đầu bỏ qua nó mà không mở log. Đó là lúc nguy hiểm nhất: kẻ tấn công chỉ cần hoạt động giống thói quen cũ của hệ thống là lọt qua. Nhiều vụ lớn từng có một cảnh báo thật bị đóng với lý do quen thuộc, nằm lẫn trong hàng trăm mục. Cách chống là định kỳ lấy mẫu ngẫu nhiên các mục đã đóng để kiểm tra lại, và ghi rõ lý do thay vì chỉ bấm nút. Với 30 mục nhầm mỗi ca, chỉ cần hai mục bị đóng sai là đủ mở đường cho một sự cố thật.",
        focus: ["alert", "star", "audit"],
        edges: ["file-alert", "star-audit", "file-star"],
        metrics: { alerts: "120", falseRate: "25%", trueAlerts: "90", verdict: "rủi ro sót" },
        changes: ["Hai mục thật bị đóng nhầm", "Mẫu kiểm tra phát hiện lỗi"],
        note: "Lấy mẫu 10% phiếu đã đóng mỗi tuần là cách rẻ nhất để bắt lỗi phân loại."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "90 mục thật, 30 mục nhầm",
        body: "Tổng kết: <code>120</code> cảnh báo, 25% báo nhầm cho 30 mục nhầm và 90 mục thật. Phân loại không phải đoán mà là so ba nguồn: nội dung cảnh báo, log hệ thống và giá trị tài sản. Hai kiểu sai có giá khác nhau, nên mọi lần siết luật đều phải cân lại khả năng bỏ sót. Giữ thói quen lấy mẫu kiểm tra các mục đã đóng, vì cảnh báo thật thường trốn trong đám mục bị coi là quen. Bài tiếp theo lấy 90 mục thật đó và xếp thứ tự theo tác động, dùng CVSS cùng ngữ cảnh thay vì cảm giác.",
        focus: "all",
        edges: "all",
        metrics: { alerts: "120", falseRate: "25%", trueAlerts: "90", verdict: "đã tách" },
        changes: ["Hai giỏ có số lượng rõ ràng", "Sẵn sàng sang bài ưu tiên"],
        note: "Ba nguồn bằng chứng: cảnh báo, log, giá trị tài sản."
      }
    ]
  };

  T.lessons["uu-tien"] = {
    id: "uu-tien",
    module: "doc-canh-bao",
    title: "Ưu tiên theo tác động",
    shortTitle: "Ưu tiên",
    subtitle: "CVSS cộng vị trí máy và dữ liệu, chặn trần 100",
    blurb: "Cùng một lỗ hổng đặt ở hai máy khác nhau gây thiệt hại khác nhau. Bài đi qua công thức chấm điểm nội bộ, hai ví dụ CVSS 7,5 và 6,0, và lý do xếp hàng theo CVSS thuần làm hỏng thứ tự xử lý.",
    duration: "14 phút",
    level: "Trung cấp",
    tags: ["CVSS", "ngữ cảnh", "điểm nghiêm trọng", "hở Internet", "dữ liệu"],
    metrics: [
      { key: "cvss", label: "CVSS", tone: "blue" },
      { key: "context", label: "Ngữ cảnh", tone: "yellow" },
      { key: "score", label: "Điểm", tone: "coral" },
      { key: "priority", label: "Ưu tiên", tone: "mint" }
    ],
    nodes: [
      { id: "alert", type: "alert", x: 55, y: 80, w: 200, h: 70, label: "Sự cố A", sub: "CVSS 7,5, hở Internet" },
      { id: "bolt", type: "bolt", x: 340, y: 80, w: 200, h: 70, label: "Sự cố B", sub: "CVSS 6,0, chỉ nội bộ" },
      { id: "disk", type: "disk", x: 625, y: 80, w: 200, h: 70, label: "Dữ liệu nhạy cảm", sub: "hồ sơ khách hàng" },
      { id: "grid", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Công thức điểm", sub: "CVSS x 10 + ngữ cảnh" },
      { id: "check", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Chấm điểm A", sub: "100, chạm trần" },
      { id: "star", type: "star", x: 340, y: 310, w: 200, h: 70, label: "Chấm điểm B", sub: "75, vẫn ưu tiên cao" },
      { id: "queue", type: "queue", x: 625, y: 310, w: 200, h: 70, label: "Hàng đợi ưu tiên", sub: "A trước, B ngay sau" }
    ],
    edges: [
      { id: "alert-grid", from: "alert", to: "grid", kind: "data", label: "đưa CVSS 7,5" },
      { id: "bolt-grid", from: "bolt", to: "grid", kind: "data", label: "đưa CVSS 6,0" },
      { id: "disk-grid", from: "disk", to: "grid", kind: "data", label: "cộng 15 điểm" },
      { id: "grid-check", from: "grid", to: "check", kind: "control", label: "tính điểm A" },
      { id: "grid-star", from: "grid", to: "star", kind: "control", label: "tính điểm B" },
      { id: "check-queue", from: "check", to: "queue", kind: "request", label: "xếp trước" },
      { id: "star-queue", from: "star", to: "queue", kind: "request", label: "xếp sau" }
    ],
    learn: [
      "CVSS đo mức nặng kỹ thuật, không biết máy nằm ở đâu hay chứa gì.",
      "Điểm bằng CVSS nhân 10, cộng 20 nếu hở Internet, cộng 15 nếu có dữ liệu nhạy cảm.",
      "CVSS 7,5 hở Internet có dữ liệu cho 100 điểm, chạm trần thang nội bộ.",
      "CVSS 6,0 nội bộ có dữ liệu cho 75 điểm, vẫn vượt ngưỡng ưu tiên cao 70."
    ],
    steps: [
      {
        short: "CVSS",
        type: "concept",
        title: "CVSS chỉ là nửa câu chuyện",
        body: "CVSS chấm mức nặng kỹ thuật của một lỗ hổng từ 0 đến 10, dựa trên khả năng khai thác và hậu quả nếu khai thác thành công. Điểm 7,5 là lỗ hổng nghiêm trọng, điểm 6,0 là mức trung bình cao. Nhưng CVSS không biết máy đó nằm ở đâu và chứa gì. Một lỗi 6,0 trên máy kế toán chứa bảng lương gây thiệt hại lớn hơn lỗi 7,5 trên máy chủ thử nghiệm không dữ liệu. Vì vậy nhóm trực ca cộng thêm ngữ cảnh: cộng 20 điểm nếu máy hở Internet, cộng 15 điểm nếu chạm dữ liệu nhạy cảm, rồi chặn trần ở 100 để thang điểm dễ so sánh.",
        focus: ["alert", "bolt", "grid"],
        edges: ["alert-grid", "bolt-grid"],
        metrics: { cvss: "7,5 / 6,0", context: "chưa cộng", score: "75 / 60", priority: "theo CVSS" },
        changes: ["Hai sự cố được đưa về cùng thang", "Chưa tính vị trí và dữ liệu"],
        note: "CVSS do nhà cung cấp công bố, còn ngữ cảnh do bạn biết rõ hơn ai hết."
      },
      {
        short: "Sự cố A",
        type: "flow",
        title: "7,5 cộng 35 thành 100",
        body: "Sự cố A có CVSS 7,5 trên máy chủ hồ sơ hở Internet và dữ liệu khách hàng nằm ngay trên máy. Phép tính: 7,5 nhân 10 được 75, cộng 20 vì hở Internet, cộng 15 vì chạm dữ liệu nhạy cảm, tổng 110. Trần của thang là 100 nên điểm cuối là <code>100</code>. Con số này không có nghĩa sự cố nặng gấp đôi mức 50, nó chỉ nói đây là mức cao nhất trong thang nội bộ. Điều đáng chú ý là ngữ cảnh đóng góp 35 điểm, gần một nửa tổng, nên nếu chỉ đọc CVSS 7,5 ta đã bỏ qua phần lớn lý do khiến A phải xử lý ngay.",
        focus: ["alert", "disk", "grid", "check"],
        edges: ["alert-grid", "disk-grid", "grid-check"],
        metrics: { cvss: "7,5", context: "+35", score: "100", priority: "cao nhất" },
        changes: ["Điểm A chạm trần 100", "Ngữ cảnh đóng góp 35 điểm"],
        note: "110 bị chặn về 100, nên đừng dùng điểm này để so mức nặng giữa hai sự cố cùng chạm trần."
      },
      {
        short: "Sự cố B",
        type: "detail",
        title: "6,0 nội bộ vẫn 75",
        body: "Sự cố B có CVSS 6,0, chỉ nằm trong mạng nội bộ, nhưng máy đó giữ bảng lương. Phép tính: 6,0 nhân 10 được 60, không cộng điểm hở Internet, cộng 15 vì dữ liệu nhạy cảm, tổng <code>75</code>. Ngưỡng ưu tiên cao của nhóm là 70, nên B vượt ngưỡng 5 điểm và vẫn phải xử lý trong ca, ngay sau A. Nếu bỏ qua ngữ cảnh, B chỉ còn 60 và rơi xuống danh sách chờ, đúng lúc dữ liệu lương đang phơi ra. Bài học là thứ tự ưu tiên không đọc từ một con số mà từ phép cộng giữa mức nặng kỹ thuật và giá trị của thứ đang bị đe dọa.",
        focus: ["bolt", "disk", "grid", "star"],
        edges: ["bolt-grid", "disk-grid", "grid-star"],
        metrics: { cvss: "6,0", context: "+15", score: "75", priority: "cao" },
        changes: ["Điểm B là 75, trên ngưỡng 70", "B không bị đẩy vào danh sách chờ"],
        note: "75 chỉ hơn ngưỡng 5 điểm, một thay đổi nhỏ về dữ liệu là đủ tụt hạng."
      },
      {
        short: "Bẫy CVSS",
        type: "pitfall",
        title: "Xếp hàng theo CVSS thuần",
        body: "Đội nào cũng có lúc xếp hàng đợi theo CVSS giảm dần rồi làm từ trên xuống. Cách đó bỏ qua hai thứ: vị trí máy và dữ liệu trên máy. Một lỗi 6,0 trên máy kế toán hở cổng ra ngoài có thể nguy hiểm hơn lỗi 8,0 trên máy chủ nội bộ đã cô lập. Ngoài ra CVSS do nhà cung cấp công bố có thể chậm vài ngày, trong khi cảnh báo khai thác thực tế đã có. Cách làm an toàn là giữ CVSS làm đầu vào, nhưng luôn cộng thêm hai câu hỏi: máy có hở Internet không, có chạm dữ liệu nhạy cảm không. Hai câu trả lời đó thường đổi thứ tự nhiều hơn chênh lệch 1,5 điểm CVSS.",
        focus: ["alert", "bolt", "queue"],
        edges: ["check-queue", "star-queue"],
        metrics: { cvss: "8,0", context: "cô lập", score: "80", priority: "chưa đúng" },
        changes: ["Thứ tự đảo so với tác động thật", "Hai câu hỏi ngữ cảnh được thêm vào"],
        note: "CVSS 8,0 trên máy cô lập thấp hơn CVSS 6,0 trên máy hở cổng có dữ liệu."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Điểm nội bộ, lý do viết ra",
        body: "Tổng kết: điểm nghiêm trọng bằng CVSS nhân 10, cộng 20 nếu hở Internet, cộng 15 nếu chạm dữ liệu nhạy cảm, chặn trần 100; từ 70 là ưu tiên cao. Sự cố A được <code>100</code> và đứng đầu, sự cố B được 75 và vẫn phải xử lý ngay sau, dù CVSS chỉ 6,0. Công thức này không thay thế phán đoán, nó chỉ buộc người trực viết ra lý do. Bài cuối của module gom mọi thứ lại: hàng đợi, phân loại và ưu tiên đặt vào một ca tám giờ, kèm cách đo tải và bàn giao phần còn treo.",
        focus: "all",
        edges: "all",
        metrics: { cvss: "7,5 / 6,0", context: "+35 / +15", score: "100 / 75", priority: "cao / cao" },
        changes: ["Hàng đợi xếp theo điểm nội bộ", "Sẵn sàng sang bài tải ca"],
        note: "Ngưỡng 70 là ranh giới duy nhất cần nhớ trong công thức này."
      }
    ]
  };

  T.lessons["ca-truc"] = {
    id: "ca-truc",
    module: "doc-canh-bao",
    title: "Tải ca và bàn giao",
    shortTitle: "Ca trực",
    subtitle: "22,5 giờ việc trong một ca 8 giờ và cách chia lại",
    blurb: "Ca trực có hạn mức 32 cảnh báo thật, tính từ 480 phút chia 15 phút mỗi mục. Bài đo tải hai ca điển hình, chỉ ra chỗ quyết định phải bỏ việc, và mẫu bàn giao giữ ngữ cảnh cho người kế tiếp.",
    duration: "13 phút",
    level: "Trung cấp",
    tags: ["tải ca", "hạn mức", "quá tải", "bàn giao", "ưu tiên"],
    metrics: [
      { key: "alerts", label: "Cảnh báo", tone: "blue" },
      { key: "trueAlerts", label: "Mục thật", tone: "yellow" },
      { key: "hours", label: "Giờ cần", tone: "coral" },
      { key: "verdict", label: "Kết luận", tone: "mint" }
    ],
    nodes: [
      { id: "clock", type: "clock", x: 55, y: 80, w: 200, h: 70, label: "Ca 8 giờ", sub: "480 phút" },
      { id: "queue", type: "queue", x: 340, y: 80, w: 200, h: 70, label: "90 cảnh báo thật", sub: "120 trừ 25% nhầm" },
      { id: "user", type: "user", x: 625, y: 80, w: 200, h: 70, label: "Analyst", sub: "15 phút mỗi cảnh báo" },
      { id: "grid", type: "grid", x: 340, y: 195, w: 200, h: 70, label: "Sức chứa ca", sub: "32 cảnh báo thật" },
      { id: "file", type: "file", x: 55, y: 310, w: 200, h: 70, label: "Biên bản bàn giao", sub: "việc còn treo" },
      { id: "alert", type: "alert", x: 340, y: 310, w: 200, h: 70, label: "Quá tải 22,5 giờ", sub: "gấp gần ba ca" },
      { id: "check", type: "check", x: 625, y: 310, w: 200, h: 70, label: "Ca nhẹ 7,5 giờ", sub: "40 cảnh báo, 30 thật" }
    ],
    edges: [
      { id: "clock-queue", from: "clock", to: "queue", kind: "control", label: "mở ca" },
      { id: "queue-user", from: "queue", to: "user", kind: "request", label: "giao việc" },
      { id: "user-grid", from: "user", to: "grid", kind: "data", label: "đo sức" },
      { id: "grid-alert", from: "grid", to: "alert", kind: "control", label: "vượt 22,5 giờ" },
      { id: "alert-file", from: "alert", to: "file", kind: "data", label: "ghi phần tồn" },
      { id: "user-check", from: "user", to: "check", kind: "data", label: "ca 40 mục" },
      { id: "check-file", from: "check", to: "file", kind: "control", label: "ghi ca nhẹ" }
    ],
    learn: [
      "Hạn mức ca là 32 cảnh báo thật, tính từ 480 phút chia 15 phút.",
      "120 cảnh báo, 25% nhầm, còn 90 thật, tốn 22,5 giờ, gấp gần ba ca.",
      "40 cảnh báo, 25% nhầm, còn 30 thật, tốn 7,5 giờ, ca này kham được.",
      "Biên bản bàn giao ghi việc đã kiểm, điều còn nghi và bước tiếp theo."
    ],
    steps: [
      {
        short: "Hạn mức",
        type: "concept",
        title: "Một ca có hạn mức",
        body: "Ca trực tám giờ không phải tám giờ đọc cảnh báo. Trừ giao ban, ghi chép và các cuộc gọi xác minh, thời gian thật cho từng cảnh báo ít hơn nhiều. Nếu mỗi cảnh báo thật tốn 15 phút, một ca 480 phút chứa được tối đa 32 cảnh báo thật, chưa tính thời gian chờ chủ máy trả lời. Con số <code>32</code> là hạn mức cần nhớ trước khi mở hàng đợi, vì nó biến câu hỏi cảm tính thành phép chia. Khi hàng đợi vượt hạn mức, người trực buộc phải chọn việc và ghi lại phần bị bỏ, thay vì cố làm hết rồi ra về muộn với tâm lý đã xong.",
        focus: ["clock", "user", "grid"],
        edges: ["clock-queue", "user-grid"],
        metrics: { alerts: "chưa mở", trueAlerts: "32 tối đa", hours: "8", verdict: "có hạn mức" },
        changes: ["Hạn mức ca được tính là 32", "Kế hoạch đọc bắt đầu từ phép chia"],
        note: "Hạn mức tính trên cảnh báo thật, không phải trên tổng số cảnh báo trong hàng đợi."
      },
      {
        short: "Ca nặng",
        type: "flow",
        title: "120 mục thành 22,5 giờ",
        body: "Ca nặng có <code>120</code> cảnh báo, trong đó 25% báo nhầm, còn 90 cảnh báo thật. Nhân 90 với 15 phút được 1.350 phút, tức 22,5 giờ, gần ba ca tám giờ. Con số này nói rõ: dù làm liên tục và không nghỉ, một người cũng chỉ xử lý được khoảng một phần ba hàng đợi. Vì vậy trưởng ca phải chọn trước: 5 mục chạm tài khoản quản trị xử lý ngay, các mục cùng máy gộp lại, phần còn lại chuyển thành việc treo có hạn. Không có cách nào đọc hết 90 mục trong một ca, và cố làm vậy chỉ khiến các mục nặng bị xử lý muộn.",
        focus: ["clock", "queue", "user", "grid", "alert"],
        edges: ["clock-queue", "queue-user", "user-grid", "grid-alert"],
        metrics: { alerts: "120", trueAlerts: "90", hours: "22,5", verdict: "quá tải" },
        changes: ["90 mục thật cần 22,5 giờ", "Chỉ một phần ba hàng đợi được xử lý"],
        note: "22,5 chia 8 gần bằng 2,8, nên ca nặng cần gần ba người mới đọc hết."
      },
      {
        short: "Ca nhẹ",
        type: "detail",
        title: "40 mục, 30 thật, 7,5 giờ",
        body: "Ca nhẹ có 40 cảnh báo, cùng tỉ lệ 25% báo nhầm, nên còn 30 cảnh báo thật, trong đó 10 mục nghiêm trọng. Nhân 30 với 15 phút được 450 phút, tức <code>7,5</code> giờ, vừa dưới hạn mức 8 giờ của ca. Ca này kham được nhưng không dư dả: chỉ cần thêm ba cảnh báo thật đột xuất là vượt hạn mức. Điểm cần chú ý là 10 mục nghiêm trọng nằm trong 30 mục thật chứ không cộng thêm, nên đừng đếm trùng. Với ca 7,5 giờ, người trực vẫn nên xử lý nhóm nghiêm trọng trước và dành 30 phút cuối để ghi bàn giao.",
        focus: ["user", "check", "file"],
        edges: ["user-check", "check-file"],
        metrics: { alerts: "40", trueAlerts: "30", hours: "7,5", verdict: "kham được" },
        changes: ["30 mục thật cần 7,5 giờ", "10 mục nghiêm trọng nằm trong 30"],
        note: "Kham được không có nghĩa là nhàn, chỉ còn 30 phút dự phòng cho cả ca."
      },
      {
        short: "Bàn giao",
        type: "pitfall",
        title: "Bàn giao mất ngữ cảnh",
        body: "Bàn giao kiểu còn 40 mục chưa xem không giúp được ca sau, vì người nhận phải mở lại từ đầu. Một biên bản tốt ghi ba thứ cho mỗi mục tồn: đã kiểm tra gì, nghi ngờ điều gì, bước tiếp theo là gì. Với ca 22,5 giờ, phần tồn lên tới hàng chục mục, nên biên bản phải nhóm theo máy và tài khoản để người sau đọc trong vài phút. Thiếu ngữ cảnh, ca sau sẽ lặp lại đúng các bước đã làm, còn kẻ tấn công có thêm tám giờ. Thời gian viết biên bản, khoảng 20 phút, là khoản đầu tư rẻ nhất trong cả ca.",
        focus: ["alert", "file", "grid"],
        edges: ["alert-file", "grid-alert"],
        metrics: { alerts: "120", trueAlerts: "90", hours: "22,5", verdict: "treo có hồ sơ" },
        changes: ["Biên bản nhóm theo máy", "Phần tồn có bước tiếp theo rõ"],
        note: "Ba câu cho mỗi mục tồn: đã kiểm gì, nghi gì, làm gì tiếp."
      },
      {
        short: "Tổng kết",
        type: "final",
        tone: "final",
        title: "Bốn bước của một ca",
        body: "Tổng kết module: hàng đợi <code>120</code> cảnh báo, 25% nhầm, còn 90 mục thật, tốn 22,5 giờ nên vượt xa ca tám giờ; ca 40 cảnh báo còn 30 mục thật, tốn 7,5 giờ, kham được. Đọc cảnh báo là chuỗi bốn bước: gộp trùng, phân loại thật hay nhầm, chấm điểm theo CVSS cùng ngữ cảnh, rồi đo tải và bàn giao phần treo. Bốn bước này đủ để một người trực giải thích mọi quyết định của mình bằng số. Phòng mô phỏng ngay sau đây cho bạn tự nhập các con số trên và đối chiếu kết quả từng nhiệm vụ.",
        focus: "all",
        edges: "all",
        metrics: { alerts: "120 và 40", trueAlerts: "90 và 30", hours: "22,5 và 7,5", verdict: "quá tải / vừa" },
        changes: ["Hai ca có kết luận riêng", "Sẵn sàng vào phòng mô phỏng"],
        note: "Bốn bước này lặp lại ở mọi module sau, chỉ đổi loại dữ liệu đầu vào."
      }
    ]
  };

  T.practice.push(
    {
      tag: "TRIAGE",
      title: "Ca 120 cảnh báo có kham được",
      scenario: "Tám giờ tối, ca trực nhận 120 cảnh báo từ EDR, tường lửa và hệ thống đăng nhập. Bộ lọc tự động cho biết khoảng 25% là báo nhầm do phần mềm quét lịch và tác vụ sao lưu. Trong số cảnh báo còn lại có 5 mục chạm tài khoản quản trị. Quy trình ghi rõ mỗi cảnh báo thật tốn 15 phút để xác minh và đóng, còn một ca chỉ có 480 phút. Trưởng ca hỏi bạn ca này có kham được không và nên làm gì trước.",
      metrics: [
        { label: "Cảnh báo", value: "120" },
        { label: "Báo nhầm", value: "25%" },
        { label: "Mục thật", value: "90" }
      ],
      options: [
        "Kham được, vì 90 cảnh báo thật nhân 15 phút là 22,5 giờ nhưng chia đều cho các thành viên trong ca thì vẫn kịp.",
        "Quá tải: 90 cảnh báo thật cần 22,5 giờ, gấp gần ba ca; xử lý ngay 5 mục quản trị và ghi phần còn lại thành việc treo có hạn.",
        "Không cần tính trước: cứ xử lý lần lượt từ cảnh báo mới nhất đến cũ nhất cho tới khi hết ca.",
        "Tắt ba luật sinh nhiều cảnh báo nhất để hàng đợi về gần 0 rồi mới xử lý tiếp."
      ],
      correct: 1,
      explain: "Đáp án đúng tính đủ ba bước. Lấy 120 nhân 75% sau khi trừ 25% báo nhầm, được 90 cảnh báo thật. Mỗi mục tốn 15 phút nên tổng công là 90 nhân 15 bằng 1.350 phút, tức 22,5 giờ, gấp gần ba ca. Con số đó buộc phải phân tầng: 5 mục chạm tài khoản quản trị xử lý ngay, phần còn lại ghi thành việc treo có chủ và hạn. Phương án đầu sai vì 22,5 giờ không thể nằm trong 480 phút. Phương án ba sai vì xử lý theo thứ tự thời gian bỏ qua mức nguy hiểm. Phương án bốn sai vì tắt luật chỉ che tín hiệu, không giảm rủi ro."
    },
    {
      tag: "SEVERITY",
      title: "Hai sự cố, một hàng đợi",
      scenario: "Hai sự cố vào cùng lúc. Sự cố A: lỗ hổng CVSS 7,5 trên máy chủ hồ sơ hở Internet, dữ liệu khách hàng nằm ngay trên máy. Sự cố B: lỗi CVSS 6,0 trên máy nội bộ phòng kế toán, cũng chạm dữ liệu lương. Quy ước chấm điểm của nhóm: lấy CVSS nhân 10, cộng 20 nếu hở Internet, cộng 15 nếu chạm dữ liệu nhạy cảm, chặn trần 100; từ 70 là ưu tiên cao. Sếp hỏi có nên xếp B vào danh sách chờ vì điểm CVSS thấp hơn không.",
      metrics: [
        { label: "Sự cố A", value: "CVSS 7,5" },
        { label: "Sự cố B", value: "CVSS 6,0" },
        { label: "Ngưỡng cao", value: "70" }
      ],
      options: [
        "A được 100, B được 75, cả hai vượt ngưỡng 70 nên đều ưu tiên cao; xử lý A trước, B ngay sau, không đẩy vào danh sách chờ.",
        "B chỉ 60 điểm vì 6,0 nhân 10, dưới ngưỡng 70 nên xếp vào danh sách chờ là đúng.",
        "A được 90, B được 85, hai sự cố gần bằng nhau nên xử lý cái nào trước cũng được.",
        "B được 75 nhưng vì chỉ nội bộ nên hạ xuống mức thấp, chỉ theo dõi thêm vài ngày."
      ],
      correct: 0,
      explain: "Đáp án đúng cộng đủ ngữ cảnh. Sự cố A: 7,5 nhân 10 được 75, cộng 20 vì hở Internet và 15 vì chạm dữ liệu, tổng 110, chặn trần còn 100. Sự cố B: 6,0 nhân 10 được 60, không cộng điểm vị trí, cộng 15 vì dữ liệu lương, được 75. Ngưỡng ưu tiên cao là 70, nên B vượt 5 điểm và phải xử lý ngay sau A. Phương án hai quên cộng 15 điểm dữ liệu nên tính B chỉ 60. Phương án ba bịa ra hai con số không theo công thức nào. Phương án bốn thấy đúng 75 nhưng tự hạ mức, dù quy ước ghi rõ 75 là ưu tiên cao."
    }
  );

  T.cheatsheets.push({
    id: "soc-basics",
    num: "01",
    module: "doc-canh-bao",
    title: "Nền tảng SOC",
    intro: "Ba phép tính đọc một ca trực: đếm cảnh báo thật sau khi trừ báo nhầm, quy đổi ra giờ công so với ca 8 giờ, và chấm điểm nghiêm trọng. Bảng dưới gom công thức và ngưỡng quyết định.",
    cards: [
      {
        title: "Ba phép tính của ca trực",
        wide: true,
        html: "<table><thead><tr><th>Phép tính</th><th>Công thức</th><th>Ví dụ trong lab</th></tr></thead><tbody><tr><td>Cảnh báo thật</td><td>tổng x (1 - tỉ lệ nhầm)</td><td>120 x 0,75 = <code>90</code></td></tr><tr><td>Giờ công</td><td>số thật x 15 phút</td><td>90 x 15 = 1.350 phút = <code>22,5</code> giờ</td></tr><tr><td>Sức ca</td><td>480 phút / 15 phút</td><td><code>32</code> cảnh báo thật</td></tr><tr><td>Ca nhẹ</td><td>40 x 0,75 = 30</td><td>30 x 15 = <code>7,5</code> giờ, kham được</td></tr><tr><td>Điểm nghiêm trọng</td><td>CVSS x 10 + 20 hở Internet + 15 dữ liệu, trần 100</td><td>CVSS 7,5 hở Internet có dữ liệu: 110, còn <code>100</code></td></tr></tbody></table>"
      },
      {
        title: "Ngưỡng quyết định",
        html: "<table><thead><tr><th>Chỉ số</th><th>Ngưỡng</th><th>Kết luận</th></tr></thead><tbody><tr><td>Tải ca</td><td>dưới 8 giờ</td><td>kham được</td></tr><tr><td>Tải ca</td><td>trên 8 giờ</td><td>quá tải, phải phân tầng</td></tr><tr><td>Điểm sự cố</td><td>từ 70</td><td>ưu tiên cao</td></tr><tr><td>Điểm sự cố</td><td>dưới 70</td><td>xử lý theo lịch</td></tr><tr><td>Phơi nhiễm IOC</td><td>trên 5 lượt chưa chặn</td><td>còn hở, xử lý tiếp</td></tr></tbody></table>"
      },
      {
        title: "Bốn câu hỏi phân loại",
        html: "<ul><li>Cảnh báo nói chính xác điều gì, tiến trình hay tài khoản nào?</li><li>Log hệ thống có xác nhận cùng thời điểm đó không?</li><li>Tài khoản liên quan có quyền quản trị hay không?</li><li>Máy đó giữ dữ liệu gì và có hở Internet không?</li></ul><p>Bốn câu trả lời đủ để chia mục vào ba giỏ: nhầm, thật, cần xem thêm.</p>"
      },
      {
        title: "Mẫu ghi chú bàn giao",
        wide: true,
        html: "<pre><code>CA: 18h - 02h  |  Người trực: ...\nHÀNG ĐỢI: 120 cảnh báo, 30 nhầm, 90 thật\nĐÃ XỬ LÝ: 5 mục quản trị, đóng phiếu kèm lý do\nCÒN TREO: máy kế toán 10.2.4.8 - 12 mục\n  đã kiểm: log đăng nhập 21h, 4 lần sai mật khẩu\n  còn nghi: tài khoản dv_backup chạy tay\n  tiếp theo: khóa tạm tài khoản, đổi mật khẩu\nGHI CHÚ: 22,5 giờ công, ca thiếu 2 người</code></pre><p>Nhóm theo máy và tài khoản, mỗi mục ba dòng là đủ cho ca sau đọc trong vài phút.</p>"
      },
      {
        title: "Từ viết tắt cần nhớ",
        html: "<table><thead><tr><th>Từ</th><th>Nghĩa</th></tr></thead><tbody><tr><td>SOC</td><td>trung tâm điều hành an ninh</td></tr><tr><td>SIEM</td><td>hệ thống gom log và tương quan cảnh báo</td></tr><tr><td>EDR</td><td>công cụ giám sát và phản ứng trên máy trạm</td></tr><tr><td>IOC</td><td>dấu vết tấn công, như địa chỉ hay tên miền xấu</td></tr><tr><td>CVSS</td><td>thang điểm mức nặng kỹ thuật từ 0 đến 10</td></tr></tbody></table>"
      }
    ]
  });
})();
