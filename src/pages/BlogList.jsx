import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TELEGRAPH_TOKEN = import.meta.env.VITE_TELEGRAPH_TOKEN;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const BlogList = () => {
  const [blogsByYearMonth, setBlogsByYearMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ==========================================
  // SCROLL PROGRESS
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.body.scrollHeight - window.innerHeight;

      const progress =
        totalHeight > 0
          ? (window.scrollY / totalHeight) * 100
          : 0;

      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading]);

  // ==========================================
  // TELEGRAPH POSTLARNI OLISH
  // ==========================================

  useEffect(() => {
    document.title = 'Blog - Asilbek Abdunabiyev';

    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://api.telegra.ph/getPageList?access_token=${TELEGRAPH_TOKEN}&limit=100`
        );

        if (!response.data.ok) {
          throw new Error('Telegraph API error');
        }

        const pages = response.data.result.pages || [];

        /*
         * TELEGRAPH:
         * Yangi yaratilgan postlar birinchi keladi.
         *
         * SHUNING UCHUN pages tartibini o'zgartirmaymiz.
         */
        const grouped = {};

        pages.forEach((page) => {
          const title = (page.title || '').toLowerCase();

          // --------------------------------------
          // O'CHIRILGAN POSTLARNI OLIB TASHLASH
          // --------------------------------------

          if (
            title.includes('deleted') ||
            title === "o'chirilgan" ||
            title === 'ochirilgan'
          ) {
            return;
          }

          // --------------------------------------
          // PATHDAN OY VA KUNNI OLISH
          // --------------------------------------
          //
          // Masalan:
          //
          // Havas-qiladigan-inson-09-03
          //
          // 09 = September
          // 03 = kun
          //
          // Telegraph aynan Title-MM-DD formatidan
          // foydalanadi.
          //
          // MUHIM: agar bir xil kunda bir xil path
          // (title) allaqachon mavjud bo'lsa, Telegraph
          // oxiriga qo'shimcha "-2", "-3" kabi raqam
          // qo'shib qo'yadi. Masalan:
          //
          // Mavzu-09-14-2
          //
          // Shuning uchun oy/kunni pathning oxiridan
          // emas, regex bilan aniq topamiz.
          // --------------------------------------

          let monthNumber = null;
          let dayNumber = null;

          const dateMatch = page.path.match(
            /-(\d{1,2})-(\d{1,2})(?:-\d+)?$/
          );

          if (dateMatch) {
            const possibleMonth = parseInt(dateMatch[1], 10);
            const possibleDay = parseInt(dateMatch[2], 10);

            if (
              possibleMonth >= 1 &&
              possibleMonth <= 12 &&
              possibleDay >= 1 &&
              possibleDay <= 31
            ) {
              monthNumber = possibleMonth;
              dayNumber = possibleDay;
            }
          }

          /*
           * Agar pathdan sana topilmasa,
           * postni o'tkazib yuboramiz.
           *
           * MUHIM:
           * new Date() ishlatmaymiz.
           * Aks holda hammasi bugungi sana bo'lib qoladi.
           */

          if (!monthNumber || !dayNumber) {
            console.warn(
              'Sana topilmadi:',
              page.path
            );

            return;
          }

          // --------------------------------------
          // YIL
          // --------------------------------------
          //
          // Telegraph path'da yil saqlanmaydi.
          // Sizning hozirgi blogingiz 2026 yil bo'lgani
          // uchun joriy yil ishlatiladi.
          // --------------------------------------

          const year = new Date().getFullYear();

          // --------------------------------------
          // OY
          // --------------------------------------

          const month = MONTHS[monthNumber - 1];

          // --------------------------------------
          // SANA
          // --------------------------------------

          const dateFormatted =
            `${dayNumber
              .toString()
              .padStart(2, '0')} ${month}, ${year}`;

          // --------------------------------------
          // POST
          // --------------------------------------

          const post = {
            id: page.path,
            slug: page.path,
            title: page.title,
            description: page.description,

            year,
            monthNumber,
            month,
            day: dayNumber,

            dateFormatted
          };

          // --------------------------------------
          // YILNI YARATISH
          // --------------------------------------

          if (!grouped[year]) {
            grouped[year] = {};
          }

          // --------------------------------------
          // OYNI YARATISH
          // --------------------------------------

          if (!grouped[year][monthNumber]) {
            grouped[year][monthNumber] = {
              name: month,
              posts: []
            };
          }

          /*
           * POSTNI QO'SHISH
           *
           * Telegraph yangi postlarni birinchi
           * bergani uchun shu tartibni saqlaymiz.
           */
          grouped[year][monthNumber].posts.push(post);
        });

        setBlogsByYearMonth(grouped);

      } catch (error) {
        console.error(
          'Error fetching Telegraph posts:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ==========================================
  // YILLAR
  // YANGI -> ESKI
  // ==========================================

  const years = Object.keys(
    blogsByYearMonth
  ).sort((a, b) => Number(b) - Number(a));

  // ==========================================
  // SAHIFA
  // ==========================================

  return (
    <>
      {/* ======================================
          BLOG TITLE
      ====================================== */}

      <section className="section-title">
        <div className="container">
          <div className="section-content">
            <h1>Blog</h1>
          </div>
        </div>
      </section>

      {/* ======================================
          BLOG LIST
      ====================================== */}

      <section
        className="flex align-items-start"
        style={{ minHeight: '80vh' }}
      >
        <div className="container">

          <div className="row justify-between align-top">

            {/* =================================
                POSTLAR
            ================================= */}

            <div
              id="archive"
              className="col-md-7"
            >

              {years.length > 0 ? (

                years.map((year) => (

                  <React.Fragment key={year}>

                    {/* =========================
                        YIL
                    ========================= */}

                    <h4 className="sticky">
                      {year}
                    </h4>

                    {/* =========================
                        OYLAR
                    ========================= */}

                    {Object.keys(
                      blogsByYearMonth[year]
                    )
                      .sort(
                        (a, b) =>
                          Number(b) - Number(a)
                      )
                      .map((monthNumber) => {

                        const monthData =
                          blogsByYearMonth[year][
                            monthNumber
                          ];

                        return (
                          <React.Fragment
                            key={monthNumber}
                          >

                            {/* ==================
                                OY
                            ================== */}

                            <h4>
                              {monthData.name}
                            </h4>

                            {/* ==================
                                POSTLAR
                            ================== */}

                            <ul className="list-wrapper">

                              {monthData.posts.map(
                                (blog) => (

                                  <li
                                    key={blog.id}
                                  >

                                    <Link
                                      className="list-item"
                                      to={`/blog/${blog.slug}`}
                                    >

                                      {/* =================
                                          KUN OY YIL
                                      ================= */}

                                      <div className="date">
                                        {blog.dateFormatted}
                                      </div>

                                      {/* =================
                                          SARLAVHA
                                      ================= */}

                                      <div
                                        className="title"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            blog.title
                                        }}
                                      />

                                    </Link>

                                  </li>

                                )
                              )}

                            </ul>

                          </React.Fragment>
                        );
                      })}

                  </React.Fragment>

                ))

              ) : !loading ? (

                <div
                  className="no-blogs-message"
                  style={{
                    padding: '15px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#333'
                  }}
                >
                  There are no current blogs.
                </div>

              ) : null}

            </div>

            {/* =================================
                SUBSCRIBE
            ================================= */}

            <div
              className="subscribe-form col-md-4 sticky"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
            >

              <h6>Subscribe</h6>

              <p>
                You can find my latest articles,
                lectures, and lessons on my Telegram
                channel{' '}
                <a
                  href="https://t.me/Abdunabiyev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @asilbek_abdunabiyev
                </a>.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================
          PROGRESS BAR
      ====================================== */}

      <div className="progress-bar">

        <div
          className="bar"
          style={{
            width: `${scrollProgress}%`
          }}
        />

      </div>
    </>
  );
};

export default BlogList;
