# اسکریپت‌های دقیق ویدیوهای یوتیوب - API نیکود

## 📹 قسمت 1: معرفی پروژه و راه‌اندازی

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! به کانال من خوش آمدید. امروز می‌خوایم یک پروژه API کامل رو با هم بررسی کنیم.
این پروژه شامل مدیریت شخصیت‌های انیمه، سیستم کاربران، نظرات و جستجوی پیشرفته هست.
اگر این ویدیو رو دوست داشتید، حتماً لایک کنید و subscribe کنید!
```

### 🎯 معرفی پروژه (2 دقیقه)

```
بیایید اول ببینیم این پروژه چی داره:
- یک API کامل با 4 endpoint اصلی
- سیستم احراز هویت با API Key
- مستندات تعاملی با تستر API
- تست‌های کامل برای همه endpoint ها
- جستجوی پیشرفته در همه داده‌ها

تکنولوژی‌هایی که استفاده کردیم:
- Next.js 15 برای فریم‌ورک
- TypeScript برای type safety
- Zod برای validation
- Fumadocs برای مستندات
- Vitest برای تست‌نویسی
```

### 🛠️ راه‌اندازی (5 دقیقه)

```
حالا بیایید پروژه رو راه‌اندازی کنیم:

1. اول Node.js و Bun رو نصب کنید
2. پروژه رو clone کنید:
   git clone [repository-url]
   cd api-nikode

3. dependencies رو نصب کنید:
   bun install

4. پروژه رو اجرا کنید:
   bun run dev
```

### 📁 ساختار پروژه (5 دقیقه)

```
بیایید ساختار پروژه رو ببینیم:

src/app/api/ - API endpoints
src/lib/ - توابع کمکی
src/components/ - کامپوننت‌های React
content/docs/ - مستندات
test/ - فایل‌های تست

فایل‌های مهم:
- package.json: dependencies و scripts
- tsconfig.json: تنظیمات TypeScript
- vitest.config.ts: تنظیمات تست
```

### 🎮 نمایش مستندات (5 دقیقه)

```
حالا بیایید مستندات رو ببینیم:
localhost:3000/docs

اینجا می‌تونید:
- همه API endpoints رو ببینید
- با API Tester تست کنید
- مثال‌های کامل ببینید
```

---

## 📹 قسمت 2: ساختار API و Authentication

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت دوم، می‌خوایم ساختار API و سیستم احراز هویت رو بررسی کنیم.
این قسمت خیلی مهمه چون پایه همه چیزه!
```

### 🔗 API Endpoints (5 دقیقه)

```
ما 4 endpoint اصلی داریم:

1. /api/characters - مدیریت شخصیت‌های انیمه
   - GET: دریافت لیست شخصیت‌ها
   - POST: ایجاد شخصیت جدید
   - PUT: ویرایش شخصیت
   - DELETE: حذف شخصیت

2. /api/users - مدیریت کاربران
   - CRUD operations برای کاربران

3. /api/comments - سیستم نظرات
   - مدیریت نظرات برای شخصیت‌ها

4. /api/search - جستجوی پیشرفته
   - جستجو در همه داده‌ها
```

### 🔐 سیستم احراز هویت (10 دقیقه)

```
حالا بیایید سیستم احراز هویت رو ببینیم:

1. API Key Authentication:
   - همه درخواست‌ها نیاز به API Key دارن
   - می‌تونید از header استفاده کنید:
     x-api-key: your-api-key
   - یا از Authorization header:
     Authorization: Bearer your-api-key

2. کدهای مربوطه در src/lib/utils.ts:
   - validateApiKey(): بررسی اعتبار API Key
   - getApiKeyRole(): دریافت نقش کاربر
   - requireAuth(): بررسی احراز هویت

3. API Keys موجود:
   - demo-api-key-123 (user role)
   - test-api-key-456 (moderator role)
   - admin-api-key-789 (admin role)
```

### 👥 سیستم نقش‌ها (5 دقیقه)

```
ما 3 نقش اصلی داریم:

1. User (کاربر):
   - دسترسی خواندن به همه داده‌ها
   - ایجاد نظرات
   - جستجو

2. Moderator (مدیر):
   - همه دسترسی‌های User
   - ایجاد و ویرایش شخصیت‌ها
   - مدیریت نظرات

3. Admin (مدیر کل):
   - همه دسترسی‌ها
   - مدیریت کاربران
   - دسترسی کامل
```

### 🧪 تست Authentication (5 دقیقه)

```
حالا بیایید تست کنیم:

1. تست بدون API Key:
   - باید 401 Unauthorized بگیریم

2. تست با API Key نامعتبر:
   - باید 401 بگیریم

3. تست با API Key معتبر:
   - باید 200 OK بگیریم

4. تست دسترسی غیرمجاز:
   - User نمی‌تونه شخصیت ایجاد کنه
   - باید 403 Forbidden بگیریم
```

---

## 📹 قسمت 3: Characters API

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت سوم، می‌خوایم Characters API رو کامل بررسی کنیم.
این قسمت خیلی جذابه چون با شخصیت‌های انیمه کار می‌کنیم!
```

### 🎭 مدل Character (5 دقیقه)

```
بیایید مدل Character رو ببینیم:

interface Character {
  id: string;
  name: string;
  anime: string;
  power: number;
  intelligence: number;
  speed: number;
  strength: number;
  image: string;
  description: string;
  abilities: string[];
  personality: string;
  birthday: string;
  height: string;
  weight: string;
  createdAt: string;
  updatedAt: string;
}

این مدل شامل:
- اطلاعات پایه (نام، انیمه)
- آمار قدرت (power, intelligence, speed, strength)
- اطلاعات ظاهری (تصویر، قد، وزن)
- اطلاعات شخصیتی (شخصیت، توانایی‌ها)
```

### 📋 GET /api/characters (5 دقیقه)

```
حالا بیایید endpoint دریافت لیست شخصیت‌ها رو ببینیم:

1. درخواست ساده:
   GET /api/characters

2. با Pagination:
   GET /api/characters?page=1&limit=10

3. با Filtering:
   GET /api/characters?anime=naruto
   GET /api/characters?power=90

4. با Sorting:
   GET /api/characters?sort=power&order=desc

پاسخ شامل:
- لیست شخصیت‌ها
- اطلاعات pagination
- تعداد کل
```

### ➕ POST /api/characters (5 دقیقه)

```
حالا بیایید ایجاد شخصیت جدید رو ببینیم:

1. درخواست POST:
   POST /api/characters
   Headers: x-api-key: test-api-key-456
   Body: {
     "name": "Naruto Uzumaki",
     "anime": "Naruto",
     "power": 95,
     "intelligence": 70,
     "speed": 90,
     "strength": 85,
     "description": "Hokage of Hidden Leaf Village",
     "abilities": ["Rasengan", "Shadow Clone"],
     "personality": "Determined and friendly"
   }

2. Validation:
   - همه فیلدهای اجباری باید پر باشن
   - اعداد باید بین 0 تا 100 باشن
   - نام باید unique باشه

3. پاسخ موفق:
   - 201 Created
   - شخصیت ایجاد شده
```

### 🔍 GET /api/characters/[id] (5 دقیقه)

```
حالا بیایید دریافت شخصیت خاص رو ببینیم:

1. درخواست:
   GET /api/characters/1

2. پاسخ موفق:
   - 200 OK
   - اطلاعات کامل شخصیت

3. شخصیت پیدا نشد:
   - 404 Not Found
   - پیام خطا
```

### ✏️ PUT /api/characters/[id] (5 دقیقه)

```
حالا بیایید ویرایش شخصیت رو ببینیم:

1. درخواست PUT:
   PUT /api/characters/1
   Headers: x-api-key: test-api-key-456
   Body: {
     "power": 98,
     "description": "Updated description"
   }

2. Partial Update:
   - فقط فیلدهای تغییر یافته
   - بقیه فیلدها بدون تغییر

3. Validation:
   - همان validation های POST
   - بررسی وجود شخصیت
```

### 🗑️ DELETE /api/characters/[id] (5 دقیقه)

```
حالا بیایید حذف شخصیت رو ببینیم:

1. درخواست DELETE:
   DELETE /api/characters/1
   Headers: x-api-key: admin-api-key-789

2. Confirmation:
   - شخصیت حذف می‌شه
   - 200 OK

3. خطاها:
   - 404: شخصیت پیدا نشد
   - 403: دسترسی غیرمجاز
```

---

## 📹 قسمت 4: Users API

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت چهارم، می‌خوایم Users API رو بررسی کنیم.
این قسمت مهمه چون مدیریت کاربران رو یاد می‌گیریم!
```

### 👤 مدل User (5 دقیقه)

```
بیایید مدل User رو ببینیم:

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "moderator" | "admin";
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

این مدل شامل:
- اطلاعات پایه (username, email)
- نقش کاربر (role)
- اطلاعات پروفایل (avatar, bio)
- timestamps
```

### 🔄 CRUD Operations (15 دقیقه)

```
حالا بیایید همه عملیات CRUD رو ببینیم:

1. GET /api/users - لیست کاربران:
   - فقط Admin می‌تونه ببینه
   - با pagination و filtering

2. POST /api/users - ایجاد کاربر:
   - نیاز به Admin role
   - validation برای email و username

3. GET /api/users/[id] - دریافت کاربر:
   - Admin یا خود کاربر
   - 404 اگر پیدا نشد

4. PUT /api/users/[id] - ویرایش کاربر:
   - Admin یا خود کاربر
   - partial update

5. DELETE /api/users/[id] - حذف کاربر:
   - فقط Admin
   - حذف کامل
```

### 🔒 Role-based Access Control (5 دقیقه)

```
حالا بیایید سیستم دسترسی رو ببینیم:

1. User Role:
   - فقط پروفایل خودش
   - نمی‌تونه کاربران دیگه رو ببینه

2. Moderator Role:
   - دسترسی محدود
   - نمی‌تونه کاربران رو مدیریت کنه

3. Admin Role:
   - دسترسی کامل
   - همه عملیات

تست‌ها:
- User سعی می‌کنه لیست کاربران رو ببینه: 403
- Moderator سعی می‌کنه کاربر حذف کنه: 403
- Admin همه چیز رو می‌تونه: 200
```

---

## 📹 قسمت 5: Comments API

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت پنجم، می‌خوایم Comments API رو بررسی کنیم.
این قسمت جذابه چون سیستم نظرات رو یاد می‌گیریم!
```

### 💬 مدل Comment (5 دقیقه)

```
بیایید مدل Comment رو ببینیم:

interface Comment {
  id: string;
  characterId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

این مدل شامل:
- ارتباط با شخصیت و کاربر
- محتوای نظر
- امتیاز (1-5)
- timestamps
```

### 🔄 Comment Operations (10 دقیقه)

```
حالا بیایید عملیات نظرات رو ببینیم:

1. GET /api/comments - دریافت نظرات:
   - همه کاربران می‌تونن ببینن
   - با filtering برای شخصیت خاص

2. POST /api/comments - ایجاد نظر:
   - نیاز به authentication
   - validation برای content و rating

3. PUT /api/comments/[id] - ویرایش نظر:
   - فقط نویسنده یا moderator
   - partial update

4. DELETE /api/comments/[id] - حذف نظر:
   - نویسنده، moderator یا admin
   - حذف کامل
```

### 🛡️ Moderation Features (5 دقیقه)

```
حالا بیایید قابلیت‌های moderation رو ببینیم:

1. Moderator Actions:
   - ویرایش نظرات نامناسب
   - حذف نظرات توهین‌آمیز
   - مدیریت نظرات

2. Admin Actions:
   - همه دسترسی‌های moderator
   - مدیریت کامل نظرات

3. User Actions:
   - فقط نظرات خودش
   - محدودیت‌های خاص
```

---

## 📹 قسمت 6: Search API

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت ششم، می‌خوایم Search API رو بررسی کنیم.
این قسمت خیلی کاربردیه چون جستجوی پیشرفته رو یاد می‌گیریم!
```

### 🔍 معرفی Search API (5 دقیقه)

```
بیایید Search API رو ببینیم:

این API قابلیت‌های زیر رو داره:
- جستجو در Characters, Users, Comments
- فیلتر بر اساس نوع
- جستجوی پیشرفته
- pagination
- relevance scoring
```

### 🔎 Search Features (10 دقیقه)

```
حالا بیایید قابلیت‌های جستجو رو ببینیم:

1. جستجوی عمومی:
   GET /api/search?q=naruto

2. جستجو در نوع خاص:
   GET /api/search?q=naruto&type=characters
   GET /api/search?q=admin&type=users
   GET /api/search?q=great&type=comments

3. فیلترهای پیشرفته:
   GET /api/search?type=characters&anime=naruto&power=90
   GET /api/search?type=users&role=admin
   GET /api/search?type=comments&rating=5

4. ترکیب فیلترها:
   GET /api/search?q=naruto&type=characters&power=90&anime=naruto
```

### 📊 Advanced Search (5 دقیقه)

```
حالا بیایید جستجوی پیشرفته رو ببینیم:

1. Relevance Scoring:
   - امتیاز بر اساس تطابق
   - اولویت‌بندی نتایج

2. Pagination:
   - صفحه‌بندی نتایج
   - کنترل تعداد نتایج

3. Performance:
   - بهینه‌سازی جستجو
   - caching نتایج
```

---

## 📹 قسمت 7: Testing

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت هفتم، می‌خوایم Testing رو بررسی کنیم.
این قسمت مهمه چون کیفیت کد رو تضمین می‌کنه!
```

### 🧪 معرفی Vitest (5 دقیقه)

```
بیایید Vitest رو ببینیم:

چرا تست مهمه؟
- اطمینان از عملکرد صحیح
- جلوگیری از regression
- مستندسازی کد
- اعتماد به نفس در تغییرات

Vitest چیه؟
- تست runner برای JavaScript/TypeScript
- سازگار با Vite
- سرعت بالا
- پشتیبانی از ESM
```

### 🔬 Unit Tests (10 دقیقه)

```
حالا بیایید Unit Tests رو ببینیم:

1. اجرای تست‌ها:
   bun test
   bun test --watch
   bun test --coverage

2. ساختار تست:
   - describe: گروه‌بندی تست‌ها
   - it/test: تست‌های فردی
   - expect: assertions

3. مثال تست:
   describe('Character API', () => {
     it('should return characters list', async () => {
       // test code
     })
   })
```

### 🧪 API Tests (10 دقیقه)

```
حالا بیایید API Tests رو ببینیم:

1. تست Characters API:
   - GET /api/characters
   - POST /api/characters
   - PUT /api/characters/[id]
   - DELETE /api/characters/[id]

2. تست Authentication:
   - تست بدون API key
   - تست با API key نامعتبر
   - تست با API key معتبر

3. تست Error Cases:
   - 404 Not Found
   - 400 Bad Request
   - 403 Forbidden
   - 401 Unauthorized
```

---

## 📹 قسمت 8: مستندات تعاملی

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت هشتم، می‌خوایم مستندات تعاملی رو بررسی کنیم.
این قسمت جذابه چون API Tester رو یاد می‌گیریم!
```

### 📚 معرفی Fumadocs (5 دقیقه)

```
بیایید Fumadocs رو ببینیم:

چرا مستندات تعاملی؟
- تجربه بهتر کاربر
- تست مستقیم API
- یادگیری آسان‌تر
- کاهش سوالات تکراری

Fumadocs چیه؟
- فریم‌ورک مستندات برای Next.js
- پشتیبانی از MDX
- کامپوننت‌های تعاملی
- SEO بهینه
```

### 🎮 API Tester Component (10 دقیقه)

```
حالا بیایید API Tester رو ببینیم:

1. ویژگی‌های API Tester:
   - انتخاب endpoint
   - تنظیم headers
   - نوشتن body
   - نمایش response
   - انتخاب API key

2. نحوه استفاده:
   - انتخاب method (GET, POST, PUT, DELETE)
   - وارد کردن URL
   - تنظیم headers
   - نوشتن JSON body
   - کلیک روی Send

3. نمایش نتایج:
   - Status code
   - Response body
   - Response headers
   - زمان اجرا
```

### 🎨 Customization (5 دقیقه)

```
حالا بیایید شخصی‌سازی رو ببینیم:

1. اضافه کردن مثال‌های جدید:
   - در فایل‌های MDX
   - با کامپوننت ApiTester

2. شخصی‌سازی استایل:
   - تغییر رنگ‌ها
   - تغییر فونت‌ها
   - اضافه کردن لوگو

3. اضافه کردن قابلیت‌های جدید:
   - Export/Import
   - History
   - Collections
```

---

## 📹 قسمت 9: Deployment

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت نهم، می‌خوایم Deployment رو بررسی کنیم.
این قسمت مهمه چون پروژه رو live می‌کنیم!
```

### 🏗️ Build Process (5 دقیقه)

```
حالا بیایید Build Process رو ببینیم:

1. Build کردن پروژه:
   bun run build

2. بررسی Build:
   - چک کردن errors
   - بهینه‌سازی
   - minification

3. Test Build:
   bun run start
   - تست در localhost
   - بررسی عملکرد
```

### ☁️ Cloudflare Deployment (10 دقیقه)

```
حالا بیایید Cloudflare Deployment رو ببینیم:

1. معرفی Cloudflare Pages:
   - رایگان
   - سرعت بالا
   - CDN جهانی
   - SSL رایگان

2. تنظیمات Deployment:
   - اتصال به GitHub
   - تنظیم build command
   - تنظیم output directory

3. Environment Variables:
   - تنظیم API keys
   - متغیرهای محیطی
   - secrets management
```

### 🔧 Environment Variables (5 دقیقه)

```
حالا بیایید Environment Variables رو ببینیم:

1. متغیرهای مهم:
   - DATABASE_URL
   - JWT_SECRET
   - API_KEYS

2. مدیریت Secrets:
   - استفاده از .env
   - تنظیم در Cloudflare
   - امنیت اطلاعات

3. Testing در Production:
   - تست API endpoints
   - بررسی عملکرد
   - monitoring
```

---

## 📹 قسمت 10: نکات پیشرفته

### 🎬 مقدمه (30 ثانیه)

```
سلام دوستان! در قسمت آخر، می‌خوایم نکات پیشرفته رو بررسی کنیم.
این قسمت برای توسعه‌دهندگان حرفه‌ای مهمه!
```

### 🔷 TypeScript Best Practices (5 دقیقه)

```
حالا بیایید TypeScript Best Practices رو ببینیم:

1. Type Safety:
   - استفاده از interface
   - Generic types
   - Union types

2. Interface Design:
   - طراحی interface های مناسب
   - Extending interfaces
   - Optional properties

3. Error Handling:
   - Custom error types
   - Type guards
   - Error boundaries
```

### ⚡ Performance Optimization (10 دقیقه)

```
حالا بیایید Performance Optimization رو ببینیم:

1. Caching Strategies:
   - Redis caching
   - Memory caching
   - CDN caching

2. Database Optimization:
   - Indexing
   - Query optimization
   - Connection pooling

3. API Response Optimization:
   - Compression
   - Pagination
   - Selective fields
```

### 🔒 Security Best Practices (5 دقیقه)

```
حالا بیایید Security Best Practices رو ببینیم:

1. API Key Security:
   - رمزگذاری API keys
   - Rate limiting
   - Key rotation

2. Input Validation:
   - Zod validation
   - Sanitization
   - Type checking

3. Error Handling:
   - عدم افشای اطلاعات حساس
   - Logging مناسب
   - Monitoring
```

### 🚀 Future Improvements (5 دقیقه)

```
حالا بیایید Future Improvements رو ببینیم:

1. ایده‌های توسعه:
   - GraphQL API
   - Real-time features
   - Mobile app

2. ویژگی‌های جدید:
   - File upload
   - WebSocket
   - Push notifications

3. مقیاس‌پذیری:
   - Microservices
   - Load balancing
   - Auto-scaling
```

---

## 🎯 نکات نهایی

### 📝 خلاصه سری آموزشی:

1. **قسمت 1-3**: مفاهیم پایه و راه‌اندازی
2. **قسمت 4-6**: پیاده‌سازی API endpoints
3. **قسمت 7-8**: تست و مستندات
4. **قسمت 9-10**: deployment و بهینه‌سازی

### 🎬 نکات مهم برای ویدیو:

- **صداگذاری واضح** و آرام
- **نمایش کدها** با اندازه مناسب
- **تست عملی** همه قابلیت‌ها
- **پاسخ به سوالات** در کامنت‌ها

### 📈 اهداف آموزشی:

- یادگیری **Next.js API Routes**
- درک **TypeScript** و type safety
- آشنایی با **testing** و **documentation**
- تجربه **deployment** و **production**

**موفق باشید! 🚀**
