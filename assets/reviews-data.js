/*!
 * MeTenk reviews data
 * ---------------------------------------------------------------------------
 * Real, public store reviews used by the landing-page review marquee.
 * Chrome and Firefox reviews are mixed together on purpose: visitors see
 * one wall of feedback, not a platform-by-platform breakdown.
 *
 * Long reviews are trimmed with an ellipsis so every card stays readable;
 * wording is otherwise left untouched. `translation` holds the localized
 * version shown when the visitor's site language differs from `lang`.
 *
 * HOW TO ADD A REVIEW
 *   id           unique string (store + review id)
 *   author       public nickname shown on the store
 *   store        "firefox" | "chrome" | "edge" (provenance only, not displayed)
 *   rating       1-5
 *   lang         language the review was originally written in
 *   date         ISO date (YYYY-MM-DD), provenance only
 *   body         original text (excerpts end with "…")
 *   translation  optional localized versions keyed by site language
 *   avatar       optional local image path, e.g. "assets/reviews/avatars/id.jpg"
 *                (store images are copied into the repo — never hotlinked)
 *                when omitted or failing to load, the monogram is used
 *
 * SUMMARY
 *   rating  weighted average across the live store ratings
 */
window.METENK_REVIEWS = {
  updatedAt: '2026-11-24',

  summary: {
    rating: 4.9
  },

  reviews: [
    {
      id: 'chrome-54',
      author: 'Snehal B',
      store: 'chrome',
      rating: 5,
      lang: 'en',
      date: '2026-11-15',
      avatar: 'assets/reviews/avatars/snehal-b.jpg',
      body: 'Absolutely great!! I suffer from ADHD so the pomodoro timer gives me control. I also liked the activity chart to see my progress visually, and the to-do list integration.',
      translation: {
        zh: '非常棒！！我有 ADHD，番茄钟让我重新掌控节奏。我也很喜欢用活动图表直观看到自己的进度，以及把任务和计时整合在一起的待办清单。',
        'zh-TW': '非常棒！！我有 ADHD，番茄鐘讓我重新掌控節奏。我也很喜歡用活動圖表直觀看到自己的進度，以及把任務和計時整合在一起的待辦清單。',
        es: '¡Absolutamente genial! Tengo TDAH y el temporizador pomodoro me da el control. También me gustó el gráfico de actividad para ver mi progreso de forma visual, y la integración de la lista de tareas.',
        'pt-BR': 'Absolutamente ótimo!! Tenho TDAH e o timer pomodoro me dá controle. Também gostei do gráfico de atividades para ver meu progresso visualmente, e da lista de tarefas integrada.',
        ja: '本当に最高です！！私は ADHD があり、ポモドーロタイマーがペースを保つのに役立っています。活動グラフで進捗を視覚的に確認できる点と、ToDo リストとの連携も気に入りました。'
      }
    },
    {
      id: 'firefox-2745852',
      author: '白饮之',
      store: 'firefox',
      rating: 5,
      lang: 'zh',
      date: '2026-09-11',
      body: '绝对的顶级毫无疑问！我几乎遍览扩展社区，并没有找到像这样带有白噪音和日程表的时钟，运行流畅且界面简洁可定义……感谢创作者带来如此舒适的体验！',
      translation: {
        en: 'Absolutely top-tier, no doubt about it. I have looked through almost every extension community and never found a clock with white noise and a schedule board like this… Thank you for such a comfortable experience!',
        'zh-TW': '絕對的頂級毫無疑問！我幾乎遍覽擴充功能社群，並沒有找到像這樣帶有白噪音和排程表的時鐘，執行流暢且介面簡潔可自訂……感謝創作者帶來如此舒適的體驗！',
        es: 'Sin duda de primer nivel. He revisado casi todas las comunidades de extensiones y nunca había encontrado un reloj con ruido blanco y agenda como este… Gracias por una experiencia tan cómoda.',
        'pt-BR': 'Sem dúvida, de primeira linha. Já procurei em quase todas as comunidades de extensões e nunca encontrei um relógio com ruído branco e quadro de horários como este… Obrigado pela experiência tão agradável.',
        ja: '間違いなく最高レベルです。ほぼすべての拡張機能コミュニティを見てきましたが、ホワイトノイズとスケジュールボードを備えた時計は他にありませんでした…とても快適な体験をありがとうございます。'
      }
    },
    {
      id: 'chrome-37',
      author: '甜莎',
      store: 'chrome',
      rating: 5,
      lang: 'zh',
      date: '2026-11-06',
      body: '很棒，这个非常喜欢。如果有云备份更好了',
      translation: {
        en: 'Really great — I like it a lot. Cloud backup would make it even better.',
        'zh-TW': '很棒，這個非常喜歡。如果有雲端備份更好了',
        es: 'Muy bueno, me gusta mucho. Si tuviera copia de seguridad en la nube, sería aún mejor.',
        'pt-BR': 'Muito bom, gostei bastante. Se tivesse backup na nuvem, seria ainda melhor.',
        ja: 'とても良いです、かなり気に入っています。クラウドバックアップがあればもっと良いと思います。'
      }
    },
    {
      id: 'firefox-2724219',
      author: '445kim',
      store: 'firefox',
      rating: 5,
      lang: 'en',
      date: '2026-06-28',
      body: 'I tested around 15 pomodoro and task-list extensions and this one is far superior to all of them. Every time I thought of a feature — reorder, sounds, categories — that option was already there. Amazing!',
      translation: {
        zh: '我测试过大约 15 款番茄钟和任务清单扩展，这一款远超其他所有产品。每次我想要拖拽排序、调节声音或按分类区分任务，这些选项都已经有了。令人惊艳！',
        'zh-TW': '我測試過大約 15 款番茄鐘和任務清單擴充功能，這一款遠超其他所有產品。每次我想要拖曳排序、調節聲音或按分類區分任務，這些選項都已經有了。令人驚豔！',
        es: 'Probé unas 15 extensiones de pomodoro y listas de tareas y esta es muy superior a todas. Cada vez que pensaba en una función (reordenar, sonidos, categorías), esa opción ya estaba ahí. ¡Increíble!',
        'pt-BR': 'Testei cerca de 15 extensões de pomodoro e lista de tarefas e esta é muito superior a todas. Toda vez que eu pensava em um recurso — reordenar, sons, categorias — a opção já estava lá. Incrível!',
        ja: 'ポモドーロとタスクリストの拡張機能を 15 個ほど試しましたが、これはそのどれよりも優れています。並べ替え、サウンド、カテゴリなど、欲しいと思った機能がすでに揃っていました。素晴らしい！'
      }
    },
    {
      id: 'chrome-43',
      author: 'Rosie',
      store: 'chrome',
      rating: 5,
      lang: 'zh',
      date: '2026-01-07',
      body: '这款浏览器定时插件的测试体验非常出色！它设计了“专注”与“休息”两大模式，分别用不同颜色清晰区分。启动后，伴随着由远及近的自然鸟鸣声，能让人很快从浮躁中沉静下来。……值得五星好评！！',
      translation: {
        en: 'This browser timer extension is outstanding. Focus and break modes are clearly separated by colour, and the natural birdsong that fades in helps you settle down almost immediately… Easily five stars!!',
        'zh-TW': '這款瀏覽器定時外掛的測試體驗非常出色！它設計了「專注」與「休息」兩大模式，分別用不同顏色清楚區分。啟動後，伴隨著由遠及近的自然鳥鳴聲，能讓人很快從浮躁中沉靜下來。……值得五星好評！！',
        es: 'La experiencia con esta extensión de temporizador es excelente. Los modos Enfoque y Descanso se distinguen claramente por color, y el canto de pájaros que aparece poco a poco ayuda a calmarse casi de inmediato… ¡Sin duda cinco estrellas!',
        'pt-BR': 'A experiência com esta extensão de timer é excelente. Os modos Foco e Pausa são claramente separados por cor, e o canto de pássaros que surge aos poucos ajuda a relaxar quase na hora… Com certeza cinco estrelas!!',
        ja: 'このブラウザタイマー拡張機能の体験は素晴らしいです。「集中」と「休憩」のモードが色で明確に分かれ、徐々に聞こえてくる自然の鳥の声がすぐに気持ちを落ち着かせてくれます……文句なしの星 5 つです！！'
      }
    },
    {
      id: 'edge-2',
      author: '高',
      store: 'edge',
      rating: 5,
      lang: 'zh',
      date: '2026-01-16',
      body: '终于找了一个关于时间和任务管理让我满意的插件，功能很强大，很实用没有乱七八糟的东西',
      translation: {
        en: 'Finally found a time and task management extension I am happy with — powerful, practical, and free of clutter.',
        'zh-TW': '終於找到一個關於時間和任務管理讓我滿意的外掛，功能很強大，很實用沒有亂七八糟的東西',
        es: 'Por fin encontré una extensión de gestión de tiempo y tareas que me convence: potente, práctica y sin cosas innecesarias.',
        'pt-BR': 'Finalmente encontrei uma extensão de gestão de tempo e tarefas que me agrada — poderosa, prática e sem bagunça.',
        ja: '時間とタスク管理の拡張機能でようやく満足できるものを見つけました。高機能で実用的、余計なものが一切ありません。'
      }
    },
    {
      id: 'chrome-41',
      author: 'RED LINX',
      store: 'chrome',
      rating: 5,
      lang: 'ru',
      date: '2026-02-25',
      avatar: 'assets/reviews/avatars/red-linx.jpg',
      body: 'Хорошая идея объединить с таскером. Удобно что все в одном месте',
      translation: {
        en: 'A great idea to combine it with a task manager. It is convenient to have everything in one place.',
        zh: '把番茄钟和任务管理器结合起来是个很棒的想法，所有东西都在一个地方，很方便。',
        'zh-TW': '把番茄鐘和任務管理器結合起來是個很棒的想法，所有東西都在一個地方，很方便。',
        es: 'Buena idea combinarlo con un gestor de tareas. Es cómodo tenerlo todo en un solo lugar.',
        'pt-BR': 'Ótima ideia combinar com um gerenciador de tarefas. É prático ter tudo em um só lugar.',
        ja: 'タスク管理と組み合わせるのは良いアイデアです。すべてが 1 か所にあると便利です。'
      }
    },
    {
      id: 'chrome-47',
      author: 'TuxRio',
      store: 'chrome',
      rating: 5,
      lang: 'en',
      date: '2025-11-30',
      avatar: 'assets/reviews/avatars/tuxrio.jpg',
      body: 'Absolutely essential. One of the first things I always install! 👍🏻',
      translation: {
        zh: '绝对必备，是我每次都会最先安装的扩展之一！👍🏻',
        'zh-TW': '絕對必備，是我每次都會最先安裝的擴充功能之一！👍🏻',
        es: 'Absolutamente imprescindible. ¡Una de las primeras cosas que siempre instalo! 👍🏻',
        'pt-BR': 'Absolutamente essencial. Uma das primeiras coisas que sempre instalo! 👍🏻',
        ja: '絶対に必要なツールです。いつも最初に入れるものの一つ！👍🏻'
      }
    },
    {
      id: 'chrome-39',
      author: 'Андрей Б',
      store: 'chrome',
      rating: 5,
      lang: 'en',
      date: '2026-05-25',
      body: 'Great extension!!',
      translation: {
        zh: '很棒的扩展！！',
        'zh-TW': '很棒的擴充功能！！',
        es: '¡¡Una extensión genial!!',
        'pt-BR': 'Extensão ótima!!',
        ja: '素晴らしい拡張機能です！！'
      }
    },
    {
      id: 'firefox-2721976',
      author: 'Arman Async',
      store: 'firefox',
      rating: 5,
      lang: 'en',
      date: '2026-06-20',
      body: 'This is a PERFECT tool',
      translation: {
        zh: '这是一款完美的工具。',
        'zh-TW': '這是一款完美的工具。',
        es: 'Es una herramienta PERFECTA',
        'pt-BR': 'É uma ferramenta PERFEITA',
        ja: 'これは完璧なツールです'
      }
    },
    {
      id: 'chrome-45',
      author: 'mac',
      store: 'chrome',
      rating: 5,
      lang: 'hr',
      date: '2025-11-30',
      avatar: 'assets/reviews/avatars/mac.jpg',
      body: 'Jako dobro proširenje',
      translation: {
        en: 'A very good extension.',
        zh: '非常好的扩展。',
        'zh-TW': '非常好的擴充功能。',
        es: 'Una extensión muy buena.',
        'pt-BR': 'Uma extensão muito boa.',
        ja: 'とても良い拡張機能です。'
      }
    }
  ]
};
