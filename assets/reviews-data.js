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
 *   translation  optional { en: "...", zh: "..." } localized versions
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
      body: 'Absolutely great!! I suffer from ADHD so the pomodoro timer gives me control. I also liked the activity chart to see my progress visually, and the to-do list integration.',
      translation: {
        zh: '非常棒！！我有 ADHD，番茄钟让我重新掌控节奏。我也很喜欢用活动图表直观看到自己的进度，以及把任务和计时整合在一起的待办清单。'
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
        en: 'Absolutely top-tier, no doubt about it. I have looked through almost every extension community and never found a clock with white noise and a schedule board like this… Thank you for such a comfortable experience!'
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
        en: 'Really great — I like it a lot. Cloud backup would make it even better.'
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
        zh: '我测试过大约 15 款番茄钟和任务清单扩展，这一款远超其他所有产品。每次我想要拖拽排序、调节声音或按分类区分任务，这些选项都已经有了。令人惊艳！'
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
        en: 'This browser timer extension is outstanding. Focus and break modes are clearly separated by colour, and the natural birdsong that fades in helps you settle down almost immediately… Easily five stars!!'
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
        en: 'Finally found a time and task management extension I am happy with — powerful, practical, and free of clutter.'
      }
    },
    {
      id: 'chrome-41',
      author: 'RED LINX',
      store: 'chrome',
      rating: 5,
      lang: 'ru',
      date: '2026-02-25',
      body: 'Хорошая идея объединить с таскером. Удобно что все в одном месте',
      translation: {
        en: 'A great idea to combine it with a task manager. It is convenient to have everything in one place.',
        zh: '把番茄钟和任务管理器结合起来是个很棒的想法，所有东西都在一个地方，很方便。'
      }
    },
    {
      id: 'chrome-47',
      author: 'TuxRio',
      store: 'chrome',
      rating: 5,
      lang: 'en',
      date: '2025-11-30',
      body: 'Absolutely essential. One of the first things I always install! 👍🏻',
      translation: {
        zh: '绝对必备，是我每次都会最先安装的扩展之一！👍🏻'
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
        zh: '很棒的扩展！！'
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
        zh: '这是一款完美的工具。'
      }
    },
    {
      id: 'chrome-45',
      author: 'mac',
      store: 'chrome',
      rating: 5,
      lang: 'hr',
      date: '2025-11-30',
      body: 'Jako dobro proširenje',
      translation: {
        en: 'A very good extension.',
        zh: '非常好的扩展。'
      }
    }
  ]
};
