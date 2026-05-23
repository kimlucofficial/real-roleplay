'use client';

import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Gavel,
  Landmark,
  MessageSquare,
  ScrollText,
  Shield,
  Sparkles,
  Users
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Navbar from './Navbar';
import { useMemo, useState } from 'react';

const introCards = [
  { title: 'REAL ROLEPLAY', text: 'được xây dựng như một xã hội thu nhỏ, nơi bạn phải sống thật với nhân vật trong game của bạn.', accent: 'blue', icon: Landmark },
  { title: 'CƠ CHẾ ĐẶC TRƯNG', text: 'hệ thống nghề nghiệp liên kết chặt chẽ với nhau, tài nguyên nghề này sẽ là nguyên liệu của ngành nghề khác.', accent: 'gold', icon: ScrollText },
  { title: 'WHITELIST', text: 'Quy trình xét duyệt gắt gao, nghiêm túc nhằm giữ vững chất lượng cộng đồng và trải nghiệm nhập vai.', accent: 'red', icon: Shield },
  { title: 'THỜI TRANG CHỌN LỌC', text: 'mỗi chiếc quần/áo đều được chọn lọc từng chiếc một, tạo nên giá trị thẩm mỹ và đặc trưng cho từng nhân vật.', accent: 'neutral', icon: Gavel },
  { title: 'LIVE EVENTS', text: 'được chọn lọc kỹ lưỡng và phát triển theo lộ trình tuần - tháng. Thứ hạng càng cao thì phần thưởng càng có giá trị.', accent: 'gold', icon: Sparkles },
  { title: 'CỘNG ĐỒNG', text: 'thành phố được định hình bởi người chơi. Mọi mối quan hệ, xung đột và câu chuyện đều bắt nguồn từ lựa chọn và hệ quả của bạn.', accent: 'blue', icon: Users }
];

const icRules = [
  { title: 'Tôn trọng nhận thức của nhân vật', text: 'Chỉ hành động theo những gì nhân vật thật sự biết, thấy hoặc được kể lại một cách hợp lệ.' },
  { title: 'Giữ động cơ và tính cách nhất quán', text: 'Mọi lựa chọn lớn phải phản ánh quá khứ, tham vọng, điểm mạnh và điểm yếu của nhân vật.' },
  { title: 'Không ép tình huống vô lý', text: 'Không đẩy diễn biến đi quá nhanh hoặc quá cực đoan nếu bối cảnh chưa đủ thuyết phục.' },
  { title: 'Tôn trọng hậu quả sau hành động', text: 'Mọi hành vi có rủi ro đều phải chấp nhận phản ứng từ pháp luật, cộng đồng hoặc đối thủ.' },
  { title: 'Không powergaming', text: 'Không áp đặt kết quả hành động lên người khác và không biến roleplay thành thao tác một chiều.' , important: true},
  { title: 'Không metagaming', text: 'Không sử dụng thông tin lấy từ Discord, stream, voice ngoài game hoặc OOC để dẫn dắt quyết định IC.', important: true },
  { title: 'Không mix cảm xúc OOC vào IC', text: 'Mâu thuẫn ngoài đời không được phép làm thay đổi hành vi của nhân vật trong thành phố.' },
  { title: 'Ưu tiên đối thoại trước leo thang', text: 'Khi bối cảnh cho phép, hãy để roleplay, thương lượng và tension dẫn chuyện trước bạo lực.' },
  { title: 'Tôn trọng tuyến vai của người khác', text: 'Không cắt ngang hoặc phá vỡ arc của người chơi khác chỉ để giành spotlight ngắn hạn.' },
  { title: 'Giữ nhịp độ tình huống hợp lý', text: 'Những tuyến lớn cần được xây theo lớp, tránh đốt giai đoạn hoặc đẩy conflict quá nhanh.' },
  { title: 'Không abuse cơ chế để thắng IC', text: 'Cơ chế gameplay không được dùng như công cụ lách logic hoặc phá trải nghiệm câu chuyện.' },
  { title: 'Bảo toàn giá trị rủi ro', text: 'Khi bước vào tình huống nguy hiểm, nhân vật phải cư xử như đang thật sự có thứ để mất.' },
  { title: 'Tài sản và quyền lực phải có nguồn gốc', text: 'Xe, nhà, doanh nghiệp, quan hệ hoặc ảnh hưởng lớn cần được xây bằng roleplay hợp lý.' },
  { title: 'Hợp tác khi có tuyến chung', text: 'Khi nhiều người cùng tham gia một kịch bản, cần giữ tính phối hợp để tình huống tròn và có nhịp.' },
  { title: 'Không biến mọi việc thành combat', text: 'Bạo lực là một nhánh của roleplay, không phải đáp án mặc định cho mọi mâu thuẫn.' },
  { title: 'Phản ứng theo mức độ thông tin', text: 'Chỉ được nghi ngờ, truy xét hoặc trả đũa ở mức phù hợp với chứng cứ mà nhân vật đang có.' },
  { title: 'Tôn trọng không gian công cộng', text: 'Các hành vi phá phách, gây náo loạn hoặc lạm dụng phương tiện phải đi kèm nguy cơ bị xử lý IC.' },
  { title: 'Giữ logic nghề nghiệp', text: 'Người làm luật, doanh nhân, dân thường hay tội phạm đều cần hành xử đúng với tuyến vai của mình.' },
  { title: 'Mọi giao dịch phải có bối cảnh', text: 'Trao đổi tiền, hàng, dịch vụ hoặc thông tin cần diễn ra trong bối cảnh hợp lý và có diễn biến.' },
  { title: 'Không lạm dụng việc quên ký ức', text: 'Mất trí nhớ, bỏ qua hậu quả hoặc chối bỏ tình huống chỉ được dùng khi có lý do IC chặt chẽ.' },
  { title: 'Tôn trọng hiện trường và chứng cứ', text: 'Những vụ việc lớn nên để lại dấu vết, nhân chứng hoặc hệ quả thay vì tự biến mất vô lý.' },
  { title: 'Giữ chuẩn nhập vai khi bị bắt giữ', text: 'Các tình huống kiểm tra, thẩm vấn, truy đuổi hoặc xét xử cần được roleplay đủ và không qua loa.' },
  { title: 'Tôn trọng ranh giới năng lực nhân vật', text: 'Không tự biến nhân vật thành người giỏi mọi thứ nếu câu chuyện chưa từng xây điều đó.' },
  { title: 'Xây quan hệ theo thời gian', text: 'Tin tưởng, thù hằn, liên minh hay phản bội đều nên được tích lũy bằng nhiều tương tác thực tế.' },
  { title: 'Giữ giá trị danh tiếng', text: 'Tên tuổi của nhân vật trong thành phố phải đến từ hành vi lặp lại và ảnh hưởng được công nhận.' },
  { title: 'Không lạm dụng danh nghĩa tổ chức', text: 'Factions, doanh nghiệp hay nhóm riêng không được dùng như lá chắn để né trách nhiệm cá nhân.' },
  { title: 'Tôn trọng nhịp phục hồi sau sự kiện lớn', text: 'Sau những biến cố nặng, nhân vật cần thời gian phản ứng thay vì quay lại bình thường ngay lập tức.' },
  { title: 'Chấp nhận thua khi câu chuyện đòi hỏi', text: 'Một nhân vật tốt không phải lúc nào cũng thắng; biết thua đúng lúc sẽ làm arc có giá trị hơn.', important: true },
  { title: 'Giữ chất lượng trình bày IC', text: 'Tin nhắn, thoại, hành động và mô tả nên rõ ràng, có chủ đích và đủ để người khác bắt nhịp.' },
  { title: 'Bảo vệ tính liên tục của thành phố', text: 'Hãy chơi như thể thành phố vẫn tiếp tục sống sau khi bạn rời khỏi màn hình, không chỉ tồn tại cho riêng bạn.' }
];

const ocRules = [
  { section: "LUẬT CHUNG", title: "Không Powergaming (PG)", text: `Chi tiết: Cấm thực hiện các hành động vượt quá giới hạn vật lý hoặc ép kết quả lên người khác mà không cho họ cơ hội phản ứng hợp lý.
Ví dụ vi phạm: Lái xe hỏng nặng vẫn chạy tốc độ cao, hoặc ép người khác “bị trói” mà không cho họ phản kháng.`, important: true },
  { section: "LUẬT CHUNG", title: "Không Metagaming (MG)", text: `Chi tiết: Không sử dụng bất kỳ thông tin ngoài game (Discord, livestream, bạn bè…) để áp dụng vào hành động trong game.
Ví dụ vi phạm: Xem stream thấy bạn bị bắt rồi kéo người đến cứu dù nhân vật chưa nhận thông tin.`, important: true },
  { section: "LUẬT CHUNG", title: "Chấp nhận thua khi câu chuyện đòi hỏi", text: `Chi tiết: Việc chấp nhận thất bại đúng lúc sẽ giúp câu chuyện phát triển tự nhiên và tạo chiều sâu cho nhân vật.
Ví dụ vi phạm: Luôn tìm cách thắng bằng mọi giá, kể cả phá logic hoặc phá tình huống chung.`, important: true },
  { section: "LUẬT CHUNG", title: "Tôn trọng nhận thức của nhân vật", text: `Chi tiết: Bạn chỉ được phép hành động dựa trên những gì nhân vật thực sự nhìn thấy, nghe thấy hoặc trải nghiệm trực tiếp trong game, không được suy diễn từ giao diện hay thông tin ngoài luồng.
Ví dụ vi phạm: Dù bạn nhìn thấy tên người chơi hiện trên đầu, nhưng nhân vật chưa hề gặp hay được giới thiệu mà vẫn gọi đúng tên họ.` },
  { section: "LUẬT CHUNG", title: "Giữ động cơ và tính cách nhất quán", text: `Chi tiết: Mọi hành động và quyết định cần bám sát câu chuyện quá khứ, tính cách và định hướng phát triển đã xây dựng cho nhân vật từ trước.
Ví dụ vi phạm: Một bác sĩ hiền lành đột nhiên cầm súng đi cướp ngân hàng chỉ vì người chơi cảm thấy chán.` },
  { section: "LUẬT CHUNG", title: "Không ép tình huống vô lý", text: `Chi tiết: Tránh đẩy diễn biến quá nhanh, thiếu hợp lý hoặc không có đủ cơ sở nhập vai để thuyết phục người khác trong tình huống.
Ví dụ vi phạm: Ép một người mới gặp phải giao toàn bộ tài sản hoặc làm theo yêu cầu ngay lập tức.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng hậu quả sau hành động", text: `Chi tiết: Mọi hành động đều phải đi kèm hậu quả tương ứng, bao gồm pháp luật, mối quan hệ và rủi ro lâu dài trong cốt truyện.
Ví dụ vi phạm: Bắn cảnh sát xong nhưng tìm cách né toàn bộ truy nã, không chấp nhận bị bắt hay mất tài sản.` },
  { section: "LUẬT CHUNG", title: "Không mix cảm xúc OOC vào IC", text: `Chi tiết: Cảm xúc ngoài đời không được ảnh hưởng đến cách nhân vật hành xử trong bối cảnh nhập vai.
Ví dụ vi phạm: Ghét người chơi ngoài đời nên vào game cố tình gây sự dù nhân vật không có lý do.` },
  { section: "LUẬT CHUNG", title: "Ưu tiên đối thoại trước leo thang", text: `Chi tiết: Luôn cố gắng giải quyết bằng lời nói, thương lượng hoặc tạo áp lực trước khi chuyển sang bạo lực.
Ví dụ vi phạm: Va chạm xe nhỏ nhưng lập tức rút vũ khí tấn công mà không nói chuyện.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng tuyến vai của người khác", text: `Chi tiết: Không phá vỡ câu chuyện hoặc làm gián đoạn tình huống của người khác chỉ để gây chú ý cho bản thân.
Ví dụ vi phạm: Cảnh sát đang điều tra hiện trường thì chạy xe vào phá rối, gây nhiễu tình huống.` },
  { section: "LUẬT CHUNG", title: "Giữ nhịp độ tình huống hợp lý", text: `Chi tiết: Các tuyến truyện lớn cần phát triển theo từng bước có thời gian, tránh việc đốt cháy giai đoạn quá nhanh.
Ví dụ vi phạm: Băng đảng mới lập đã tuyên chiến toàn server ngay ngày đầu.` },
  { section: "LUẬT CHUNG", title: "Không Abuse cơ chế để thắng IC", text: `Chi tiết: Không lợi dụng lỗi game, cơ chế hoặc thao tác kỹ thuật để tạo lợi thế phi logic trong nhập vai.
Ví dụ vi phạm: Dùng emote để chui vào tường trốn truy đuổi.` },
  { section: "LUẬT CHUNG", title: "Bảo toàn giá trị rủi ro (Fear-RP)", text: `Chi tiết: Nhân vật phải thể hiện sự sợ hãi và ưu tiên an toàn khi đối mặt nguy hiểm đến tính mạng.
Ví dụ vi phạm: Bị dí súng vào đầu nhưng vẫn rút súng bắn trả như không có rủi ro.` },
  { section: "LUẬT CHUNG", title: "Tài sản và quyền lực phải có nguồn gốc", text: `Chi tiết: Mọi tài sản, tiền bạc hoặc vị trí phải được xây dựng qua quá trình nhập vai hợp lý, không tự nhiên mà có.
Ví dụ vi phạm: Đột nhiên sở hữu siêu xe, nhà lớn mà không có quá trình kiếm tiền.` },
  { section: "LUẬT CHUNG", title: "Hợp tác khi có tuyến chung", text: `Chi tiết: Khi tham gia tình huống chung, cần phối hợp để đảm bảo trải nghiệm mượt mà cho tất cả người chơi.
Ví dụ vi phạm: Cố tình phá kế hoạch chung hoặc không tương tác khiến tình huống bị gãy.` },
  { section: "LUẬT CHUNG", title: "Không biến mọi việc thành Combat", text: `Chi tiết: Bạo lực không phải là cách giải quyết duy nhất, cần đa dạng hóa cách xử lý tình huống.
Ví dụ vi phạm: Mâu thuẫn nhỏ nhưng luôn chọn đánh nhau thay vì nói chuyện.` },
  { section: "LUẬT CHUNG", title: "Phản ứng theo mức độ thông tin", text: `Chi tiết: Chỉ hành động hoặc nghi ngờ dựa trên thông tin và bằng chứng mà nhân vật thực sự có.
Ví dụ vi phạm: Nghe tin đồn đã tấn công người khác mà không có xác nhận.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng không gian công cộng", text: `Chi tiết: Hành vi gây rối nơi công cộng sẽ kéo theo phản ứng mạnh từ hệ thống luật pháp và cộng đồng.
Ví dụ vi phạm: Gây náo loạn khu đông người mà không chấp nhận hậu quả.` },
  { section: "LUẬT CHUNG", title: "Giữ logic nghề nghiệp", text: `Chi tiết: Nhân vật phải hành xử đúng với nghề nghiệp và vai trò mình đang đảm nhận trong xã hội.
Ví dụ vi phạm: Cảnh sát bỏ qua luật để giúp tội phạm vì lý do cá nhân vô lý.` },
  { section: "LUẬT CHUNG", title: "Mọi giao dịch phải có bối cảnh", text: `Chi tiết: Các giao dịch tiền bạc, hàng hóa cần có diễn biến nhập vai rõ ràng và hợp lý.
Ví dụ vi phạm: Đưa tiền hoặc đồ không lý do, không tương tác.` },
  { section: "LUẬT CHUNG", title: "Không lạm dụng việc quên ký ức (NLR)", text: `Chi tiết: Việc mất trí nhớ chỉ áp dụng khi có lý do nhập vai hợp lý, không được dùng để né hậu quả.
Ví dụ vi phạm: Bị bắn xong quay lại trả thù ngay lập tức với đầy đủ ký ức.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng hiện trường và chứng cứ", text: `Chi tiết: Các sự kiện lớn cần để lại dấu vết hợp lý nhằm tạo điều kiện cho các tuyến điều tra và phát triển tiếp theo.
Ví dụ vi phạm: Cố tình “xóa sạch” mọi dấu vết ngay lập tức một cách phi thực tế để tránh bị truy ra.` },
  { section: "LUẬT CHUNG", title: "Giữ chuẩn nhập vai khi bị bắt giữ", text: `Chi tiết: Khi bị kiểm tra, truy đuổi hoặc thẩm vấn, cần tuân thủ đầy đủ quy trình nhập vai thay vì làm qua loa hoặc né tránh.
Ví dụ vi phạm: Bị cảnh sát bắt nhưng không hợp tác, không trả lời, hoặc cố tình phá tình huống.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng ranh giới năng lực nhân vật", text: `Chi tiết: Nhân vật chỉ nên giỏi trong những lĩnh vực đã được xây dựng trước, tránh trở thành người “biết làm mọi thứ”.
Ví dụ vi phạm: Chưa từng có nền tảng nhưng lại tự nhiên hack hệ thống, sửa xe, bắn súng chuyên nghiệp cùng lúc.` },
  { section: "LUẬT CHUNG", title: "Xây dựng quan hệ theo thời gian", text: `Chi tiết: Mối quan hệ giữa các nhân vật cần được phát triển dần thông qua nhiều lần tương tác hợp lý.
Ví dụ vi phạm: Vừa gặp đã tin tưởng tuyệt đối hoặc coi nhau như anh em sống chết.` },
  { section: "LUẬT CHUNG", title: "Giữ giá trị danh tiếng", text: `Chi tiết: Danh tiếng trong thành phố cần được xây dựng từ hành động lặp lại và được cộng đồng công nhận.
Ví dụ vi phạm: Tự nhận mình có “số má lớn” mà không có bất kỳ hành động hay câu chuyện chứng minh.` },
  { section: "LUẬT CHUNG", title: "Không lạm dụng danh nghĩa tổ chức", text: `Chi tiết: Không dùng danh nghĩa băng đảng hoặc công ty để bao che hoặc né tránh trách nhiệm cá nhân.
Ví dụ vi phạm: Gây chuyện cá nhân nhưng lại lôi cả tổ chức ra để đe dọa hoặc trốn hậu quả.` },
  { section: "LUẬT CHUNG", title: "Tôn trọng nhịp phục hồi sau sự kiện lớn", text: `Chi tiết: Sau chấn thương hoặc sự kiện nặng, nhân vật cần có thời gian hồi phục hợp lý trước khi quay lại hoạt động bình thường.
Ví dụ vi phạm: Vừa bị tai nạn nặng nhưng ngay sau đó chạy nhảy, chiến đấu như chưa có gì xảy ra.` },
  { section: "LUẬT CHUNG", title: "Giữ chất lượng trình bày IC", text: `Chi tiết: Giao tiếp rõ ràng, hành động dứt khoát để người khác dễ hiểu và theo kịp tình huống nhập vai.
Ví dụ vi phạm: Nói chuyện khó nghe, hành động mập mờ khiến người khác không thể tiếp tục tình huống.` },
  { section: "LUẬT CHUNG", title: "Bảo vệ tính liên tục của thành phố", text: `Chi tiết: Hãy nhập vai như thể thành phố luôn vận hành liên tục, không phụ thuộc vào sự có mặt của riêng bạn.
Ví dụ vi phạm: Hành xử như thể mọi thứ chỉ tồn tại khi bạn online và bỏ qua logic chung của server` },
  { section: "QUY ĐỊNH", title: "Quy chuẩn bằng chứng & xử lý tranh chấp", text: `Chi tiết: Mọi báo cáo vi phạm (report) phải đi kèm bằng chứng rõ ràng (video, hình ảnh, log chat/voice nếu có). Ưu tiên góc nhìn trực tiếp của người trong cuộc.
Quy định: Trường hợp không đủ bằng chứng hoặc chỉ là “lời nói một phía”, staff có quyền từ chối xử lý hoặc đưa ra quyết định dựa trên mức độ hợp lý của tình huống.
Ví dụ vi phạm: Báo cáo MG/PG nhưng không cung cấp bất kỳ bằng chứng nào.` },
  { section: "QUY ĐỊNH", title: "Quy định Combat RP & leo thang tình huống", text: `Chi tiết: Bạo lực chỉ được sử dụng khi đã có quá trình leo thang hợp lý (lời nói, đe dọa, xung đột rõ ràng). Không được tấn công đột ngột khi chưa có cơ sở nhập vai.
Quy định: Tự vệ phải tương xứng với mức độ nguy hiểm, không lạm dụng để “hợp thức hóa” combat.
Ví dụ vi phạm: Vừa xảy ra va chạm nhẹ đã rút súng bắn ngay lập tức.` },
  { section: "QUY ĐỊNH", title: "Quy định về Initiation (mở tình huống)", text: `Chi tiết: Khi bắt đầu một tình huống có ảnh hưởng lớn (cướp, bắt cóc, chặn xe…), cần có lý do nhập vai rõ ràng và thể hiện qua hành động/đối thoại trước.
Quy định: Người bị tác động phải có cơ hội nhận biết và phản ứng. Không được ép tình huống diễn ra ngay lập tức.
Ví dụ vi phạm: Lao ra chĩa súng yêu cầu đưa tài sản mà không có bất kỳ tương tác trước đó.` },
  { section: "QUY ĐỊNH", title: "Quy định New Life Rule (NLR) chi tiết", text: `Chi tiết: Khi nhân vật “chết” và quay lại, phải mất ký ức về sự kiện dẫn đến cái chết và những người liên quan trực tiếp.
Quy định: Không được quay lại hiện trường ngay lập tức hoặc tham gia tiếp tình huống cũ. Cần có khoảng thời gian hợp lý trước khi quay lại khu vực.
Ví dụ vi phạm: Vừa respawn đã quay lại trả thù đúng người đã giết mình.` },
  { section: "QUY ĐỊNH", title: "Khu vực an toàn (Safe Zone) & vùng nhạy cảm", text: `Chi tiết: Một số khu vực công cộng (bệnh viện, trụ sở chính phủ…) được xem là vùng hạn chế bạo lực.
Quy định: Mọi hành vi gây rối hoặc combat tại đây sẽ bị xử lý nặng do ảnh hưởng đến nhiều tuyến RP khác.
Ví dụ vi phạm: Nổ súng, gây rối tại bệnh viện khi không có lý do đặc biệt hợp lý.` },
  { section: "QUY ĐỊNH", title: "Quy chuẩn kinh tế & giao dịch", text: `Chi tiết: Mọi giao dịch tiền bạc, tài sản phải có tương tác nhập vai rõ ràng và hợp lý.
Quy định: Cấm chuyển tiền/tài sản vô lý nhằm hỗ trợ bạn bè hoặc lách hệ thống.
Ví dụ vi phạm: Chuyển số tiền lớn không lý do, không có bất kỳ RP nào đi kèm.` },
  { section: "QUY ĐỊNH", title: "Quy định về nhiều nhân vật (Alt Character)", text: `Chi tiết: Người chơi có thể sở hữu nhiều nhân vật nhưng mỗi nhân vật phải độc lập về thông tin và mối quan hệ.
Quy định: Cấm chia sẻ thông tin giữa các nhân vật dưới mọi hình thức.
Ví dụ vi phạm: Dùng nhân vật phụ để thu thập thông tin rồi chuyển cho nhân vật chính.` },
  { section: "QUY ĐỊNH", title: "Quy định về tổ chức (Gang / Company)", text: `Chi tiết: Tổ chức cần được xây dựng qua quá trình nhập vai, có mục tiêu, cấu trúc và phát triển theo thời gian.
Quy định: Không được mở rộng quy mô hoặc quyền lực một cách đột ngột, thiếu cơ sở RP.
Ví dụ vi phạm: Tổ chức mới thành lập nhưng ngay lập tức kiểm soát nhiều khu vực hoặc gây ảnh hưởng lớn toàn server.` },
  { section: "QUY ĐỊNH", title: "Quy định về tra tấn & ép cung", text: `Chi tiết: Các hành vi tra tấn, ép cung phải được thực hiện ở mức độ hợp lý và tôn trọng trải nghiệm người chơi khác.
Quy định: Không được lạm dụng để ép người khác cung cấp thông tin hoặc gây khó chịu OOC.
Ví dụ vi phạm: Kéo dài tra tấn vô lý chỉ để ép người khác khai thông tin.` },
  { section: "QUY ĐỊNH", title: "Định nghĩa Fail RP (FRP)", text: `Chi tiết: Fail RP là hành vi nhập vai thiếu logic, không phù hợp bối cảnh hoặc phá vỡ tính chân thực của tình huống.
Ví dụ vi phạm: Hành xử phi thực tế, bỏ qua hậu quả, hoặc thực hiện hành động không có cơ sở RP.` },
  { section: "QUY ĐỊNH", title: "Quy định về Staff & can thiệp", text: `Chi tiết: Staff chỉ can thiệp khi cần thiết để bảo vệ tính công bằng và chất lượng tình huống.
Quy định: Hạn chế tối đa việc can thiệp trực tiếp vào diễn biến IC, trừ khi có vi phạm rõ ràng.
Ví dụ vi phạm: Lạm dụng quyền lực để thay đổi kết quả tình huống không hợp lý.` },
  { section: "QUY ĐỊNH", title: "Cơ chế xử phạt", text: `Chi tiết: Vi phạm sẽ được xử lý theo mức độ (nhẹ → nặng), bao gồm cảnh cáo, phạt, hoặc cấm chơi.
Quy định: Tái phạm nhiều lần sẽ bị xử lý nghiêm khắc hơn.
Ví dụ vi phạm: Lặp lại hành vi MG/PG dù đã được nhắc nhở trước đó.` },
];

const updates = [
  { title: 'STARTER JOBS', tag: '01', text: 'Những công việc đầu tiên giúp bạn thích nghi với thành phố và tạo nguồn thu nhập ban đầu.' },
  { title: 'CITY GUIDE', tag: '02', text: 'Khám phá các địa điểm, dịch vụ và khu vực quan trọng trong thành phố.' },
  { title: 'CHARACTER DEVELOPMENT', tag: '03', text: 'Mỗi quyết định và hành động góp phần định hình con người mà nhân vật của bạn trở thành.' },
  { title: 'FIRST STEPS', tag: '04', text: 'Làm quen với cuộc sống mới thông qua các công việc cơ bản, gặp gỡ những người quanh mình.' },
  { title: 'CAREER PATH', tag: '05', text: 'Từ công việc nhỏ đến các hướng đi dài hạn, mỗi lựa chọn mở ra con đường riêng.' },
  { title: 'BUILD YOUR STORY', tag: '06', text: 'Đừng vội định và hành động góp phần định hình con người, mối quan hệ, cơ hội và cá nhân vật của bạn trở thành.' }
];

const editorialDeck = [
  { src: '/editorial/editorial-1.webp', eyebrow: 'Signature visual 01', note: 'Khung tổng quan mở ra toàn bộ nhịp sống, nghề nghiệp và các tuyến phát triển đặc trưng của thành phố.' },
  { src: '/editorial/editorial-2.webp', eyebrow: 'Signature visual 02', note: 'Phiên bản alternate dùng như nhịp nghỉ thị giác, giữ mood thương hiệu và chiều sâu cho landing page.' },
  { src: '/editorial/editorial-3.webp', eyebrow: 'Live events', note: 'Sự kiện không chỉ để xem. Mỗi lần xuất hiện đều đẩy người chơi vào lựa chọn và hệ quả thực sự.' },
  { src: '/editorial/editorial-4.webp', eyebrow: 'Los Santos', note: 'Một đô thị xa hoa, nhiều cám dỗ, nhiều áp lực và luôn giữ cảm giác mong manh giữa trật tự và hỗn loạn.' },
  { src: '/editorial/editorial-5.webp', eyebrow: 'Player perspective', note: 'Góc nhìn thành phố cho thấy cách người chơi thật sự bước vào đời sống, công việc và những mạch truyện hàng ngày.' },
  { src: '/editorial/editorial-6.webp', eyebrow: 'Freedom and consequence', note: 'Tự do tồn tại, nhưng nó luôn đi kèm giá phải trả, danh tiếng phải giữ và hậu quả phải gánh.' },
  { src: '/editorial/editorial-7.webp', eyebrow: 'Emergency response', note: 'Police và E.M.S là xương sống của những tình huống căng thẳng, nơi thành phố cần người giữ trật tự thật sự.' },
  { src: '/editorial/editorial-8.webp', eyebrow: 'Closing frame', note: 'Khung kết để lại dấu ấn thương hiệu, chốt lại hành trình bằng một cảm giác gọn, sang và có chủ đích.' }
];


function Label({ children }) { return <div className="eyebrow">{children}</div>; }
function Panel({ children, className = '' }) { return <div className={`panel ${className}`}>{children}</div>; }

function PageHero({ eyebrow, title, description, rightTitle, rightItems = [], rightNote, accent = 'blue' }) {
  return (
    <section className={`page-hero accent-${accent}`}>
      <div className="page-hero-art" />
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <Label>{eyebrow}</Label>
          <h1 className="page-hero-title">{title}</h1>
          <p className="page-hero-body">{description}</p>
        </div>
        <Panel className="page-hero-panel">
          <div className="panel-body">
            <Label>Powered by Real Roleplay Team</Label>
            <div className="page-hero-side-title">{rightTitle}</div>
            <div className="panel-stack compact">
              {rightItems.map(([a, b]) => (
                <div className="info-tile" key={a}>
                  <div className="info-title">{a}</div>
                  <div className="info-text">{b}</div>
                </div>
              ))}
            </div>
            {rightNote ? <div className="panel-highlight"><div className="info-text strong-note">{rightNote}</div></div> : null}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Hero({ setPage, discordUrl }) {
  const topStats = [
    ['WHITELIST', 'HỆ THỐNG DUYỆT NGHIÊM NGẶT', 'Chất lượng hơn số lượng. Mỗi người chơi đều được xem xét kỹ.'],
    ['HARD ROLEPLAY', 'NHẬP VAI ĐÚNG - SỐNG ĐÚNG', 'Tuân thủ luật OOC, tạo nên thế giới IC chân thật.'],
    ['COMMUNITY', 'CỘNG ĐỒNG VĂN MINH', 'Tôn trọng - Hợp tác - Cùng nhau xây dựng thành phố.']
  ];
  const rules = [
    ['CHARACTER FIRST', 'Nhân vật của bạn phải có lý lịch rõ ràng, mục tiêu và định hướng phát triển hợp lý.', Users],
    ['SERIOUS ROLEPLAY', 'Chúng tôi tìm kiếm những người chơi thật sự muốn sống trong thế giới này — không phá hoại, không troll.', ScrollText],
    ['REVIEWED BY ADMIN', 'Hồ sơ của bạn sẽ được đội ngũ quản trị xem xét kỹ lưỡng. Quyết định của Admin là quyết định cuối cùng.', Shield]
  ];
  const bottom = [
    ['THÀNH PHỐ LOS SANTOS', 'LẤY CẢM HỨNG TỪ GTA V', Landmark],
    ['NỀN KINH TẾ NGƯỜI CHƠI', 'MỌI THỨ ĐỀU CÓ GIÁ TRỊ', Sparkles],
    ['PHÁT TRIỂN DÀI HẠN', 'KHÔNG CÓ CON ĐƯỜNG TẮT', CalendarDays],
    ['HỆ THỐNG NGHỀ NGHIỆP', 'LIÊN KẾT & PHỤ THUỘC', BadgeCheck]
  ];

  return (
    <section className="rr-home-hero">
      <div className="rr-home-bg" />
      <div className="rr-home-vignette" />
      <div className="container rr-home-inner">
        <div className="rr-home-left">
          <div className="rr-home-kicker">WORK BY DAY — LIVE YOUR LIFE BY NIGHT</div>
          <h1 className="rr-home-title"><span>LIKE A</span><strong>REAL LIFE</strong></h1>
          <p className="rr-home-lead">Real Roleplay không phải là nơi để cày cuốc hay thử vận may. Đây là thành phố của những con người thật sự nhập vai, xây dựng sự nghiệp, các mối quan hệ và đối mặt với hệ quả từ mọi lựa chọn của chính mình.</p>
          <div className="rr-home-actions">
            <button className="rr-solid-btn" onClick={() => setPage('whitelist')}>ĐĂNG KÝ WL <ArrowRight size={18} /></button>
            <button className="rr-outline-btn" onClick={() => setPage('intro')}>TIÊU CHUẨN THÀNH PHỐ</button>
          </div>
          <div className="rr-home-cards">
            {topStats.map(([a,b,c], i) => {
              const Icon = [Shield, Gavel, Users][i];
              return <div className="rr-mini-card" key={a}><div className="rr-mini-icon"><Icon size={30}/></div><h3>{a}</h3><h4>{b}</h4><p>{c}</p></div>;
            })}
          </div>
        </div>
        <div className="rr-home-right">
          <div className="rr-access-panel">
            <div className="rr-section-label">ACCESS REQUIREMENTS</div>
            <h2>VERIFIED ACCESS<br/>CITY QUALITY</h2>
            <div className="rr-access-list">
              {rules.map(([title, text, Icon]) => <div className="rr-access-item" key={title}><div className="rr-access-icon"><Icon size={30}/></div><div><h3>{title}</h3><p>{text}</p></div></div>)}
            </div>
            <div className="rr-next-box"><div><div className="rr-section-label">NEXT STEP</div><h3>ĐĂNG KÝ WL</h3><p>Mỗi đơn đăng ký sẽ được xem xét thủ công. Hãy thể hiện bạn là người xứng đáng bước vào thành phố.</p></div></div>
          </div>
        </div>
        <div className="rr-home-footerbar">
          {bottom.map(([a,b,Icon]) => <div className="rr-footer-chip" key={a}><Icon size={24}/><div><strong>{a}</strong><span>{b}</span></div></div>)}
        </div>
      </div>
    </section>
  );
}


function EditorialDeck() {
  const featureWords = [
    ['REAL', 'Roleplay chân thực, không kịch bản, không lối tắt.'],
    ['POLICE & E.M.S\nSẴN SÀNG\nHỖ TRỢ 24/7', 'Đội ngũ hỗ trợ chuyên nghiệp, đảm bảo công bằng và trải nghiệm tốt nhất.'],
    ['THỜI TRANG\n& ĐẶC TRƯNG', 'Thể hiện phong cách riêng qua trang phục, hình xăm, phụ kiện và dấu ấn cá nhân.'],
    ['RR', 'Lấy cảm hứng từ Los Santos. Một thành phố rộng lớn, sống động và đầy cơ hội.'],
    ['KẾT DUYỆT\nKỸ LƯỠNG', 'Whitelist chọn lọc, đảm bảo chất lượng cộng đồng.'],
    ['ROLE', 'Tự do lựa chọn, tự do hành động. Mọi quyết định đều có hệ quả.'],
    ['PLAY', 'Hệ thống phản ứng nhanh, xử lý kịp thời mọi tình huống.'],
    ['GÓC NHÌN\nTHÀNH PHỐ', 'Nhập vai 100%, sống cuộc sống của nhân vật.']
  ];
  return (
    <section className="rr-showcase">
      <div className="rr-showcase-bg" />
      <div className="container">
        <div className="rr-showcase-head">
          <div>
            <div className="rr-section-label">KHU VỰC NỔI BẬT</div>
            <h2>ĐIỂM NHẤN REAL ROLEPLAY</h2>
            <p>Những yếu tố tạo nên trải nghiệm nhập vai độc đáo và khác biệt.</p>
          </div>
          <div className="rr-pill">8 NỘI DUNG NỔI BẬT</div>
        </div>
        <div className="rr-feature-grid">
          {editorialDeck.map((item, index) => (
            <div className="rr-feature-tile rr-image-only-tile" key={item.src}>
              <img src={item.src} alt="" loading="lazy" decoding="async" />
              <div className="rr-tile-shade" />
              <div className="rr-tile-top"><b>{String(index + 1).padStart(2,'0')}</b></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HomePage({ setPage, discordUrl }) {
  return (
    <>
      <Hero setPage={setPage} discordUrl={discordUrl} />
      <EditorialDeck />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <Label>TỔNG QUAN</Label>
              <h2 className="section-title">HỆ THỐNG THÀNH PHỐ</h2>
            </div>
            <div className="badge elite-badge">PRIVATE ACCESS ONLY</div>
          </div>
          <div className="features-grid">
            {introCards.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="feature-card premium-card">
                    <div className="content">
                      <div className={`accent-bar accent-${item.accent}`}></div>
                      <div className="icon-chip"><Icon size={18} /></div>
                      <div className="card-title">{item.title}</div>
                      <div className="card-text">{item.text}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    

    </>
  );
}



function IntroductionPage() {
  const ecosystem = [
    ['RESOURCE CHAIN', 'Tài nguyên không xuất hiện ngẫu nhiên. Gỗ, cá, vật liệu và hàng hóa đều trở thành nguyên liệu cho các ngành nghề khác.', Sparkles],
    ['PLAYER DRIVEN', 'Nền kinh tế được hình thành từ hành động của người chơi. Giá trị thị trường thay đổi theo nhu cầu thật trong thành phố.', Users],
    ['CONSEQUENCE SYSTEM', 'Mỗi hành động đều để lại hệ quả. Quan hệ, danh tiếng và lựa chọn của bạn có thể mở ra cơ hội hoặc tạo ra rắc rối.', Gavel],
    ['LONG-TERM ROLEPLAY', 'Không có con đường tăng tiến tức thời. Vị trí và tầm ảnh hưởng được xây dựng qua thời gian nhập vai thực tế.', CalendarDays]
  ];
  return (
    <section className="rr-intro-locked">
      <div className="rr-intro-bg" />
      <div className="rr-intro-overlay" />
      <div className="container rr-intro-grid">
        <div className="rr-intro-left">
          <div className="rr-intro-chip">REAL ROLEPLAY • LOS SANTOS • HARD ROLEPLAY</div>
          <h1 className="rr-intro-title"><span>REAL</span><strong>ROLEPLAY</strong></h1>
          <div className="rr-title-line" />
          <h2>TỪ TAY TRẮNG, TẠO DỰNG TƯƠNG LAI CỦA BẠN.</h2>
          <p>Bắt đầu với những công việc đơn giản như câu cá, khai thác gỗ hay tái chế tài nguyên. Từng vật phẩm bạn kiếm được đều có giá trị trong hệ sinh thái kinh tế thật, nơi nghề này tạo nguyên liệu cho nghề khác và mọi quyết định đều ảnh hưởng đến hành trình của bạn.</p>
          <p>Ở đây, không ai sinh ra để ở đỉnh cao. Danh tiếng, tiền bạc và vị thế đều được xây dựng bằng thời gian, nỗ lực và câu chuyện của chính bạn.</p>
          <div className="rr-home-actions rr-intro-actions"><button className="rr-solid-btn">ĐĂNG KÝ WL <ArrowRight size={18}/></button><button className="rr-outline-btn">EARLY JOURNEY</button></div>
          <div className="rr-intro-stats">
            <div><Sparkles size={30}/><h3>ECO</h3><span>LINKED ECONOMY</span><p>Nền kinh tế liên kết, mọi nghề đều có giá trị.</p></div>
            <div><Users size={30}/><h3>RP</h3><span>HARD ROLEPLAY</span><p>Nhập vai nghiêm túc, đề cao tính thực tế.</p></div>
            <div><Shield size={30}/><h3>WL</h3><span>WHITELIST SYSTEM</span><p>Cộng đồng chất lượng, kiểm duyệt nghiêm ngặt.</p></div>
          </div>
        </div>
        <div className="rr-intro-right"><div className="rr-eco-panel"><div className="rr-section-label">CITY ECOSYSTEM</div><h2>EVERY JOB MATTERS</h2>{ecosystem.map(([a,b,Icon])=><div className="rr-eco-item" key={a}><div className="rr-access-icon"><Icon size={32}/></div><div><h3>{a}</h3><p>{b}</p></div></div>)}</div></div>
      </div>
    </section>
  );
}



function RulesHero({ isOoc, setPage }) {
  const heroCards = [
    ['Quy chuẩn cộng đồng', 'Toàn bộ quy định về cách giao tiếp, hành xử và giữ môi trường cộng đồng văn minh.', Sparkles],
    ['Xử lý nghiêm', 'Các hành vi toxic, metagaming, exploit hoặc phá trải nghiệm sẽ bị xử lý nghiêm khắc.', Shield],
    ['Định hướng cộng đồng', 'Real Roleplay ưu tiên sự trưởng thành, tôn trọng và chất lượng người chơi.', Gavel],
    ['Định hướng cộng đồng', 'Real Roleplay ưu tiên sự trưởng thành, tôn trọng và chất lượng người chơi.', Landmark]
  ];

  return (
    <section className="rr-rules-hero">
      <div className="rr-rules-bg" />
      <div className="rr-rules-overlay" />
      <div className="container rr-rules-hero-grid">
        <div className="rr-rules-copy">
          <div className="rr-rules-chip">STANDARDS • COMMUNITY CODE • GUIDELINES</div>
          <h1 className="rr-rules-title"><span>CODE OF</span><strong>PRODUCTS</strong></h1>
          <div className="rr-rules-title-line" />
          <p>Luật chung tổng hợp toàn bộ quy chuẩn ngoài nhân vật, nhận thức roleplay, quy trình xử lý và văn hóa cộng đồng. Các mục quan trọng được đưa lên đầu để người chơi không bỏ sót.</p>
          <div className="rr-rules-actions">
            <button className="rr-rules-primary" onClick={() => setPage?.('whitelist')}>ĐĂNG KÝ WL <ArrowRight size={18} /></button>
            <button className="rr-rules-secondary">EARLY JOURNEY</button>
          </div>
        </div>

        <div className="rr-rules-card-grid">
          {heroCards.map(([title, text, Icon], index) => (
            <div className={`rr-rules-hex rr-rules-hex-${index + 1}`} key={`${title}-${index}`}>
              <div className="rr-rules-icon"><Icon size={44} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
          <div className="rr-rules-note">Đây là nhóm luật chung và tiêu chuẩn cộng đồng.</div>
        </div>
      </div>
    </section>
  );
}

function RulesPage({ type, setPage }) {
  const isOoc = type === 'oc';
  const ruleSet = isOoc ? ocRules : icRules;
  const title = isOoc ? 'Code of Products' : 'Code of IC';
  const eyebrow = isOoc ? 'Standards' : 'Standards';
  const description = isOoc
    ? 'Luật chung tổng hợp toàn bộ quy chuẩn ngoài nhân vật, nhận thức roleplay, quy trình xử lý và văn hóa cộng đồng. Các mục quan trọng được đưa lên đầu để người chơi không bỏ sót.'
    : 'Luật IC giữ cho thành phố có trọng lượng, logic và hậu quả. Cách trình bày được thiết kế để bạn đọc nhanh, nhớ lâu và vẫn giữ được cảm giác luxury của website.';

  const sections = isOoc
    ? ['LUẬT CHUNG', 'QUY ĐỊNH'].map((section) => ({
        section,
        items: ruleSet.filter((item) => item.section === section)
      })).filter((group) => group.items.length)
    : [{ section: 'LUẬT IC', items: ruleSet }];

  const importantRules = ruleSet.filter((item) => item.important);

  return (
    <>
      <RulesHero isOoc={isOoc} setPage={setPage} />

      <section className="section section-tight">
        <div className="container rules-shell">
          <div className="rules-topbar">
            <div>
              <Label>{isOoc ? 'Community code' : 'City doctrine'}</Label>
              <h2 className="section-title rules-title">{isOoc ? 'Out Of Character' : 'In Character'}</h2>
              <p className="section-sub rules-sub">
                {isOoc
                  ? ''
                  : ''}
              </p>
            </div>
            <div className="rules-summary">
              <div className="badge elite-badge">{ruleSet.length} RULES</div>
              <div className="badge rules-important-badge">{importantRules.length} IMPORTANT</div>
            </div>
          </div>

          {importantRules.length ? (
            <div className="important-strip priority-strip">
              {importantRules.map((item) => (
                <div className="important-chip priority-chip" key={item.title}>
                  <span className="priority-glow" />
                  <span className="important-label">IMPORTANT</span>
                  <span className="important-text">{item.title}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="rules-table-stack">
            {sections.map((group) => (
              <div className="rules-table-block" key={group.section}>
                <div className="rules-section-heading">
                  <span>{group.section}</span>
                  <small>{group.items.length} mục</small>
                </div>

                <div className="rules-big-table-wrap">
                  <table className="rules-big-table">
                    <thead>
                      <tr>
                        <th className="rules-index-col">#</th>
                        <th>Nội dung</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item, index) => (
                        <tr className={item.important ? 'is-important-row' : ''} key={item.title}>
                          <td className="rules-index-cell">{String(index + 1).padStart(2, '0')}</td>
                        <td className="rules-name-cell">
  <div className="rule-table-title">{item.title}</div>
  {item.important ? <div className="rule-table-tag">Priority</div> : null}
</td>

<td className="rules-detail-cell">
  {item.text.split('\n').map((line, lineIndex) => (
    <p key={lineIndex}>{line}</p>
  ))}
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function RequestAccessHero({ setPage, onApply }) {
  const cards = [
    ['SINGLE ENTRY', 'Mọi hồ sơ đều đi qua một nguồn duy nhất: Discord Community.', Landmark],
    ['MANUAL REVIEW', 'Mỗi hồ sơ được đội ngũ kiểm tra thủ công.', MessageSquare],
    ['STORY DRIVEN', 'Tiểu sử nhân vật là trọng tâm của đơn xét duyệt.', ScrollText]
  ];

  return (
    <section className="rr-access-hero">
      <div className="rr-access-city" />
      <div className="rr-access-vignette" />
      <div className="rr-access-orbit rr-access-orbit-1" />
      <div className="rr-access-orbit rr-access-orbit-2" />
      <div className="rr-access-sparks">{Array.from({ length: 18 }).map((_, i) => <span key={i} />)}</div>
      <div className="container rr-access-wrap">
        <div className="rr-access-head">
          <h1>ĐĂNG KÝ WL</h1>
          <p>Đây là cánh cổng vào duy nhất của thành phố. Mọi hồ sơ đều đi qua luồng tuyển chọn: gọn, rõ và đủ tinh tế để giữ đúng chất lượng cộng đồng.</p>
        </div>

        <div className="rr-access-map">
          {cards.map(([title, text, Icon], index) => (
            <div className={`rr-access-node rr-access-node-${index + 1}`} key={title}>
              <div className="rr-request-icon"><Icon size={38} /></div>
              <div className="rr-access-card">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rr-access-bottom">
          <div className="rr-access-note">Đây là cánh cổng vào duy nhất của thành phố. Mọi hồ sơ đều đi qua luồng tuyển chọn: gọn, rõ và đủ tinh tế để giữ đúng chất lượng cộng đồng.</div>
          <button className="rr-access-apply" onClick={() => onApply?.()}>
            <span>APPLY NOW</span><ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

function WhitelistPage({ setPage }) {
  const [showApplyPanel, setShowApplyPanel] = useState(false);
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ full_name: '', age: '', rp_experience: '', online_time: '', source: 'Discord Community', short_description: '', backstory: '', why_join: '' });

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const restrictedFields = {
    full_name: /[^a-zA-ZÀ-ỹ\s]/g,
    age: /[^0-9]/g
  };

  const wordLimitedFields = new Set(['short_description', 'backstory', 'why_join']);

  const getWordError = (value, minWords = 50) => {
    const words = countWords(value);
    if (words === 0) return '';
    if (words < minWords) return `Ít nhất ${minWords} chữ`;
    if (words > 300) return 'Tối đa 300 chữ';
    return '';
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;

    if (restrictedFields[name]) {
      setForm((prev) => ({ ...prev, [name]: value.replace(restrictedFields[name], '') }));
      return;
    }

    if (wordLimitedFields.has(name) && countWords(value) > 300) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const wordErrors = [
      getWordError(form.short_description, 50),
      getWordError(form.backstory, 50),
      getWordError(form.why_join, 30)
    ].filter(Boolean);
    if (wordErrors.length) {
      setMessage('Mô tả phải từ 50 đến 300 chữ, tiểu sử phải từ 50 đến 300 chữ và phần vì sao phải từ 30 đến 300 chữ.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/whitelist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setMessage('Đơn whitelist đã được gửi thành công.');
      setForm({ full_name: '', age: '', rp_experience: '', online_time: '', source: 'Discord Community', short_description: '', backstory: '', why_join: '' });
    } catch (err) {
      setMessage(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RequestAccessHero setPage={setPage} onApply={() => setShowApplyPanel(true)} />
      {showApplyPanel && (
        <div className="rr-whitelist-modal" role="dialog" aria-modal="true" aria-label="Whitelist application">
          <div className="rr-whitelist-modal-backdrop" onClick={() => setShowApplyPanel(false)} />
          <div className="rr-whitelist-dashboard">
            <button className="rr-whitelist-close" type="button" onClick={() => setShowApplyPanel(false)} aria-label="Đóng form whitelist">×</button>
            <section className="section section-tight rr-whitelist-modal-section" style={{ position: 'relative' }}><div className="container whitelist-grid"><Panel><div className="panel-body"><Label>Admission note</Label><h2 className="section-title" style={{ marginTop: 12 }}>Before You Apply</h2><p className="section-sub" style={{ marginTop: 18 }}>Người được chấp nhận không chỉ là người trả lời đủ câu hỏi. Đó là người cho thấy mình hiểu roleplay, hiểu cộng đồng và có khả năng xây một nhân vật đáng nhớ.</p><div className="panel-stack">{[['Character First', 'Nhân vật cần có động lực, tính cách và mục tiêu rõ ràng.'], ['Serious Entry', 'Chỉ người chơi phù hợp mới được bước vào.'], ['Manual Review', 'Từng hồ sơ được xem xét cẩn thận thay vì auto accept.']].map(([a, b]) => <div className="info-tile" key={a}><div className="info-title">{a}</div><div className="info-text">{b}</div></div>)}</div></div></Panel><Panel><div className="panel-body"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}><div><Label>Application form</Label><h3 className="section-title" style={{ fontSize: '2.6rem', marginTop: 12 }}>Submit Your Application</h3><p className="section-sub" style={{ marginTop: 12 }}>Trả lời nghiêm túc. Đây là lần đầu tiên thành phố đọc câu chuyện của bạn.</p></div><div className="badge"><BadgeCheck size={14} style={{ marginRight: 8 }} /> verified</div></div>{status !== 'authenticated' ? (<div className="form-note" style={{ marginTop: 24 }}>Bạn cần đăng nhập bằng Discord trước khi nộp whitelist.<div style={{ marginTop: 16 }}><button className="btn-primary" onClick={() => signIn('discord')}>LOGIN WITH DISCORD</button></div></div>) : (<><div className="form-note" style={{ marginTop: 24 }}>Đăng nhập với: <strong style={{ color: '#fff' }}>{session?.user?.globalName || session?.user?.name}</strong><button style={{ marginLeft: 12, border: 0, background: 'transparent', color: '#f4c53a', fontWeight: 700 }} onClick={() => signOut()}>Đổi tài khoản</button></div><form onSubmit={submit}><div className="form-grid-2" style={{ marginTop: 18 }}><input className="input" name="full_name" value={form.full_name} onChange={onChange} placeholder="Họ và tên" inputMode="text" required /><input className="input" value={session?.user?.username || ''} disabled placeholder="Discord username" /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="age" type="text" inputMode="numeric" value={form.age} onChange={onChange} placeholder="Tuổi" required /><input className="input" name="rp_experience" value={form.rp_experience} onChange={onChange} placeholder="Kinh nghiệm roleplay" required /></div><div className="form-grid-2" style={{ marginTop: 14 }}><input className="input" name="online_time" value={form.online_time} onChange={onChange} placeholder="Khung giờ thường online" required /><div className="source-lock"><div className="eyebrow">Nguồn vào duy nhất</div><div className="source-lock-value">Discord Community</div><div className="source-lock-note">Whitelist hiện chỉ nhận hồ sơ từ một nguồn duy nhất để giữ luồng tuyển chọn rõ ràng.</div></div></div><input type="hidden" name="source" value={form.source} /><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea" name="short_description" value={form.short_description} onChange={onChange} placeholder="Mô tả ngắn về bạn: bạn thích kiểu roleplay nào, thái độ khi chơi và điều bạn muốn đóng góp cho cộng đồng." required /><div className="field-meta"><span>{countWords(form.short_description)} / 300 chữ</span><span>Tối thiểu 50 chữ</span></div>{getWordError(form.short_description) && <div className="field-error">{getWordError(form.short_description)}</div>}</div><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea long" name="backstory" value={form.backstory} onChange={onChange} placeholder="Tiểu sử nhân vật: quá khứ, mục tiêu, động lực, mối quan hệ, điểm mạnh - điểm yếu và cách nhân vật của bạn tồn tại trong thành phố." required /><div className="field-meta"><span>{countWords(form.backstory)} / 300 chữ</span><span>Tối thiểu 50 chữ</span></div>{getWordError(form.backstory) && <div className="field-error">{getWordError(form.backstory)}</div>}</div><div className="field-wrap" style={{ marginTop: 14 }}><textarea className="textarea" name="why_join" value={form.why_join} onChange={onChange} placeholder="Vì sao đội ngũ nên chấp nhận bạn? Hãy trả lời ngắn gọn nhưng đủ thuyết phục." required /><div className="field-meta"><span>{countWords(form.why_join)} / 300 chữ</span><span>Tối thiểu 30 chữ</span></div>{getWordError(form.why_join, 30) && <div className="field-error">{getWordError(form.why_join, 30)}</div>}</div><div className="form-note">Đơn whitelist sẽ được đội ngũ staff kiểm tra thủ công. Hãy coi đây là bước giới thiệu bản thân với thành phố, không chỉ là một form để điền cho xong.</div>{message && <div className="form-note" style={{ color: message.includes('thành công') ? '#fde68a' : '#fca5a5' }}>{message}</div>}<button type="submit" className="btn-full" disabled={loading} style={{ marginTop: 18 }}>{loading ? 'SUBMITTING...' : 'ĐĂNG KÝ WL'}</button></form></>)}</div></Panel></div></section>
          </div>
        </div>
      )}
    </>
  );
}

function UpdatePage() {
  return (
    <section className="rr-update-reference">
      <div className="rr-update-reference-bg-mark" aria-hidden="true" />
      <div className="rr-update-reference-inner">
        <div className="rr-update-reference-kicker">REAL ROLEPLAY</div>
        <h1 className="rr-update-reference-title">UPDATE 1.0 SỰ KHỞI ĐẦU</h1>
        <p className="rr-update-reference-desc">
          Bắt đầu từ con số không. Không tài sản, không những vội thông qua công danh tiếng,
          gặp gỡ. Mỗi quyết định đầu tiên sẽ định hình cách tồn tại trong thành phố.
        </p>

        <div className="rr-update-reference-grid">
          {updates.map((item) => (
            <article className="rr-update-reference-card" key={item.tag}>
              <div className="rr-update-reference-badge">{item.tag}</div>
              <div className="rr-update-reference-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>{item.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscordPage({ discordUrl }) {
  return (
    <>
      <PageHero eyebrow="Community hub" title="Discord" description="Discord không thay thế whitelist. Nó là nơi giữ nhịp cộng đồng, thông báo, hỗ trợ và toàn bộ luồng giao tiếp bên ngoài thành phố." rightTitle="Community Flow" rightItems={[['Announcements', 'Mọi thay đổi quan trọng đều đi qua đây.'], ['Support', 'Ticket và hướng dẫn luôn rõ ràng.'], ['Culture', 'Discord phải mang cùng mood với website và server.']]} rightNote="Một community sang không chỉ đến từ visual, mà còn đến từ cách tổ chức và giọng điệu giao tiếp." accent="gold" />
      <section className="section section-tight"><div className="container discord-grid"><div className="discord-card premium-card"><div className="content"><Label>Community</Label><h2 className="section-title">Discord Access</h2><p className="section-sub" style={{ marginTop: 18 }}>Discord là trung tâm cộng đồng, thông báo, hỗ trợ và nhịp sống ngoài thành phố.</p><div className="panel-stack">{['Thông báo server', 'Kênh cộng đồng', 'Ticket hỗ trợ', 'Cập nhật sự kiện'].map((item) => <div className="info-tile" key={item}>{item}</div>)}</div><button className="btn-primary" style={{ marginTop: 28 }} onClick={() => window.open(discordUrl, '_blank', 'noopener,noreferrer')}>JOIN DISCORD <ExternalLink size={15} style={{ marginLeft: 8 }} /></button></div></div><div className="discord-card premium-card"><div className="content"><div className="info-tile"><div className="eyebrow">Invite link</div><div style={{ marginTop: 16, fontSize: 18, wordBreak: 'break-all' }}>{discordUrl}</div></div><div className="features-grid icon-grid" style={{ marginTop: 20 }}>{[['Live announcements', Bell], ['Community channels', Users], ['Event notices', CalendarDays], ['Staff support', MessageSquare]].map(([title, Icon]) => (<div className="info-tile" key={title}><Icon size={18} color="#a1a1aa" /><div className="info-title" style={{ marginTop: 14 }}>{title}</div></div>))}</div></div></div></div></section>
    </>
  );
}

export default function SiteApp({ discordUrl, initialPage = 'home' }) {
  const [page, setPage] = useState(initialPage);
  const [mobileOpen, setMobileOpen] = useState(false);

  const view = useMemo(() => {
    switch (page) {
      case 'intro': return <IntroductionPage />;
      // case 'rules-ic': return <RulesPage type="ic" />;
      case 'rules-oc': return <RulesPage type="oc" setPage={setPage} />;
      case 'whitelist': return <WhitelistPage setPage={setPage} />;
      case 'update': return <UpdatePage />;
      case 'discord': return <DiscordPage discordUrl={discordUrl} />;
      default: return <HomePage setPage={setPage} discordUrl={discordUrl} />;
    }
  }, [page, discordUrl]);

  return (
    <div className={`page-shell page-${page}`}>
      <Navbar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} discordUrl={discordUrl} />
      <main>{view}</main>
    </div>
  );
}
