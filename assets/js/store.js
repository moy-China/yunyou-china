/* ============================================================
   云游中国 · 数据层（模拟 MySQL 数据库，使用 localStorage 持久化）
   演示项目：字段结构与 PHP + MySQL 表一一对应，便于后续移植
   ============================================================ */
(function (global) {
  'use strict';

  var DB_KEY = 'yunyou_china_db_v2';
  var SESSION_KEY = 'yunyou_china_session_v1';

  var CATEGORIES = [
    { name: '自然风光', icon: '🏔️', desc: '山川湖海，天地大美' },
    { name: '历史古迹', icon: '🏯', desc: '千年文脉，岁月留痕' },
    { name: '古镇村落', icon: '🏘️', desc: '小桥流水，梦里水乡' },
    { name: '海滨度假', icon: '🏖️', desc: '碧海银沙，椰风海浪' },
    { name: '主题乐园', icon: '🎢', desc: '童话世界，欢乐王国' },
    { name: '博物馆文化', icon: '🏛️', desc: '一眼千年，文明华章' },
    { name: '宗教圣地', icon: '🙏', desc: '梵音袅袅，心灵净土' },
    { name: '现代地标', icon: '🌃', desc: '都市天际，璀璨灯火' }
  ];

  var SEED = {
    settings: {
      siteName: '云游中国',
      slogan: '览尽华夏好风光',
      announcement: '欢迎来到「云游中国」，本站为毕业设计演示站点，所有景点信息与图片均为演示数据。'
    },
    users: [
      { id: 'u_admin', username: 'admin', password: 'admin123', nickname: '系统管理员', role: 'admin', status: 'active', createdAt: '2026-09-01' },
      { id: 'u_demo', username: 'demo', password: '123456', nickname: '小游', role: 'user', status: 'active', createdAt: '2026-09-10' },
      { id: 'u_fan', username: 'travel_fan', password: '123456', nickname: '旅行达人阿杰', role: 'user', status: 'active', createdAt: '2026-09-12' },
      { id: 'u_shan', username: 'shanshui', password: '123456', nickname: '山水间', role: 'user', status: 'active', createdAt: '2026-09-18' }
    ],
    attractions: [
      {
        id: 'huangshan', name: '黄山', category: '自然风光', province: '安徽', rating: 4.9, visits: 158200,
        tags: ['奇松怪石', '云海日出', '世界遗产'], summary: '奇松、怪石、云海、温泉“四绝”齐聚，徐霞客叹曰“黄山归来不看岳”。',
        intro: [
          '黄山横亘皖南，七十二峰以莲花峰、光明顶、天都峰最为雄奇。山间松树扎根于悬崖石缝，迎客松舒展的枝干恰似张开的臂膀，成为这座山的标志。',
          '云海是黄山最震撼的奇观：雨后初晴，云雾在山谷间翻涌成海，群峰如岛屿般浮沉其间，日出时霞光把云海染成一片金红。',
          '西海大峡谷的栈道贴着绝壁蜿蜒而下，脚下是万丈深谷，远处的怪石“猴子观海”“飞来石”惟妙惟肖，四季景致各异。'
        ],
        hours: '旺季 06:30–17:30，淡季 07:00–16:30',
        ticket: '旺季 190 元/人，淡季 150 元/人（索道另计）',
        transport: '乘高铁至黄山北站，换乘景区班车约 1 小时到达汤口换乘中心。',
        address: '安徽省黄山市黄山区',
        tips: ['建议住山上或汤口，凌晨登光明顶看日出。', '云海易在雨雪后放晴的清晨出现，提前看天气预报。', '西海大峡谷地轨缆车值得体验，旺季排队较长。', '穿防滑鞋，带足水和轻便外套，山间昼夜温差大。'],
        featured: true, status: 'published', createdAt: '2026-09-01'
      },
      {
        id: 'jiuzhaigou', name: '九寨沟', category: '自然风光', province: '四川', rating: 4.8, visits: 146000,
        tags: ['高原湖泊', '钙华瀑布', '秋色'], summary: '“九寨归来不看水”，一百多个海子像被打翻的调色盘，蓝得醉人。',
        intro: [
          '九寨沟因沟内九个藏族村寨得名，三条主沟呈“Y”字形分布。五花海、五彩池的水清澈见底，湖底的钙华与倒木在水下呈现出蓝、绿、黄交织的层次。',
          '诺日朗瀑布是中国最宽的钙华瀑布，水流从高处铺展开来，轰鸣声响彻山谷；镜海在无风时把雪山和彩林倒映得纤毫不差。',
          '每到秋季，层林尽染的红黄彩叶与碧蓝湖水相映，是九寨沟最美的季节，随手一拍都是明信片。'
        ],
        hours: '旺季 07:30–18:00，淡季 08:30–17:00',
        ticket: '旺季 169 元/人 + 观光车 90 元，淡季 80 元/人',
        transport: '乘飞机至九寨黄龙机场，或从成都乘长途大巴约 8 小时。',
        address: '四川省阿坝州九寨沟县',
        tips: ['门票需提前实名预约，入园刷身份证。', '观光车票建议购买，沟内单程 40 多公里。', '海拔约 2000–3100 米，放慢脚步防高反。', '秋季红叶最美，国庆前后人流最多，错峰更佳。'],
        featured: true, status: 'published', createdAt: '2026-09-01'
      },
      {
        id: 'zhangjiajie', name: '张家界', category: '自然风光', province: '湖南', rating: 4.7, visits: 132500,
        tags: ['峰林地貌', '阿凡达', '玻璃栈道'], summary: '三千奇峰拔地而起，云雾缭绕的砂岩峰林如仙境。',
        intro: [
          '张家界国家森林公园以石英砂岩峰林地貌闻名，三千多座石峰如竹笋般拔地而起，是电影《阿凡达》悬浮山的灵感来源。',
          '袁家界的“天下第一桥”横跨两峰之间，天然石桥凌空飞架；哈利路亚山原型“乾坤柱”直插云霄，四周云海翻涌。',
          '天门山九十九道弯的盘山公路与玻璃栈道惊险刺激，天门洞高悬绝壁之上，云雾穿洞而过，恍若天门大开。'
        ],
        hours: '07:00–18:00',
        ticket: '森林公园 248 元/人（4 天有效），天门山 275 元/人',
        transport: '乘高铁至张家界西站，市区有景区班车直达各入口。',
        address: '湖南省张家界市武陵源区',
        tips: ['森林公园分多个入口，提前规划好路线再进山。', '玻璃栈道和索道均需另购票，旺季排队久。', '雨天雾大能见度低，选晴天前往。', '景区面积大，建议安排 2–3 天游览。'],
        featured: true, status: 'published', createdAt: '2026-09-02'
      },
      {
        id: 'guilin', name: '桂林漓江', category: '自然风光', province: '广西', rating: 4.6, visits: 128300,
        tags: ['喀斯特', '竹筏漂流', '20元背景'], summary: '山水甲天下，乘竹筏顺江而下，人在画中游。',
        intro: [
          '“江作青罗带，山如碧玉簪。”漓江从桂林蜿蜒至阳朔，两岸喀斯特峰丛连绵，倒映在碧绿的江水里，如水墨长卷徐徐展开。',
          '兴坪至九马画山一段是漓江精华，黄布倒影的群山倒映江中，正是 20 元人民币背面的取景地。',
          '遇龙河竹筏漂流更为清幽，水面如镜，田园与村落点缀其间，适合放慢节奏慢慢感受。'
        ],
        hours: '全天（游船约 09:00–14:00 发船）',
        ticket: '漓江游船约 210–360 元/人，遇龙河竹筏分段计费',
        transport: '乘高铁至桂林站或桂林北站，市区到磨盘山码头约 40 分钟。',
        address: '广西壮族自治区桂林市',
        tips: ['漓江精华段游船与竹筏观感不同，可各体验一次。', '兴坪古镇和 20 元背景图打卡点别错过。', '夏季多雨，注意防晒和防蚊。', '阳朔西街夜晚热闹，可住宿一晚。'],
        featured: true, status: 'published', createdAt: '2026-09-02'
      },
      {
        id: 'kanasi', name: '喀纳斯湖', category: '自然风光', province: '新疆', rating: 4.5, visits: 98600,
        tags: ['变色湖', '秋色', '禾木村'], summary: '中国最美湖泊之一，湖水随季节变幻色彩，神秘“水怪”传说更添魅力。',
        intro: [
          '喀纳斯湖深藏在阿尔泰山腹地，湖水由冰川融水汇聚而成，随光线与季节在乳白、碧蓝、墨绿间变幻，被誉为“变色湖”。',
          '观鱼亭是俯瞰全湖的最佳位置，登高远望，湖面如一块翡翠镶嵌在原始森林之间，远处的友谊峰终年积雪。',
          '秋季白桦与落叶松染成金黄，晨雾中的禾木、白哈巴村落炊烟袅袅，是摄影爱好者心中的天堂。'
        ],
        hours: '08:00–20:00',
        ticket: '旺季 160 元/人（区间车另计）',
        transport: '乘飞机至喀纳斯机场，或从乌鲁木齐乘车至布尔津后换乘。',
        address: '新疆维吾尔自治区阿勒泰地区布尔津县',
        tips: ['景区区间车是主要交通，旺季务必提前购票。', '观鱼亭需要爬一千多级台阶，量力而行。', '昼夜温差大，即便是夏天也要带厚外套。', '秋季九月底至十月初最美，也最拥挤。'],
        featured: true, status: 'published', createdAt: '2026-09-03'
      },
      {
        id: 'xihu', name: '杭州西湖', category: '自然风光', province: '浙江', rating: 4.7, visits: 176000,
        tags: ['西湖十景', '免费', '世界遗产'], summary: '人间天堂，十景环绕一湖碧水，免费开放的世界遗产。',
        intro: [
          '西湖三面环山，一湖碧水如明镜。苏堤、白堤如两条玉带横贯湖面，桃红柳绿间，游人与画舫点缀其中。',
          '“西湖十景”各具韵味：断桥残雪、雷峰夕照、三潭印月、曲院风荷，四季更迭皆有看头，烟雨时最是朦胧婉约。',
          '环湖群山之中，灵隐寺梵音袅袅，龙井茶山层层叠翠，文化与山水在此交融，走一圈便读懂江南。'
        ],
        hours: '全天开放',
        ticket: '免费（三潭印月、岳王庙等个别景点另收费）',
        transport: '地铁 1 号线至龙翔桥站，步行即达湖滨。',
        address: '浙江省杭州市西湖区',
        tips: ['环湖步行或骑行最惬意，全程约 12 公里。', '三潭印月需乘船上岛，游船约 55 元/人。', '雷峰塔傍晚登高可赏西湖日落全景。', '避开周末和节假日，清晨的西湖最安静。'],
        featured: true, status: 'published', createdAt: '2026-09-03'
      },
      {
        id: 'gugong', name: '故宫博物院', category: '历史古迹', province: '北京', rating: 4.9, visits: 201000,
        tags: ['皇家宫殿', '世界遗产', '博物馆'], summary: '明清两代皇宫，红墙金瓦间的皇家气象，世界现存规模最大的木结构古建筑群。',
        intro: [
          '故宫旧称紫禁城，沿中轴线对称展开，太和殿、中和殿、保和殿三大殿巍峨庄严，红墙黄瓦在阳光下金碧辉煌。',
          '走近看，脊兽、彩画、斗拱与琉璃瓦处处藏着礼制与匠心；御花园古树参天，东西六宫则藏着说不尽的宫廷往事。',
          '如今故宫也是顶级博物馆，书画、瓷器、钟表等馆藏超过 186 万件，角楼与护城河的四季晨昏更是摄影胜地。'
        ],
        hours: '旺季 08:30–17:00，淡季 08:30–16:30（周一闭馆）',
        ticket: '旺季 60 元/人，淡季 40 元/人',
        transport: '地铁 1 号线天安门东/西站，或 2 号线前门站步行前往。',
        address: '北京市东城区景山前街 4 号',
        tips: ['必须提前在官网实名预约，现场不售票。', '从午门进、神武门出，单向游览不走回头路。', '珍宝馆、钟表馆需另购票，值得一看。', '登景山万春亭可俯瞰故宫全景，傍晚最美。'],
        featured: true, status: 'published', createdAt: '2026-09-04'
      },
      {
        id: 'changcheng', name: '八达岭长城', category: '历史古迹', province: '北京', rating: 4.6, visits: 167000,
        tags: ['世界遗产', '好汉坡', '关隘'], summary: '“不到长城非好汉”，蜿蜒于崇山峻岭的万里雄关。',
        intro: [
          '八达岭是明长城中保存最完好、最具代表性的一段，城墙依山势而建，如巨龙盘踞在燕山山脉之上。',
          '北八楼是好汉坡的制高点，登上敌楼极目远眺，城墙随山脊起伏，层层叠叠没入天际，气势磅礴。',
          '脚下的关城曾是居庸关前哨、兵家必争之地，斑驳的城砖与箭窗无声诉说着数百年的烽火岁月。'
        ],
        hours: '06:30–16:30（旺季延至 19:00）',
        ticket: '旺季 40 元/人，淡季 35 元/人',
        transport: '德胜门乘 877 路公交，或乘 S2 线市郊铁路至八达岭站。',
        address: '北京市延庆区',
        tips: ['尽量早去，避开上午十点后的客流高峰。', '北坡较陡，穿运动鞋，量力而行。', '可乘缆车或滑车，节省体力。', '秋季红叶与长城相映，是拍照好时节。'],
        featured: true, status: 'published', createdAt: '2026-09-04'
      },
      {
        id: 'bingmayong', name: '秦始皇兵马俑', category: '历史古迹', province: '陕西', rating: 4.8, visits: 159000,
        tags: ['世界第八大奇迹', '陶俑', '考古'], summary: '世界第八大奇迹，两千年前的千军万马在地下静候。',
        intro: [
          '兵马俑是秦始皇陵的陪葬坑，已出土陶俑、陶马八千余件，规模之宏大令人震撼。',
          '一号坑最为壮观，数千名陶俑列阵而立，千人千面，发式、甲衣、神情各不相同，仿佛一声令下便会冲锋。',
          '铜车马工艺之精堪称青铜之冠，跪射俑、将军俑等精品更是让人惊叹秦代工匠的写实功力。'
        ],
        hours: '08:30–17:00',
        ticket: '120 元/人',
        transport: '西安火车站东广场乘游 5 路（306 路）直达。',
        address: '陕西省西安市临潼区',
        tips: ['建议从三号坑倒序参观，先看精品再看大坑。', '拼个讲解或租讲解器，能看懂门道。', '避开周末人流，上午早到观感更佳。', '与华清宫、骊山同线，可安排一日游。'],
        featured: true, status: 'published', createdAt: '2026-09-05'
      },
      {
        id: 'wuzhen', name: '乌镇', category: '古镇村落', province: '浙江', rating: 4.5, visits: 112000,
        tags: ['水乡', '夜景', '摇橹船'], summary: '江南水乡典范，小桥流水、白墙黛瓦，似水墨画里的故乡。',
        intro: [
          '乌镇分东栅、西栅，东栅保留着原汁原味的水乡生活，西栅则以夜景闻名。',
          '石板路沿河而筑，木楼枕水而居，乌篷船摇橹穿行桥洞之间，摇碎了满河灯影。',
          '西栅的夜晚，灯笼次第亮起，酒吧与评弹一静一动，是江南水乡最动人的一面。'
        ],
        hours: '东栅 07:00–18:00，西栅 09:00–22:00',
        ticket: '东栅 120 元/人，西栅 150 元/人（联票 190 元）',
        transport: '乘高铁至桐乡站，换乘 K350 公交直达。',
        address: '浙江省嘉兴市桐乡市',
        tips: ['西栅夜景必看，建议住西栅内或附近。', '清晨的东栅最清静，适合拍照。', '尝尝姑嫂饼、三白酒和酱鸭。', '联票当日有效，合理安排时间。'],
        featured: true, status: 'published', createdAt: '2026-09-05'
      },
      {
        id: 'fenghuang', name: '凤凰古城', category: '古镇村落', province: '湖南', rating: 4.3, visits: 98000,
        tags: ['边城', '吊脚楼', '沱江'], summary: '沈从文笔下的边城，吊脚楼沿沱江而立，夜色璀璨如星。',
        intro: [
          '凤凰古城依沱江而建，土家吊脚楼一半悬于江上，一半倚靠山崖，古拙而灵动。',
          '虹桥横跨江面，跳岩连接两岸，苗家阿妹的山歌与银饰叮当声顺着江风飘来。',
          '入夜后灯火把古城染成暖金，沱江倒影摇曳，酒吧与篝火让这座边城热闹而迷离。'
        ],
        hours: '全天（核心区 08:00–18:00）',
        ticket: '免费进入古城（部分景点联票另购）',
        transport: '乘高铁至凤凰古城站，换乘景区接驳车。',
        address: '湖南省湘西州凤凰县',
        tips: ['夜晚的江边夜景不可错过，清晨则安静秀美。', '吊脚楼民宿很多，选江景房观景更佳。', '体验苗服旅拍，别有一番风情。', '沱江泛舟建议傍晚，灯影最美。'],
        featured: false, status: 'published', createdAt: '2026-09-06'
      },
      {
        id: 'wuyuan', name: '婺源篁岭', category: '古镇村落', province: '江西', rating: 4.4, visits: 104000,
        tags: ['晒秋', '油菜花', '徽派建筑'], summary: '中国最美乡村，晒秋与油菜花海是它的两张名片。',
        intro: [
          '篁岭古村挂在山崖之上，徽派白墙黛瓦错落有致，是婺源山村的代表。',
          '秋天，家家户户的晒架上铺满辣椒、玉米、菊花，五彩的“晒秋”从屋顶倾泻而下，美得热烈。',
          '春天，山间梯田铺满金黄油菜花，与古村、炊烟构成一幅生机盎然的田园画卷。'
        ],
        hours: '08:00–17:30',
        ticket: '145 元/人（含索道）',
        transport: '乘高铁至婺源站，转乘景区班车约 40 分钟。',
        address: '江西省上饶市婺源县',
        tips: ['晒秋最美在 9–11 月，油菜花在 3–4 月。', '索道上下山，古村建在半山腰。', '住篁岭村内可看日出和夜晚的晒秋。', '顺路可游江湾、李坑等徽派村落。'],
        featured: false, status: 'published', createdAt: '2026-09-06'
      },
      {
        id: 'yalongwan', name: '三亚亚龙湾', category: '海滨度假', province: '海南', rating: 4.6, visits: 121000,
        tags: ['天下第一湾', '潜水', '度假酒店'], summary: '天下第一湾，碧海银沙与椰风树影的度假天堂。',
        intro: [
          '亚龙湾拥有约 7 公里长的洁白沙滩，海水清澈见底，能见度可达 10 米以上，被誉为“天下第一湾”。',
          '湾内度假酒店林立，推开窗便是椰林与海景，躺着发呆、戏水、玩沙，都是最惬意的打开方式。',
          '海湾外可体验潜水、摩托艇、帆船等水上项目，海底珊瑚与热带鱼群近在眼前。'
        ],
        hours: '全天开放',
        ticket: '免费（水上项目另收费）',
        transport: '凤凰机场打车约 30 分钟，或乘公交 27 路。',
        address: '海南省三亚市吉阳区',
        tips: ['海水最清在上午，适合拍照和浮潜。', '潜水选正规门店，注意安全与价格。', '避开春节等节假日，房价和机票高企。', '海边紫外线强烈，做好防晒。'],
        featured: true, status: 'published', createdAt: '2026-09-07'
      },
      {
        id: 'gulangyu', name: '鼓浪屿', category: '海滨度假', province: '福建', rating: 4.8, visits: 139000,
        tags: ['万国建筑', '海上花园', '文艺'], summary: '海上花园，万国建筑与琴声交织的文艺小岛。',
        intro: [
          '鼓浪屿面积仅 1.88 平方公里，却藏着上千座风格各异的老别墅，中西建筑在此混搭成“万国建筑博览”。',
          '岛上没有机动车，只有步道与小巷，三角梅爬满院墙，琴声从老宅飘出，处处透着慵懒的文艺气息。',
          '日光岩是制高点，登顶可俯瞰鹭江与厦门城景；海滨浴场与菽庄花园则适合慢悠悠地闲逛。'
        ],
        hours: '全天开放（船班 06:30–24:00）',
        ticket: '上岛船票 35 元/人（核心景点联票 90 元）',
        transport: '厦门轮渡码头乘船约 20 分钟登岛。',
        address: '福建省厦门市思明区',
        tips: ['船票需提前在官方平台实名预订。', '日光岩清晨登顶，避开人流看日出。', '小岛不大，靠步行慢慢逛最合适。', '尝尝沙茶面、海蛎煎、土笋冻。'],
        featured: true, status: 'published', createdAt: '2026-09-07'
      },
      {
        id: 'qingdao', name: '青岛栈桥', category: '海滨度假', province: '山东', rating: 4.3, visits: 89000,
        tags: ['百年地标', '海鸥', '红瓦绿树'], summary: '青岛的百年地标，延伸入海的回澜阁与成群海鸥。',
        intro: [
          '栈桥始建于清末，长 440 米，像一条长臂伸入青岛湾，尽头的回澜阁八角飞檐，是青岛的象征。',
          '冬季成千上万只海鸥聚集于此，展翅掠过海面，喂海鸥成了栈桥最动人的风景。',
          '沿桥漫步，一侧是红瓦绿树的老城，一侧是碧海蓝天，海风裹着咸味扑面而来。'
        ],
        hours: '全天开放',
        ticket: '免费',
        transport: '地铁 3 号线青岛站步行约 5 分钟。',
        address: '山东省青岛市市南区',
        tips: ['冬季（11 月至次年 3 月）是看海鸥的最佳时节。', '回澜阁登阁免费，但需排队限流。', '栈桥与八大关、小青岛同线，可一并游览。', '退潮时礁石露出来，适合赶海拍照。'],
        featured: false, status: 'published', createdAt: '2026-09-08'
      },
      {
        id: 'disney', name: '上海迪士尼度假区', category: '主题乐园', province: '上海', rating: 4.7, visits: 188000,
        tags: ['童话城堡', '烟花秀', '亲子'], summary: '梦幻童话世界，城堡烟花点亮每一个童心。',
        intro: [
          '上海迪士尼是中国内地首座迪士尼乐园，奇幻童话城堡高耸入云，是全球最大的迪士尼城堡。',
          '创极速光轮、加勒比海盗、飞越地平线等项目人气爆棚，花车巡游与夜光幻影秀把氛围拉满。',
          '园区还有迪士尼小镇与星愿公园，购物、餐饮、演出齐全，大人小孩都能找到快乐。'
        ],
        hours: '08:30–21:30（以当日公告为准）',
        ticket: '常规日约 475–719 元/人（浮动定价）',
        transport: '地铁 11 号线迪士尼站直达。',
        address: '上海市浦东新区川沙镇',
        tips: ['下载官方 App，随时看排队时间并预约快速通行。', '提前入园或购买早享卡，可减少热门项目排队。', '烟花秀时间以 App 公告为准，提前占位。', '可自带未开封食品，园区餐饮偏贵。'],
        featured: true, status: 'published', createdAt: '2026-09-08'
      },
      {
        id: 'chimeilong', name: '广州长隆旅游度假区', category: '主题乐园', province: '广东', rating: 4.0, visits: 126000,
        tags: ['野生动物', '水上乐园', '大马戏'], summary: '集野生动物、水上乐园、马戏于一身的欢乐王国。',
        intro: [
          '长隆旅游度假区涵盖野生动物世界、欢乐世界、水上乐园、飞鸟乐园与马戏，是华南最大的综合度假区之一。',
          '野生动物世界可自驾或乘小火车穿越动物栖息地，长颈鹿、白虎、考拉近在咫尺。',
          '欢乐世界的垂直过山车惊险刺激，夜晚的大马戏则用高难度表演点燃全场。'
        ],
        hours: '各园区 09:30 起（以公告为准）',
        ticket: '各园区单独售票，约 200–350 元/人',
        transport: '地铁 3 号线/7 号线汉溪长隆站。',
        address: '广东省广州市番禺区',
        tips: ['野生动物世界建议上午入园，动物更活跃。', '自驾区需另购车辆票，可乘免费小火车。', '大马戏与园区分开售票，提前订票选座。', '夏季水上乐园需备泳衣、防水袋。'],
        featured: true, status: 'published', createdAt: '2026-09-09'
      },
      {
        id: 'sanxingdui', name: '三星堆博物馆', category: '博物馆文化', province: '四川', rating: 4.7, visits: 117000,
        tags: ['古蜀文明', '青铜神树', '考古'], summary: '沉睡数千年，一醒惊天下，神秘的古蜀文明。',
        intro: [
          '三星堆遗址出土的青铜神树、大立人、纵目面具等文物造型奇特，颠覆了人们对古蜀文明的想象。',
          '青铜大立人通高 2.62 米，姿态庄重神秘；青铜面具双目凸出、耳大招风，仿佛来自另一个世界。',
          '新馆陈列系统完整，数字化的展示手段让沉睡的文物“活”了起来，处处是谜题与震撼。'
        ],
        hours: '08:30–18:00（周一闭馆）',
        ticket: '72 元/人',
        transport: '乘高铁至广汉北站，转乘公交或打车约 15 分钟。',
        address: '四川省德阳市广汉市',
        tips: ['新馆需提前在官方平台预约门票。', '留足 3 小时以上，文物数量多且精彩。', '可租讲解器或跟讲解，了解背景更震撼。', '与成都市区约 1 小时车程，可安排半日游。'],
        featured: true, status: 'published', createdAt: '2026-09-09'
      },
      {
        id: 'shanlibo', name: '陕西历史博物馆', category: '博物馆文化', province: '陕西', rating: 4.5, visits: 133000,
        tags: ['周秦汉唐', '国宝', '免费'], summary: '古都明珠，华夏宝库，馆藏文物跨越百万年。',
        intro: [
          '陕西历史博物馆藏品超过 170 万件，从蓝田猿人到周秦汉唐，一部文物史就是半部中华文明史。',
          '镇馆之宝众多：镶金兽首玛瑙杯、舞马衔杯银壶、唐三彩骆驼载乐俑，件件精美绝伦。',
          '唐代壁画馆与何家村窖藏更是国宝中的国宝，让人流连忘返。'
        ],
        hours: '08:30–17:30（周一闭馆）',
        ticket: '免费（需预约，部分特展收费）',
        transport: '地铁 2 号线/3 号线小寨站步行可达。',
        address: '陕西省西安市雁塔区',
        tips: ['免费票需提前多日在官方平台预约，非常抢手。', '上午场人较少，建议最早时段入馆。', '唐代壁画馆和何家村窖藏需另购特展票。', '与大雁塔相邻，可安排同一天游览。'],
        featured: true, status: 'published', createdAt: '2026-09-10'
      },
      {
        id: 'budalagong', name: '布达拉宫', category: '宗教圣地', province: '西藏', rating: 4.9, visits: 124000,
        tags: ['雪域圣殿', '世界遗产', '高原'], summary: '世界屋脊上的宫殿，红白两色的雪域圣殿。',
        intro: [
          '布达拉宫依红山而建，海拔约 3700 米，红宫、白宫层层叠叠，金顶在高原阳光下熠熠生辉。',
          '宫内壁画、唐卡、佛像与历代达赖灵塔富丽堂皇，处处弥漫着酥油灯的暖香与诵经声。',
          '从药王山或宗角禄康公园远眺，红白两色的宫殿与雪山、蓝天相映，神圣而壮美。'
        ],
        hours: '09:00–16:00',
        ticket: '旺季 200 元/人，淡季 100 元/人',
        transport: '拉萨市区打车或乘公交，步行前往大昭寺约 15 分钟。',
        address: '西藏自治区拉萨市城关区',
        tips: ['门票需提前预约，并携带身份证。', '初到高原先适应一两天再游览，防高反。', '宫殿内部禁止拍照，着装庄重。', '登宫台阶较多，慢行并注意保暖。'],
        featured: true, status: 'published', createdAt: '2026-09-10'
      },
      {
        id: 'mogao', name: '敦煌莫高窟', category: '宗教圣地', province: '甘肃', rating: 4.8, visits: 118000,
        tags: ['千年佛国', '壁画', '世界遗产'], summary: '沙漠中的千年佛国，世界现存规模最大的石窟艺术宝库。',
        intro: [
          '莫高窟始建于十六国时期，历经千年营建，现存洞窟 735 个，壁画 4.5 万平方米，彩塑 2400 余身。',
          '壁画中的飞天衣袂飘飘、反弹琵琶，洞窟里的佛像宝相庄严，是丝绸之路上最璀璨的艺术明珠。',
          '九层楼是莫高窟的标志，洞窟外的鸣沙山与月牙泉则让大漠更添苍茫诗意。'
        ],
        hours: '08:30–17:30',
        ticket: '旺季 238 元/人（含数字展示中心）',
        transport: '敦煌市区打车或乘公交约 25 分钟。',
        address: '甘肃省酒泉市敦煌市',
        tips: ['旺季门票一票难求，务必提前一个月预约。', '先到数字展示中心观影，再乘摆渡车入窟。', '窟内禁止拍照，保护壁画人人有责。', '傍晚去鸣沙山月牙泉，看大漠日落。'],
        featured: true, status: 'published', createdAt: '2026-09-11'
      },
      {
        id: 'emeishan', name: '峨眉山', category: '宗教圣地', province: '四川', rating: 4.4, visits: 108000,
        tags: ['普贤道场', '金顶日出', '云海'], summary: '普贤菩萨道场，金顶云海与佛光让无数人魂牵梦萦。',
        intro: [
          '峨眉山是佛教四大名山之一，报国寺、万年寺、金顶等名刹依山而建，香火绵延千年。',
          '金顶十方普贤金像在阳光下庄严夺目，运气好时可见云海翻涌、佛光乍现、圣灯明灭。',
          '山中灵猴顽皮又机警，竹林、溪涧与古树相映，登山之路本身就是一场修行。'
        ],
        hours: '06:00–18:00',
        ticket: '旺季 160 元/人，淡季 110 元/人',
        transport: '乘高铁至峨眉山站，换乘景区观光车上山。',
        address: '四川省乐山市峨眉山市',
        tips: ['看日出需在金顶或雷洞坪住一晚。', '观光车加索道可直达金顶，省去登山时间。', '山间猴子会抢食，不要当面拿塑料袋。', '山上温度低，带件保暖外套。'],
        featured: false, status: 'published', createdAt: '2026-09-11'
      },
      {
        id: 'dongfangmingzhu', name: '上海东方明珠', category: '现代地标', province: '上海', rating: 4.1, visits: 142000,
        tags: ['陆家嘴', '悬空观景', '夜景'], summary: '陆家嘴的明珠，登上悬空观光廊俯瞰魔都天际线。',
        intro: [
          '东方明珠塔高约 468 米，大小球体串联，是上海最经典的地标之一。',
          '259 米的悬空观光廊由全透明玻璃铺设，脚下车水马龙，适合胆大的游客打卡。',
          '夜晚塔身流光溢彩，与金茂、上海中心、环球金融中心一同点亮陆家嘴的璀璨夜空。'
        ],
        hours: '08:30–21:30',
        ticket: '观光层约 199 元/人起',
        transport: '地铁 2 号线陆家嘴站步行即达。',
        address: '上海市浦东新区世纪大道 1 号',
        tips: ['傍晚登塔可同时看到白天的江景和夜晚的灯海。', '悬空玻璃廊在 259 米，恐高者慎入。', '与外滩隔江相望，可乘轮渡往返。', '提前网上购票，旺季免排队。'],
        featured: false, status: 'published', createdAt: '2026-09-12'
      },
      {
        id: 'guangzhouta', name: '广州塔', category: '现代地标', province: '广东', rating: 4.6, visits: 131000,
        tags: ['小蛮腰', '珠江夜游', '摩天轮'], summary: '“小蛮腰”婀娜多姿，珠江夜景在此尽收眼底。',
        intro: [
          '广州塔高 600 米，因中部收窄被亲切地称为“小蛮腰”，是广州的城市名片。',
          '450 米以上的塔顶观景平台视野极佳，极速云霄、摩天轮与蜘蛛栈道等项目刺激好玩。',
          '夜晚塔身灯光变幻，与花城广场、珠江游船交相辉映，是广州夜景的绝对主角。'
        ],
        hours: '09:30–22:30',
        ticket: '观景票约 150–298 元/人',
        transport: '地铁 3 号线/APM 线广州塔站。',
        address: '广东省广州市海珠区',
        tips: ['日落前登塔，一次看遍白昼与夜景。', '摩天轮在塔顶，需另购票。', '塔下有码头，可乘珠江夜游游船。', '天气通透时能远眺白云山与珠江口。'],
        featured: false, status: 'published', createdAt: '2026-09-12'
      },
      {
        id: 'qinghaihu', name: '青海湖', category: '自然风光', province: '青海', rating: 4.4, visits: 97000,
        tags: ['高原湖泊', '油菜花', '骑行'], summary: '中国最大内陆湖，盛夏的油菜花海与湛蓝湖水美得辽阔。',
        intro: [
          '青海湖是中国最大的内陆咸水湖，湖水湛蓝如海，四周雪山与草原环抱，辽阔得望不到边。',
          '每年 7 月，环湖油菜花竞相绽放，金黄的花田与碧蓝湖水相接，色彩对比强烈而纯粹。',
          '黑马河是看日出的胜地，湖面上成群的候鸟与湟鱼让这片高原圣湖充满生机。'
        ],
        hours: '全天开放',
        ticket: '二郎剑景区约 90 元/人（环湖部分免费）',
        transport: '乘火车至西宁，再乘班车或包车环湖。',
        address: '青海省海南州共和县',
        tips: ['7–8 月油菜花最美，也是环湖骑行的旺季。', '海拔约 3200 米，注意防晒和保暖。', '环湖约 360 公里，自驾或骑行都很棒。', '黑马河日出极美，记得早起。'],
        featured: false, status: 'published', createdAt: '2026-09-13'
      },
      {
        id: 'taishan', name: '泰山', category: '自然风光', province: '山东', rating: 4.5, visits: 115000,
        tags: ['五岳之首', '十八盘', '日出'], summary: '五岳之首，登顶体会“会当凌绝顶，一览众山小”。',
        intro: [
          '泰山被尊为“五岳之首”，自秦始皇起历代帝王在此封禅，文化底蕴厚重如山。',
          '从红门到南天门有 6000 余级石阶，十八盘陡峭险峻，步步登高之间，石刻、古树与庙宇相伴。',
          '玉皇顶是泰山之巅，日出云海、黄河金带、晚霞夕照都是令人难忘的奇景。'
        ],
        hours: '全天开放',
        ticket: '旺季 115 元/人，淡季 100 元/人',
        transport: '乘高铁至泰安站，乘公交或打车至天外村/红门。',
        address: '山东省泰安市',
        tips: ['看日出需夜爬或住山顶，务必带保暖衣物。', '可从天外村乘大巴到中天门，再乘索道上南天门。', '十八盘较陡，体力一般者建议乘索道。', '登山杖和头灯夜爬很实用。'],
        featured: false, status: 'published', createdAt: '2026-09-13'
      }
    ],
    news: [
      {
        id: 'n1', title: '国庆假期热门景区门票预约攻略', category: '资讯', date: '2026-09-28',
        summary: '国庆黄金周临近，故宫、九寨沟、布达拉宫等热门景点门票需提前预约，这份攻略请收好。',
        content: [
          '国庆黄金周临近，各地热门景区迎来客流高峰。故宫、陕西历史博物馆、九寨沟等实行“限量、预约、错峰”的景区，门票往往提前多日售罄。',
          '建议游客在出发前通过景区官方平台或公众号完成实名预约，并提前规划好游览路线与住宿，尽量避开假日前两天的客流峰值。'
        ], status: 'published', cover: 'gugong'
      },
      {
        id: 'n2', title: '多地景区实行“限量、预约、错峰”入园', category: '资讯', date: '2026-09-15',
        summary: '为提升游览体验，越来越多景区实行预约制，出行前务必先查清入园政策。',
        content: [
          '近年来，越来越多高人气景区推行“限量、预约、错峰”入园机制，游客需凭身份证实名预约并按预约时段入园。',
          '这一举措有效缓解了排队拥挤，也让游览体验更舒适。出行前请务必在官方渠道确认预约规则，避免白跑一趟。'
        ], status: 'published', cover: 'changcheng'
      },
      {
        id: 'n3', title: '秋季赏红叶目的地推荐：黄山、九寨沟、喀纳斯', category: '攻略', date: '2026-09-20',
        summary: '秋风渐起，层林尽染，这几个地方的秋色堪称“天花板”。',
        content: [
          '秋天的黄山云海与红枫相映，九寨沟的彩林倒映在碧蓝海子里，喀纳斯的白桦林金黄一片，都是赏秋的绝佳去处。',
          '建议选择国庆后至十月底出行，人少景美；山区昼夜温差大，记得带上保暖外套与相机。'
        ], status: 'published', cover: 'kanasi'
      },
      {
        id: 'n4', title: '家庭出游怎样带娃不累：主题乐园与海岛路线', category: '攻略', date: '2026-08-30',
        summary: '带小朋友出行，选对目的地和节奏，旅途才能轻松又尽兴。',
        content: [
          '亲子出行建议选择设施完善的度假型目的地，例如上海迪士尼、广州长隆，或三亚亚龙湾这类“泡酒店+玩沙滩”的海岛。',
          '行程不要排得太满，每天安排一个主项目即可，预留午休时间，并提前下载景区 App 关注排队与演出时间。'
        ], status: 'published', cover: 'disney'
      },
      {
        id: 'n5', title: '关于本站升级维护的通知', category: '公告', date: '2026-09-01',
        summary: '本站将于近期进行功能升级，新增更多景点与互动功能，敬请期待。',
        content: [
          '为给大家带来更好的浏览体验，本站计划对景点数据库与评论系统进行升级，期间可能出现短暂访问波动。',
          '升级完成后将新增更多目的地与互动功能，感谢您的理解与支持。'
        ], status: 'published', cover: 'xihu'
      },
      {
        id: 'n6', title: '铁路国庆黄金周加开旅游专列', category: '资讯', date: '2026-09-25',
        summary: '国庆期间铁路部门加开多趟旅游专列，覆盖黄山、张家界等热门方向。',
        content: [
          '为满足国庆假期出行需求，铁路部门将加开多趟旅游专列与高峰线列车，重点覆盖黄山、张家界、桂林等热门旅游方向。',
          '旅客可通过 12306 官方渠道购票，建议尽早规划行程、错峰出行。'
        ], status: 'published', cover: 'zhangjiajie'
      }
    ],
    comments: [
      { id: 'c1', attractionId: 'gugong', username: '旅行达人阿杰', rating: 5, content: '第一次进故宫真的被震撼到了，中轴线的气势扑面而来，珍宝馆一定要去！', date: '2026-09-20', status: 'published' },
      { id: 'c2', attractionId: 'gugong', username: '山水间', rating: 5, content: '周一闭馆，去之前记得看日期，不然会白跑一趟。', date: '2026-09-21', status: 'published' },
      { id: 'c3', attractionId: 'huangshan', username: '小游', rating: 5, content: '凌晨四点半起来爬光明顶，看到云海日出的那一刻一切都值了！', date: '2026-09-18', status: 'published' },
      { id: 'c4', attractionId: 'huangshan', username: '旅行达人阿杰', rating: 4, content: '西海大峡谷很险，腿软的朋友慎重，不过风景确实一绝。', date: '2026-09-19', status: 'published' },
      { id: 'c5', attractionId: 'jiuzhaigou', username: '山水间', rating: 5, content: '五花海的水蓝得不像真的，秋天去最美，就是人有点多。', date: '2026-09-22', status: 'published' },
      { id: 'c6', attractionId: 'xihu', username: '小游', rating: 5, content: '免费的西湖太香了，骑共享单车环湖一圈，傍晚的雷峰夕照绝美。', date: '2026-09-23', status: 'published' },
      { id: 'c7', attractionId: 'disney', username: '旅行达人阿杰', rating: 5, content: '带娃玩了创极速光轮，烟花秀很梦幻，提前下 App 排队少走弯路。', date: '2026-09-24', status: 'published' }
    ]
  };

  var memory = null;
  var full = false;

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function read() {
    if (memory) return clone(memory);
    try {
      var raw = global.localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* 忽略，回退到种子数据 */ }
    return clone(SEED);
  }

  function write(db) {
    var s = JSON.stringify(db);
    if (s.length > 2400000) { full = true; return false; }
    memory = clone(db);
    try { global.localStorage.setItem(DB_KEY, s); full = false; return true; }
    catch (e) { full = true; return false; }
  }

  function ensure() {
    try {
      if (!global.localStorage.getItem(DB_KEY)) write(clone(SEED));
    } catch (e) { memory = clone(SEED); }
  }

  ensure();

  var Store = {
    categories: CATEGORIES,
    isFull: function () { return full; },
    read: read,
    write: write,
    reset: function () { write(clone(SEED)); },
    all: function (name) { return read()[name] || []; },
    get: function (name, id) {
      var list = read()[name] || [];
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return clone(list[i]);
      return null;
    },
    find: function (name, pred) {
      var list = read()[name] || [];
      for (var i = 0; i < list.length; i++) if (pred(list[i])) return clone(list[i]);
      return null;
    },
    save: function (name, item) {
      var db = read();
      var list = db[name] || [];
      var idx = -1;
      for (var i = 0; i < list.length; i++) if (list[i].id === item.id) { idx = i; break; }
      if (idx >= 0) list[idx] = item; else list.push(item);
      db[name] = list;
      write(db);
      return clone(item);
    },
    remove: function (name, id) {
      var db = read();
      db[name] = (db[name] || []).filter(function (x) { return x.id !== id; });
      write(db);
    },
    uid: function (prefix) {
      return (prefix || 'id') + '_' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
    },
    settings: function () { return read().settings; },

    // 认证：返回用户对象或 null
    login: function (username, password, role) {
      var u = this.find('users', function (x) { return x.username === username && x.password === password; });
      if (!u) return { error: '用户名或密码错误' };
      if (u.status !== 'active') return { error: '该账号已被禁用，请联系管理员' };
      if (role && u.role !== role) return { error: '该账号无权限登录此入口' };
      try { global.localStorage.setItem(SESSION_KEY, JSON.stringify({ id: u.id, role: u.role })); } catch (e) { }
      return { user: u };
    },
    session: function () {
      try {
        var raw = global.localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        var s = JSON.parse(raw);
        var u = this.get('users', s.id);
        return u || null;
      } catch (e) { return null; }
    },
    logout: function () {
      try { global.localStorage.removeItem(SESSION_KEY); } catch (e) { }
    }
  };

  global.Store = Store;
})(window);
