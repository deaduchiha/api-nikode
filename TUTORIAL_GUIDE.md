# راهنمای کامل آموزش API نیکود - برای یوتیوب فارسی

## 📋 خلاصه پروژه

این پروژه یک **API کامل برای مدیریت شخصیت‌های انیمه** است که با تکنولوژی‌های مدرن ساخته شده:

### 🛠️ تکنولوژی‌های استفاده شده:

- **Next.js 15** - فریم‌ورک React
- **TypeScript** - تایپ سیف
- **Zod** - اعتبارسنجی داده‌ها
- **Fumadocs** - مستندات تعاملی
- **Vitest** - تست‌نویسی
- **Tailwind CSS** - استایل‌دهی
- **Radix UI** - کامپوننت‌های UI

### 🎯 ویژگی‌های کلیدی:

- **API کامل** با 4 endpoint اصلی
- **احراز هویت** با API Key
- **سیستم نقش‌ها** (User, Moderator, Admin)
- **مستندات تعاملی** با تستر API
- **تست‌های کامل** برای همه endpoint ها
- **جستجوی پیشرفته** در همه داده‌ها

---

## 🎬 ساختار ویدیوهای یوتیوب

### 📹 قسمت 1: معرفی پروژه و راه‌اندازی

**مدت زمان پیشنهادی: 15-20 دقیقه**

#### محتوای ویدیو:

1. **معرفی پروژه** (2 دقیقه)

   - نمایش نهایی پروژه
   - توضیح ویژگی‌های اصلی
   - معرفی تکنولوژی‌ها

2. **راه‌اندازی محیط توسعه** (5 دقیقه)

   ```bash
   # نصب Node.js و Bun
   # کلون کردن پروژه
   git clone [repository-url]
   cd api-nikode
   bun install
   ```

3. **اجرای پروژه** (3 دقیقه)

   ```bash
   bun run dev
   # نمایش localhost:3000
   ```

4. **معرفی ساختار پروژه** (5 دقیقه)

   - توضیح پوشه‌های اصلی
   - معرفی فایل‌های مهم
   - نمایش package.json

5. **نمایش مستندات** (5 دقیقه)
   - بازدید از `/docs`
   - معرفی API Tester
   - تست یک endpoint ساده

#### نکات مهم برای فیلمبرداری:

- از **screen recording** با کیفیت بالا استفاده کنید
- **کدها را بزرگ** نمایش دهید
- **رنگ‌بندی مناسب** برای خوانایی
- **صداگذاری واضح** و آرام

---

### 📹 قسمت 2: ساختار API و Authentication

**مدت زمان پیشنهادی: 20-25 دقیقه**

#### محتوای ویدیو:

1. **معرفی API Endpoints** (5 دقیقه)

   ```
   /api/characters - مدیریت شخصیت‌ها
   /api/users - مدیریت کاربران
   /api/comments - سیستم نظرات
   /api/search - جستجوی پیشرفته
   ```

2. **سیستم احراز هویت** (10 دقیقه)

   - توضیح API Key
   - نمایش کدهای مربوطه
   - تست با Postman/Thunder Client

3. **سیستم نقش‌ها** (5 دقیقه)

   - User, Moderator, Admin
   - نمایش تفاوت دسترسی‌ها

4. **تست Authentication** (5 دقیقه)
   - تست با API Tester
   - نمایش خطاهای 401 و 403

#### فایل‌های مهم برای نمایش:

- `src/lib/utils.ts` - توابع احراز هویت
- `src/app/api/characters/route.ts` - نمونه endpoint
- `content/docs/authentication.mdx` - مستندات

---

### 📹 قسمت 3: Characters API - مدیریت شخصیت‌ها

**مدت زمان پیشنهادی: 25-30 دقیقه**

#### محتوای ویدیو:

1. **معرفی مدل Character** (5 دقیقه)

   ```typescript
   interface Character {
     id: string;
     name: string;
     anime: string;
     power: number;
     intelligence: number;
     speed: number;
     strength: number;
     // ... سایر فیلدها
   }
   ```

2. **GET /api/characters** (5 دقیقه)

   - دریافت لیست شخصیت‌ها
   - Pagination و Filtering
   - نمایش کدهای مربوطه

3. **POST /api/characters** (5 دقیقه)

   - ایجاد شخصیت جدید
   - Validation با Zod
   - نمایش خطاها

4. **GET /api/characters/[id]** (5 دقیقه)

   - دریافت شخصیت خاص
   - Error handling

5. **PUT /api/characters/[id]** (5 دقیقه)

   - ویرایش شخصیت
   - Partial updates

6. **DELETE /api/characters/[id]** (5 دقیقه)
   - حذف شخصیت
   - Confirmation

#### فایل‌های مهم:

- `src/lib/data/characters.ts` - داده‌های نمونه
- `src/types/index.ts` - تایپ‌های TypeScript
- `content/docs/characters.mdx` - مستندات کامل

---

### 📹 قسمت 4: Users API - مدیریت کاربران

**مدت زمان پیشنهادی: 20-25 دقیقه**

#### محتوای ویدیو:

1. **معرفی مدل User** (5 دقیقه)

   ```typescript
   interface User {
     id: string;
     username: string;
     email: string;
     role: "user" | "moderator" | "admin";
     // ... سایر فیلدها
   }
   ```

2. **CRUD Operations** (15 دقیقه)

   - GET /api/users - لیست کاربران
   - POST /api/users - ایجاد کاربر
   - GET /api/users/[id] - دریافت کاربر
   - PUT /api/users/[id] - ویرایش کاربر
   - DELETE /api/users/[id] - حذف کاربر

3. **Role-based Access Control** (5 دقیقه)
   - نمایش تفاوت دسترسی‌ها
   - تست با نقش‌های مختلف

#### نکات مهم:

- نمایش **خطاهای 403** برای دسترسی غیرمجاز
- تست با **API keys مختلف**
- نمایش **validation errors**

---

### 📹 قسمت 5: Comments API - سیستم نظرات

**مدت زمان پیشنهادی: 15-20 دقیقه**

#### محتوای ویدیو:

1. **معرفی مدل Comment** (5 دقیقه)

   ```typescript
   interface Comment {
     id: string;
     characterId: string;
     userId: string;
     content: string;
     rating: number;
     // ... سایر فیلدها
   }
   ```

2. **Comment Operations** (10 دقیقه)

   - GET /api/comments - دریافت نظرات
   - POST /api/comments - ایجاد نظر
   - PUT /api/comments/[id] - ویرایش نظر
   - DELETE /api/comments/[id] - حذف نظر

3. **Moderation Features** (5 دقیقه)
   - نمایش قابلیت‌های moderator
   - تست moderation actions

---

### 📹 قسمت 6: Search API - جستجوی پیشرفته

**مدت زمان پیشنهادی: 15-20 دقیقه**

#### محتوای ویدیو:

1. **معرفی Search API** (5 دقیقه)

   - جستجو در Characters, Users, Comments
   - Query parameters

2. **Search Features** (10 دقیقه)

   ```typescript
   // مثال‌های جستجو
   GET /api/search?q=naruto
   GET /api/search?type=characters&anime=naruto
   GET /api/search?type=users&role=admin
   ```

3. **Advanced Search** (5 دقیقه)
   - ترکیب فیلترها
   - Pagination در جستجو
   - Relevance scoring

---

### 📹 قسمت 7: Testing و Quality Assurance

**مدت زمان پیشنهادی: 20-25 دقیقه**

#### محتوای ویدیو:

1. **معرفی Vitest** (5 دقیقه)

   - چرا تست مهم است؟
   - معرفی Vitest

2. **Unit Tests** (10 دقیقه)

   ```bash
   bun test
   bun test --watch
   bun test --coverage
   ```

3. **API Tests** (10 دقیقه)
   - نمایش فایل‌های تست
   - تست endpoint ها
   - تست authentication
   - تست error cases

#### فایل‌های مهم:

- `test/api/characters.test.ts`
- `test/api/users.test.ts`
- `test/api/search.test.ts`

---

### 📹 قسمت 8: مستندات تعاملی و API Tester

**مدت زمان پیشنهادی: 15-20 دقیقه**

#### محتوای ویدیو:

1. **معرفی Fumadocs** (5 دقیقه)

   - چرا مستندات تعاملی؟
   - معرفی Fumadocs

2. **API Tester Component** (10 دقیقه)

   - نمایش کامپوننت ApiTester
   - تست endpoint ها
   - نمایش headers و body

3. **Customization** (5 دقیقه)
   - شخصی‌سازی مستندات
   - اضافه کردن مثال‌های جدید

#### فایل‌های مهم:

- `src/components/ApiTester.tsx`
- `content/docs/testing.mdx`

---

### 📹 قسمت 9: Deployment و Production

**مدت زمان پیشنهادی: 15-20 دقیقه**

#### محتوای ویدیو:

1. **Build Process** (5 دقیقه)

   ```bash
   bun run build
   bun run start
   ```

2. **Cloudflare Deployment** (10 دقیقه)

   - معرفی Cloudflare Pages
   - تنظیمات deployment
   - نمایش live URL

3. **Environment Variables** (5 دقیقه)
   - تنظیم API keys
   - مدیریت متغیرهای محیطی

---

### 📹 قسمت 10: نکات پیشرفته و بهینه‌سازی

**مدت زمان پیشنهادی: 20-25 دقیقه**

#### محتوای ویدیو:

1. **TypeScript Best Practices** (5 دقیقه)

   - Type safety
   - Interface design
   - Generic types

2. **Performance Optimization** (10 دقیقه)

   - Caching strategies
   - Database optimization
   - API response optimization

3. **Security Best Practices** (5 دقیقه)

   - API key security
   - Input validation
   - Rate limiting

4. **Future Improvements** (5 دقیقه)
   - ایده‌های توسعه
   - ویژگی‌های جدید

---

## 🎯 نکات مهم برای تولید ویدیو

### 📹 تکنیک‌های فیلمبرداری:

1. **Screen Recording**:

   - استفاده از OBS Studio یا Loom
   - رزولوشن 1920x1080
   - فریم‌ریت 30fps

2. **صداگذاری**:

   - میکروفون با کیفیت بالا
   - نویز کم
   - سرعت مناسب صحبت

3. **کد نمایش**:
   - فونت بزرگ و خوانا
   - رنگ‌بندی مناسب
   - هایلایت کردن کدهای مهم

### 📝 اسکریپت نویسی:

1. **مقدمه** (30 ثانیه):

   - سلام و معرفی
   - توضیح موضوع ویدیو
   - دعوت به subscribe

2. **محتوای اصلی**:

   - تقسیم به بخش‌های کوچک
   - مثال‌های عملی
   - نمایش خطاها و راه‌حل‌ها

3. **نتیجه‌گیری** (1 دقیقه):
   - خلاصه نکات مهم
   - دعوت به کامنت
   - معرفی ویدیوی بعدی

### 🎨 گرافیک و انیمیشن:

1. **Thumbnail**:

   - طراحی جذاب
   - رنگ‌های روشن
   - متن واضح

2. **انیمیشن‌ها**:
   - هایلایت کردن کدها
   - نشان دادن مسیرها
   - انیمیشن‌های ساده

---

## 📊 آمار و تحلیل

### 📈 معیارهای موفقیت:

- **Watch Time**: هدف 70% از کل ویدیو
- **Engagement Rate**: هدف 5% like/dislike
- **Comments**: تشویق به سوال و بحث
- **Subscribers**: رشد مداوم

### 📊 تحلیل محتوا:

- **Part 1-3**: بیشترین بازدید (مفاهیم پایه)
- **Part 4-6**: متوسط بازدید (پیاده‌سازی)
- **Part 7-10**: کمترین بازدید (پیشرفته)

---

## 🚀 برنامه زمان‌بندی

### 📅 هفته اول:

- **شنبه**: فیلمبرداری Part 1
- **یکشنبه**: تدوین Part 1
- **دوشنبه**: انتشار Part 1
- **سه‌شنبه**: فیلمبرداری Part 2
- **چهارشنبه**: تدوین Part 2
- **پنج‌شنبه**: انتشار Part 2

### 📅 هفته دوم:

- **شنبه**: فیلمبرداری Part 3
- **یکشنبه**: تدوین Part 3
- **دوشنبه**: انتشار Part 3
- **سه‌شنبه**: فیلمبرداری Part 4
- **چهارشنبه**: تدوین Part 4
- **پنج‌شنبه**: انتشار Part 4

### 📅 ادامه برنامه:

- **2 ویدیو در هفته**
- **زمان انتشار**: 18:00 تا 20:00
- **روزهای انتشار**: دوشنبه و پنج‌شنبه

---

## 💡 ایده‌های اضافی

### 🎬 ویدیوهای تکمیلی:

1. **Q&A Session**: پاسخ به سوالات
2. **Code Review**: بررسی کدهای کاربران
3. **Bug Fixing**: رفع مشکلات رایج
4. **Interview**: مصاحبه با توسعه‌دهندگان

### 📚 محتوای متنی:

1. **Blog Posts**: مقالات تکمیلی
2. **GitHub Repository**: کد کامل
3. **Documentation**: راهنمای فارسی
4. **Cheat Sheet**: خلاصه نکات مهم

---

## 🎯 نتیجه‌گیری

این راهنما به شما کمک می‌کند تا:

- **ساختار منظم** برای ویدیوها داشته باشید
- **محتوای با کیفیت** تولید کنید
- **مخاطب هدفمند** جذب کنید
- **رشد کانال** را تضمین کنید

**موفق باشید! 🚀**
