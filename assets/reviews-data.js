/*!
 * MeTenk reviews data
 * ---------------------------------------------------------------------------
 * Real, public store reviews used by the landing-page review marquee.
 * Chrome and Firefox reviews are mixed together on purpose: visitors see
 * one wall of feedback, not a platform-by-platform breakdown.
 *
 * Full review text is preserved verbatim; only whitespace is normalised.
 * `translation` holds the localized version shown when the visitor's site
 * language differs from `lang`. Chinese and English are maintained first;
 * other locales fall back to English until their text is translated.
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
 *                when omitted or failing to load, a subtle silhouette is used
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
      body: "Absolutely great!! I suffer from ADHD so pomodoro timer gives me control, I also liked activity chart to see my progress visually and to do list integration where I can clearly see what and how much tasks took how much time. I also liked I can choose different background sound. It would be really helpful if you fix custom link sound. I m adding my YouTube link in it but it's not working. I listen to specific ADHD frequency music so if I can directly start my task without me having to open YouTube would not distract me. Thank you so much for this extension ❤",
      translation: {
        zh: '非常棒！！我有 ADHD，番茄钟让我重新掌控节奏。我也喜欢用活动图表直观看到自己的进度，以及待办清单的整合——我能清楚看到有哪些任务、每个任务花了多少时间。我还喜欢可以选择不同的背景音。如果你能修复自定义链接音效就太好了：我在里面添加了自己的 YouTube 链接，但它不起作用。我会听特定的 ADHD 频率音乐，如果能不打开 YouTube 就直接开始任务，就不会分心。非常感谢这个扩展 ❤',
        'zh-TW': '非常棒！！我有 ADHD，番茄鐘讓我重新掌控節奏。我也喜歡用活動圖表直觀看到自己的進度，以及待辦清單的整合——我能清楚看到有哪些任務、每個任務花了多少時間。我還喜歡可以選擇不同的背景音。如果你能修復自訂連結音效就太好了：我在裡面添加了自己的 YouTube 連結，但它不起作用。我會聽特定的 ADHD 頻率音樂，如果能不打開 YouTube 就直接開始任務，就不會分心。非常感謝這個擴充功能 ❤'
      }
    },
    {
      id: 'firefox-2745852',
      author: '白饮之',
      store: 'firefox',
      rating: 5,
      lang: 'zh',
      date: '2026-09-11',
      body: '绝对的顶级毫无疑问, 我几乎遍览扩展社区, 并没有找到像这样的带有白噪音和日程表的时钟, 并且运行流畅且界面简洁可定义, 对我来说最戳中我的一点是它可以正计时, 老天, 这是许多扩展都没设计的部分, 待办界面还可以使用侧边栏和单独一个可以随意调整新标签页, 可以直接从待办清单中点击计时, 感谢创作者带来如此舒适的体验!!!!!',
      translation: {
        en: 'Absolutely top-tier, no doubt about it. I have looked through almost every extension community and never found a clock with white noise and a schedule board like this — smooth, with a clean, customisable interface. What won me over most is that it supports count-up timing — goodness, so many extensions skip that. The to-do view works in the sidebar and in its own tab that you can freely adjust, and you can start a timer straight from the list. Thank you for such a comfortable experience!!!!!',
        'zh-TW': '絕對的頂級毫無疑問, 我幾乎遍覽擴充功能社群, 並沒有找到像這樣的帶有白噪音和排程表的時鐘, 並且執行流暢且介面簡潔可自訂, 對我來說最戳中我的一點是它可以正計時, 老天, 這是許多擴充功能都沒設計的部分, 待辦介面還可以使用側邊欄和單獨一個可以隨意調整新分頁, 可以直接從待辦清單中點擊計時, 感謝創作者帶來如此舒適的體驗!!!!!'
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
      body: "I RARELY write reviews but I see there is only 1 other, a handful of users (less than 15 as of Jun 2026) and need to give this developer some credit. I tested like 15 pomodoro/task list extensions and this one is far superior to all of them (for my use case). Every time I thought, oh, I want to do this, can I resequence the list by dragging/dropping, can I adjust the sounds, can I differentiate by categories, that option was available. It was/is amazing! This has a pomodoro clock, has an integrated to do list and you can integrate into your sidebar which is truly a game changer in terms of productivity (for me). I LOVE being able to put in the URL of sites and then check that box off when I'm complete with the task. I also love putting in URLs of sites I shouldn't visit so much and when I'm done, I check off the box and I'm not going back. This extension really helps to reinforce all the good habits I want to have and visibility of the task list on the sidebar with the pomodoro timer up top (with metronome sounds if you want it) has been so helpful. Regardless of whether this helps my productivity, hats off to this developer for creating such a user friendly site that offers such a robust menu of options.",
      translation: {
        zh: '我很少写评价，但我看到这里只有另外一条评价、用户也不多（截至 2026 年 6 月还不到 15 人），觉得必须给这位开发者一些认可。我测试了大约 15 款番茄钟/任务清单扩展，这一款（就我的使用场景而言）远超它们全部。每次我想到“哦，我想这样做”，比如能不能拖拽调整列表顺序、能不能调节声音、能不能按分类区分任务，这些选项都已经有了。过去和现在都令人惊叹！它有一个番茄钟、内置待办清单，还能整合进侧边栏，这对我的效率来说是真正的改变。我特别喜欢可以填入网址，完成任务后勾掉那个框。我也喜欢填入那些我不该常去的网站，完成后勾掉，就不再回去了。这个扩展确实帮助我强化了想要养成的好习惯，侧边栏里任务清单的可见性加上顶部的番茄钟（如果你愿意还有节拍器声音）非常有用。无论它是否提升了我的效率，都要向这位开发者致敬——做出了如此易用、选项又如此丰富的产品。',
        'zh-TW': '我很少寫評價，但我看到這裡只有另外一條評價、用戶也不多（截至 2026 年 6 月還不到 15 人），覺得必須給這位開發者一些認可。我測試了大約 15 款番茄鐘/任務清單擴充功能，這一款（就我的使用場景而言）遠超它們全部。每次我想到「哦，我想這樣做」，比如能不能拖曳調整列表順序、能不能調節聲音、能不能按分類區分任務，這些選項都已經有了。過去和現在都令人驚嘆！它有一個番茄鐘、內建待辦清單，還能整合進側邊欄，這對我的效率來說是真正的改變。我特別喜歡可以填入網址，完成任務後勾掉那個框。我也喜歡填入那些我不該常去的網站，完成後勾掉，就不再回去了。這個擴充功能確實幫助我強化了想要養成的好習慣，側邊欄裡任務清單的可見性加上頂部的番茄鐘（如果你願意還有節拍器聲音）非常有用。無論它是否提升了我的效率，都要向這位開發者致敬——做出了如此易用、選項又如此豐富的產品。'
      }
    },
    {
      id: 'chrome-43',
      author: 'Rosie',
      store: 'chrome',
      rating: 5,
      lang: 'zh',
      date: '2026-01-07',
      body: '这款浏览器定时插件的测试体验非常出色！它设计了“专注”与“休息”两大模式，分别用不同颜色清晰区分，并支持自由选择时长。启动后，伴随着由远及近的自然鸟鸣声，空灵悠扬，能让人很快从浮躁中沉静下来。界面简洁直观，操作轻松上手。每次打开还会显示一句名言警句，给予及时的正向激励。音乐设计也暗藏巧思，给人带来小惊喜，让专注过程不再枯燥。整体来说，是一款兼具美观与实用性的时间管理小助手，值得五星好评！！',
      translation: {
        en: 'This browser timer extension is outstanding. It has two modes, Focus and Break, clearly distinguished by colour, and you can choose any duration. When you start, natural birdsong fades in from afar — ethereal and melodic — and you quickly settle down from the noise. The interface is clean and intuitive, easy to pick up. Every time you open it, a quote appears to give you a timely nudge of encouragement. The sound design has clever little touches that bring pleasant surprises and keep focus from feeling dull. Overall, it is a beautiful, practical little time-management assistant — easily worth five stars!!',
        'zh-TW': '這款瀏覽器定時外掛的測試體驗非常出色！它設計了「專注」與「休息」兩大模式，分別用不同顏色清楚區分，並支援自由選擇時長。啟動後，伴隨著由遠及近的自然鳥鳴聲，空靈悠揚，能讓人很快從浮躁中沉靜下來。介面簡潔直觀，操作輕鬆上手。每次打開還會顯示一句名言警句，給予及時的正向激勵。音樂設計也暗藏巧思，給人帶來小驚喜，讓專注過程不再枯燥。整體來說，是一款兼具美觀與實用性的時間管理小幫手，值得五星好評！！'
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
