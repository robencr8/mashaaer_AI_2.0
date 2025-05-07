@echo off
cls
echo 🔄 بدء تشغيل نظام مشاعر المحلي...
cd /d "C:\Users\loyal\Documents\MashaaerEnhanced\mashaaer-enhanced-final-updated"

:: 🧠 تشغيل الخادم الخلفي (Flask)
echo 🔧 تفعيل البيئة الافتراضية...
call src\venv\Scripts\activate.bat

echo ✅ تم تفعيل البيئة.
echo 🚀 تشغيل خادم Flask على http://127.0.0.1:5000 ...
start cmd /k "cd src && set FLASK_APP=main:app && set FLASK_ENV=production && flask run --host=127.0.0.1 --port=5000"

:: 🌐 تشغيل الواجهة الأمامية (React)
echo 🌐 تشغيل الواجهة الأمامية على http://localhost:3000 ...
cd frontend
start cmd /k "npm run build && npx serve -s build"

echo 🟢 النظام يعمل الآن. افتح المتصفح على:
echo - http://localhost:3000  (الواجهة)
echo - http://127.0.0.1:5000  (الخادم)
pause
