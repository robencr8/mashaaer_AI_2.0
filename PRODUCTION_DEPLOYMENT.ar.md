# دليل نشر مشروع مشاعر المحسن في بيئة الإنتاج

يشرح هذا الدليل كيفية نشر مشروع مشاعر المحسن في وضع الإنتاج.

## المتطلبات الأساسية

تأكد من وجود:

- بيئة Python 3.10+ منصبة
- Node.js 18+ منصب
- قاعدة بيانات PostgreSQL جاهزة
- مفاتيح API كاملة (OpenAI, ElevenLabs, Google, وغيرها)

## 1. إعداد البيئة

قم بإنشاء ملف `.env` في مجلد المشروع الرئيسي مع التكوين الخاص بك:

```
# مفاتيح API
OPENAI_API_KEY=مفتاح_openai_الخاص_بك
ELEVENLABS_API_KEY=مفتاح_elevenlabs_الخاص_بك
ELEVENLABS_VOICE_ID=معرف_صوت_elevenlabs_الخاص_بك

# تكوين قاعدة البيانات
DATABASE_URL=postgresql://user:pass@host:5432/mashaaer

# إعدادات التطبيق
DEFAULT_LANGUAGE=ar
DEBUG=false
ENABLE_FACIAL_RECOGNITION=false

# إعدادات CORS (للإنتاج)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

يمكنك استخدام ملف `.env.example` كقالب.

## 2. تثبيت التبعيات

### تبعيات Python

```bash
# إنشاء وتفعيل بيئة افتراضية
python -m venv venv
source venv/bin/activate  # على Linux/Mac
venv\Scripts\activate     # على Windows

# تثبيت التبعيات
pip install -r backend/requirements.txt
```

### تبعيات Node.js

```bash
# تثبيت تبعيات الواجهة الأمامية
npm install
```

## 3. بناء الواجهة الأمامية

```bash
# بناء تطبيق React
npm run build
```

سيؤدي هذا إلى إنشاء مجلد `build` يحتوي على الواجهة الأمامية الجاهزة للإنتاج.

## 4. تهيئة قاعدة البيانات

```bash
# إنشاء جداول قاعدة البيانات
python backend/db_init.py
```

تأكد من أن قاعدة بيانات PostgreSQL تعمل ويمكن الوصول إليها باستخدام بيانات الاعتماد المحددة في ملف `.env` الخاص بك.

## 5. خيارات النشر في بيئة الإنتاج

### الخيار أ: التشغيل باستخدام Gunicorn (موصى به للإنتاج)

```bash
# نسخ الواجهة الأمامية المبنية إلى مجلد Flask الثابت
xcopy /E /Y build\* backend\static\  # على Windows
cp -r build/* backend/static/        # على Linux/Mac

# التشغيل باستخدام Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 backend.app:app
```

### الخيار ب: النشر باستخدام Docker

بناء وتشغيل حاوية Docker:

```bash
# بناء صورة Docker
docker build -t mashaaer-enhanced .

# تشغيل الحاوية
docker run -p 5000:5000 --env-file .env mashaaer-enhanced
```

### الخيار ج: النشر على VPS باستخدام Nginx

1. نشر التطبيق باستخدام Gunicorn كما في الخيار أ
2. تكوين Nginx لتوجيه الطلبات إلى خادم Gunicorn:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### الخيار د: النشر على Netlify

للواجهة الأمامية فقط:

1. إعداد موقع جديد في Netlify
2. تكوين إعدادات البناء:
   - أمر البناء: `npm run build`
   - مجلد النشر: `build`
3. نشر الخلفية بشكل منفصل وتحديث نقاط نهاية API في كود الواجهة الأمامية

## 6. قائمة التحقق النهائية للأمان

قبل الانتقال إلى الإنتاج، تأكد من:

- [ ] DEBUG=false في ملف .env الخاص بك
- [ ] اتصال قاعدة البيانات آمن ويعمل
- [ ] جميع مفاتيح API صالحة وآمنة
- [ ] إعدادات CORS مكونة بشكل صحيح لنطاقك
- [ ] HTTPS مفعل للإنتاج
- [ ] تمت إزالة الملفات المؤقتة وسجلات التصحيح

## الوصول إلى التطبيق

بمجرد النشر، يمكنك الوصول إلى التطبيق على:

```
http://yourdomain.com
```

أو محليًا على:

```
http://localhost:5000
```

## استكشاف الأخطاء وإصلاحها

### مشاكل اتصال قاعدة البيانات

إذا واجهت مشاكل في اتصال قاعدة البيانات:

1. تحقق من صحة DATABASE_URL الخاص بك
2. تأكد من تشغيل PostgreSQL
3. تحقق من أن مستخدم قاعدة البيانات لديه الأذونات اللازمة

### مشاكل مفاتيح API

إذا كانت ميزات الذكاء الاصطناعي لا تعمل:

1. تحقق من جميع مفاتيح API في ملف .env الخاص بك
2. تحقق من حدود استخدام API وحالة الفوترة
3. اختبر اتصالات API بشكل فردي

## معلومات إضافية

لمزيد من المعلومات التفصيلية حول مشروع مشاعر المحسن، راجع ملف [README.md](README.md) الرئيسي.