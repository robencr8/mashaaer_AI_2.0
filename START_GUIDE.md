# دليل تشغيل مشروع مشاعر المحسن
# Mashaaer Enhanced Project Startup Guide

## نظرة عامة | Overview

هذا الدليل يشرح كيفية تشغيل مشروع مشاعر المحسن باستخدام سكربتات التشغيل التلقائي.

This guide explains how to run the Mashaaer Enhanced Project using the automated startup scripts.

## المتطلبات الأساسية | Prerequisites

قبل البدء، تأكد من تثبيت البرامج التالية:

Before starting, make sure you have the following software installed:

- Python 3.8 أو أحدث | Python 3.8 or newer
- Node.js 14 أو أحدث | Node.js 14 or newer
- npm 6 أو أحدث | npm 6 or newer

## طرق التشغيل | Startup Methods

### الطريقة 1: استخدام ملف الدفعة | Method 1: Using Batch File

هذه هي الطريقة الأسهل لتشغيل المشروع:

This is the easiest way to run the project:

1. انقر نقرًا مزدوجًا على ملف `start.bat` في مجلد المشروع
2. سيتم تشغيل كل من الخادم الخلفي (Flask) وواجهة المستخدم (React) تلقائيًا

1. Double-click on the `start.bat` file in the project folder
2. Both the backend server (Flask) and the user interface (React) will start automatically

### الطريقة 2: استخدام سكربت PowerShell | Method 2: Using PowerShell Script

إذا كنت تفضل استخدام PowerShell مباشرة:

If you prefer to use PowerShell directly:

1. افتح PowerShell
2. انتقل إلى مجلد المشروع
3. قم بتشغيل السكربت:

1. Open PowerShell
2. Navigate to the project folder
3. Run the script:

```powershell
.\start-mashaaer.ps1
```

## ماذا يفعل سكربت التشغيل؟ | What Does the Startup Script Do?

سكربت التشغيل يقوم بالخطوات التالية:

The startup script performs the following steps:

1. التحقق من تثبيت Python و Node.js
2. تنشيط (أو إنشاء إذا لزم الأمر) البيئة الافتراضية لـ Python
3. **التحقق من سلامة pip وإعادة إنشاء البيئة الافتراضية تلقائيًا إذا كان تالفًا**
4. تثبيت اعتماديات الخادم الخلفي من ملف requirements.txt (متوفر في المجلد الرئيسي ويشير إلى backend/requirements.txt)
5. تثبيت اعتماديات واجهة المستخدم باستخدام npm
6. تشغيل خادم Flask الخلفي في نافذة PowerShell جديدة
7. تشغيل واجهة المستخدم React في النافذة الحالية
8. **إنشاء ملف سجل (log) مفصل لكل عملية تشغيل مع طابع زمني**

1. Checks if Python and Node.js are installed
2. Activates (or creates if needed) the Python virtual environment
3. **Verifies pip functionality and automatically recreates the virtual environment if corrupted**
4. Installs backend dependencies from requirements.txt (available in the root directory and references backend/requirements.txt)
5. Installs frontend dependencies using npm
6. Starts the Flask backend server in a new PowerShell window
7. Starts the React frontend in the current window
8. **Creates a detailed log file for each run with timestamp**

### ملفات السجل | Log Files

السكربت ينشئ ملف سجل (log) لكل عملية تشغيل بتنسيق `log_YYYY-MM-DD_HH-MM-SS.txt` في مجلد المشروع. يحتوي هذا الملف على:

The script creates a log file for each run in the format `log_YYYY-MM-DD_HH-MM-SS.txt` in the project folder. This file contains:

- سجل زمني لكل خطوة من خطوات التشغيل | Timestamp for each step of the startup process
- حالة نجاح أو فشل كل خطوة (✅/❌) | Success or failure status of each step (✅/❌)
- رسائل الخطأ التفصيلية في حالة حدوث مشكلات | Detailed error messages in case of problems
- معلومات تشخيصية مفيدة للاستكشاف الأخطاء | Diagnostic information useful for troubleshooting

## الوصول إلى التطبيق | Accessing the Application

بعد تشغيل السكربت، يمكنك الوصول إلى التطبيق على:

After running the script, you can access the application at:

- واجهة المستخدم | Frontend: http://localhost:3000
- الخادم الخلفي | Backend: http://localhost:5000
- لوحة المقاييس | Metrics Dashboard: http://localhost:5000/api/metrics
- خطة التطوير | Improvement Plan: http://localhost:3000/improvement-plan

## إيقاف التطبيق | Stopping the Application

لإيقاف التطبيق:

To stop the application:

1. اضغط على `Ctrl+C` في نافذة واجهة المستخدم (React)
2. أغلق نافذة PowerShell التي تشغل الخادم الخلفي (Flask)

1. Press `Ctrl+C` in the frontend (React) window
2. Close the PowerShell window running the backend server (Flask)

## استكشاف الأخطاء وإصلاحها | Troubleshooting

### مشاكل البيئة الافتراضية | Virtual Environment Issues

السكربت مصمم للتعامل تلقائيًا مع مشاكل البيئة الافتراضية:

The script is designed to automatically handle virtual environment issues:

- **تفعيل البيئة الافتراضية**: يستخدم السكربت الآن الطريقة الصحيحة لتفعيل البيئة الافتراضية في PowerShell (باستخدام Activate.ps1)
- **تلف pip.exe**: إذا اكتشف السكربت أن pip.exe تالف، سيقوم تلقائيًا بإعادة إنشاء البيئة الافتراضية
- **فشل التثبيت**: إذا فشل تثبيت الحزم، سيحاول السكربت إصلاح المشكلة بإعادة إنشاء البيئة الافتراضية وتحديث pip
- **التحقق من النجاح**: يتحقق السكربت من نجاح تفعيل البيئة الافتراضية قبل المتابعة
- **الإرشادات**: في حالة استمرار المشكلة، سيقدم السكربت إرشادات للإصلاح اليدوي

- **Virtual Environment Activation**: The script now uses the correct method to activate the virtual environment in PowerShell (using Activate.ps1)
- **pip.exe Corruption**: If the script detects that pip.exe is corrupted, it will automatically recreate the virtual environment
- **Installation Failures**: If package installation fails, the script will attempt to fix the issue by recreating the virtual environment and updating pip
- **Success Verification**: The script verifies successful activation of the virtual environment before proceeding
- **Guidance**: If problems persist, the script provides guidance for manual resolution

### مشاكل تثبيت tokenizers / Rust | Tokenizers / Rust Installation Issues

السكربت يتعامل الآن تلقائيًا مع مشاكل تثبيت حزمة tokenizers التي تعتمد على مترجم Rust:

The script now automatically handles installation issues with the tokenizers package that depends on the Rust compiler:

- **استخدام النسخ المبنية مسبقًا**: يحاول السكربت تثبيت نسخة مبنية مسبقًا من tokenizers لتجنب الحاجة إلى مترجم Rust
- **اكتشاف أخطاء Rust**: يكتشف السكربت أخطاء تثبيت tokenizers المرتبطة بـ Rust ويوفر حلًا بديلًا
- **التثبيت البديل**: إذا فشل التثبيت العادي، يقوم السكربت بتثبيت transformers بدون تبعيات ثم تثبيت باقي الحزم بشكل منفصل
- **السجلات التفصيلية**: يوفر السكربت سجلات تفصيلية عن عملية التثبيت ومحاولات الإصلاح
- **توافق Python 3.13**: يكتشف السكربت تلقائيًا إصدار Python 3.13 أو أحدث ويتخطى تثبيت tokenizers تمامًا، مع تشغيل وضع التوافق

- **Using Pre-built Wheels**: The script attempts to install a pre-built version of tokenizers to avoid the need for a Rust compiler
- **Rust Error Detection**: The script detects tokenizers installation errors related to Rust and provides an alternative solution
- **Alternative Installation**: If normal installation fails, the script installs transformers without dependencies and then installs the remaining packages separately
- **Detailed Logging**: The script provides detailed logs about the installation process and recovery attempts
- **Python 3.13 Compatibility**: The script automatically detects Python 3.13 or newer and skips tokenizers installation entirely, running in compatibility mode

### توافق Python 3.13 | Python 3.13 Compatibility

إذا كنت تستخدم Python 3.13 أو أحدث، فإن حزمة tokenizers غير متوافقة حاليًا مع هذا الإصدار. سيقوم السكربت تلقائيًا بما يلي:

If you are using Python 3.13 or newer, the tokenizers package is currently not compatible with this version. The script will automatically:

1. **اكتشاف إصدار Python**: يتعرف السكربت على إصدار Python 3.13 أو أحدث
2. **تفعيل وضع التوافق**: يتخطى تثبيت tokenizers تمامًا
3. **تثبيت transformers بدون تبعيات**: يثبت transformers مع تعطيل التبعيات التلقائية
4. **تثبيت باقي الحزم**: يثبت جميع الحزم الأخرى بشكل منفصل
5. **تسجيل رسائل توضيحية**: يوضح أن النظام يعمل في "وضع التوافق"

1. **Detect Python Version**: Recognize Python 3.13 or newer
2. **Enable Compatibility Mode**: Skip tokenizers installation entirely
3. **Install transformers without dependencies**: Install transformers with automatic dependencies disabled
4. **Install other packages**: Install all other packages separately
5. **Log explanatory messages**: Clarify that the system is running in "compatibility mode"

> **ملاحظة**: في وضع التوافق، قد لا تعمل بعض ميزات معالجة اللغة الطبيعية المتقدمة التي تعتمد على tokenizers، لكن معظم وظائف التطبيق ستعمل بشكل طبيعي.

> **Note**: In compatibility mode, some advanced natural language processing features that depend on tokenizers may not work, but most application functions will operate normally.

### الإصلاح اليدوي | Manual Fix

إذا استمرت المشاكل، يمكنك تنفيذ الخطوات التالية يدويًا:

If problems persist, you can manually perform these steps:

```powershell
# حذف البيئة الافتراضية | Delete the virtual environment
Remove-Item -Recurse -Force .\venv

# إنشاء بيئة افتراضية جديدة | Create a new virtual environment
python -m venv venv

# تفعيل البيئة الافتراضية | Activate the virtual environment (الطريقة الصحيحة في PowerShell)
# The correct way to activate in PowerShell
. .\venv\Scripts\Activate.ps1

# تحديث pip | Update pip
python -m pip install --upgrade pip

# تثبيت المتطلبات باستخدام سكربت إصلاح tokenizers | Install requirements using the tokenizers fix script
# استخدم هذا السكربت لتجنب مشاكل تثبيت tokenizers | Use this script to avoid tokenizers installation issues
.\fix-tokenizers-install.bat
# أو استخدم نسخة PowerShell | Or use the PowerShell version
# .\fix-tokenizers-install.ps1
```

### إصلاح مشاكل tokenizers / Rust يدويًا | Manual Fix for Tokenizers / Rust Issues

إذا واجهت خطأ "cargo rustc ... failed with code 101" أثناء تثبيت المتطلبات، جرب الخطوات التالية:

If you encounter a "cargo rustc ... failed with code 101" error during requirements installation, try these steps:

```powershell
# تثبيت tokenizers باستخدام النسخ المبنية مسبقًا فقط | Install tokenizers using pre-built wheels only
pip install tokenizers==0.13.3 --only-binary=:all:

# تثبيت transformers بدون تبعيات | Install transformers without dependencies
pip install transformers==4.30.2 --no-deps

# تثبيت باقي المتطلبات | Install the rest of the requirements
pip install flask==2.0.1 flask-cors==3.0.10 python-dotenv==0.19.0 feedparser==6.0.10 requests==2.28.2 torch==2.6.0 pyttsx3==2.90 psutil==5.9.5
```

أو بدلاً من ذلك، يمكنك تثبيت مترجم Rust:

Alternatively, you can install the Rust compiler:

```powershell
# تثبيت Rust من موقع rust-lang.org | Install Rust from rust-lang.org
Invoke-WebRequest -Uri https://win.rustup.rs -OutFile rustup-init.exe
.\rustup-init.exe -y
# إعادة تشغيل PowerShell لتحديث المسار | Restart PowerShell to update the path
# ثم تثبيت المتطلبات باستخدام سكربت إصلاح tokenizers | Then install requirements using the tokenizers fix script
.\fix-tokenizers-install.bat
# أو استخدم نسخة PowerShell | Or use the PowerShell version
# .\fix-tokenizers-install.ps1
```

> **ملاحظة مهمة**: لاحظ استخدام النقطة (.) قبل مسار ملف التفعيل. هذا يسمى "dot-sourcing" وهو ضروري لتفعيل البيئة الافتراضية بشكل صحيح في PowerShell.

> **Important Note**: Notice the dot (.) before the activation script path. This is called "dot-sourcing" and is necessary to properly activate the virtual environment in PowerShell.
