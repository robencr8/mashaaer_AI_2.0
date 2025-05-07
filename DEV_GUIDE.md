# دليل بيئة التطوير لمشروع مشاعر المحسن
# Mashaaer Enhanced Project Development Guide

## نظرة عامة | Overview

هذا الدليل يشرح كيفية استخدام سكربت `run-dev.ps1` لإعداد وتشغيل بيئة التطوير لمشروع مشاعر المحسن.

This guide explains how to use the `run-dev.ps1` script to set up and run the development environment for the Mashaaer Enhanced Project.

## المميزات | Features

سكربت `run-dev.ps1` يوفر تجربة تطوير موحدة مع المميزات التالية:

The `run-dev.ps1` script provides a unified development experience with the following features:

- تشخيص وإنشاء المجلدات المطلوبة تلقائيًا | Automatic diagnosis and creation of required directories
- إعداد البيئة الافتراضية لـ Python | Python virtual environment setup
- تثبيت اعتماديات الخادم الخلفي والواجهة الأمامية | Installation of backend and frontend dependencies
- تشغيل الخادم الخلفي (Flask) في وضع التطوير | Running the backend server (Flask) in development mode
- تشغيل الواجهة الأمامية (React) في وضع التطوير | Running the frontend (React) in development mode
- تشغيل اختبارات الواجهة الأمامية | Running frontend tests
- تشغيل أدوات فحص الكود (ESLint) | Running code linting tools (ESLint)
- إنشاء ملف بيئة خاص بالتطوير (.env.development) | Creating a development-specific environment file (.env.development)
- تسجيل مفصل للعمليات | Detailed logging of operations
- خيارات متعددة لتخصيص عملية التطوير | Multiple options to customize the development process

## المتطلبات الأساسية | Prerequisites

قبل استخدام سكربت التطوير، تأكد من تثبيت البرامج التالية:

Before using the development script, make sure you have the following software installed:

- Python 3.8 أو أحدث | Python 3.8 or newer
- Node.js 14 أو أحدث | Node.js 14 or newer
- npm 6 أو أحدث | npm 6 or newer
- PowerShell 5.0 أو أحدث | PowerShell 5.0 or newer

## استخدام السكربت | Using the Script

### الخيارات المتاحة | Available Options

سكربت `run-dev.ps1` يدعم الخيارات التالية:

The `run-dev.ps1` script supports the following options:

- `-Lint`: تشغيل ESLint على كود الواجهة الأمامية | Run ESLint on the frontend code
- `-Test`: تشغيل الاختبارات | Run tests
- `-SkipDiagnose`: تخطي تشخيص المجلدات | Skip directory diagnosis
- `-SkipInstall`: تخطي تثبيت الاعتماديات | Skip dependency installation
- `-BackendOnly`: تشغيل الخادم الخلفي فقط | Start only the backend server
- `-FrontendOnly`: تشغيل الواجهة الأمامية فقط | Start only the frontend server
- `-Help`: عرض رسالة المساعدة | Show the help message

### أمثلة الاستخدام | Usage Examples

#### تشغيل بيئة التطوير الكاملة | Run the full development environment

```powershell
.\run-dev.ps1
```

هذا سيقوم بتشغيل كل من الخادم الخلفي والواجهة الأمامية في وضع التطوير.

This will run both the backend and frontend servers in development mode.

#### تشغيل فحص الكود وبدء بيئة التطوير | Run linting and start the development environment

```powershell
.\run-dev.ps1 -Lint
```

هذا سيقوم بتشغيل ESLint على كود الواجهة الأمامية ثم بدء بيئة التطوير.

This will run ESLint on the frontend code and then start the development environment.

#### تشغيل الخادم الخلفي فقط | Run only the backend server

```powershell
.\run-dev.ps1 -BackendOnly
```

هذا سيقوم بتشغيل الخادم الخلفي فقط في وضع التطوير.

This will run only the backend server in development mode.

#### تشغيل الواجهة الأمامية فقط | Run only the frontend server

```powershell
.\run-dev.ps1 -FrontendOnly
```

هذا سيقوم بتشغيل الواجهة الأمامية فقط في وضع التطوير.

This will run only the frontend server in development mode.

#### تخطي تثبيت الاعتماديات | Skip dependency installation

```powershell
.\run-dev.ps1 -SkipInstall
```

هذا سيقوم بتخطي تثبيت الاعتماديات وبدء بيئة التطوير مباشرة.

This will skip dependency installation and start the development environment directly.

#### تشغيل الاختبارات | Run tests

```powershell
.\run-dev.ps1 -Test
```

هذا سيقوم بتشغيل اختبارات الواجهة الأمامية ثم بدء بيئة التطوير.

This will run frontend tests and then start the development environment.

#### عرض المساعدة | Show help

```powershell
.\run-dev.ps1 -Help
```

هذا سيعرض رسالة المساعدة مع شرح جميع الخيارات المتاحة.

This will display the help message with an explanation of all available options.

## ملفات السجل | Log Files

سكربت التطوير ينشئ ملف سجل (log) لكل عملية تشغيل بتنسيق `dev_log_YYYY-MM-DD_HH-MM-SS.txt` في مجلد المشروع. يحتوي هذا الملف على:

The development script creates a log file for each run in the format `dev_log_YYYY-MM-DD_HH-MM-SS.txt` in the project folder. This file contains:

- سجل زمني لكل خطوة من خطوات التطوير | Timestamp for each step of the development process
- حالة نجاح أو فشل كل خطوة | Success or failure status of each step
- رسائل الخطأ التفصيلية في حالة حدوث مشكلات | Detailed error messages in case of problems
- معلومات تشخيصية مفيدة للاستكشاف الأخطاء | Diagnostic information useful for troubleshooting

## ملف البيئة الخاص بالتطوير | Development Environment File

سكربت التطوير ينشئ ملف `.env.development` إذا لم يكن موجودًا. هذا الملف يحتوي على متغيرات البيئة الخاصة بالتطوير مثل:

The development script creates a `.env.development` file if it doesn't exist. This file contains development-specific environment variables such as:

```
DEBUG=true
REACT_APP_DEV_MODE=true
FLASK_ENV=development
FLASK_DEBUG=1
NODE_ENV=development
```

هذه المتغيرات تضمن أن التطبيق يعمل في وضع التطوير مع ميزات إضافية مثل إعادة التحميل التلقائي والتصحيح المفصل.

These variables ensure that the application runs in development mode with additional features such as hot reloading and verbose debugging.

## إيقاف بيئة التطوير | Stopping the Development Environment

لإيقاف بيئة التطوير:

To stop the development environment:

1. اضغط على `Ctrl+C` في نافذة PowerShell الرئيسية | Press `Ctrl+C` in the main PowerShell window
2. أغلق نوافذ PowerShell الإضافية التي تم فتحها للخادم الخلفي والواجهة الأمامية | Close the additional PowerShell windows that were opened for the backend and frontend servers

## استكشاف الأخطاء وإصلاحها | Troubleshooting

### مشاكل البيئة الافتراضية | Virtual Environment Issues

سكربت التطوير مصمم للتعامل تلقائيًا مع مشاكل البيئة الافتراضية:

The development script is designed to automatically handle virtual environment issues:

- إذا لم تكن البيئة الافتراضية موجودة، سيتم إنشاؤها تلقائيًا | If the virtual environment doesn't exist, it will be created automatically
- إذا كان pip.exe تالفًا، سيتم إعادة إنشاء البيئة الافتراضية | If pip.exe is corrupted, the virtual environment will be recreated
- إذا فشل تفعيل البيئة الافتراضية، سيتم عرض رسالة خطأ واضحة | If virtual environment activation fails, a clear error message will be displayed

### مشاكل تثبيت tokenizers / Rust | Tokenizers / Rust Installation Issues

سكربت التطوير يتعامل تلقائيًا مع مشاكل تثبيت حزمة tokenizers التي تعتمد على مترجم Rust:

The development script automatically handles installation issues with the tokenizers package that depends on the Rust compiler:

- يحاول تثبيت نسخة مبنية مسبقًا من tokenizers | Attempts to install a pre-built version of tokenizers
- يكتشف أخطاء تثبيت tokenizers المرتبطة بـ Rust ويوفر حلًا بديلًا | Detects tokenizers installation errors related to Rust and provides an alternative solution
- يكتشف تلقائيًا إصدار Python 3.13 أو أحدث ويتخطى تثبيت tokenizers تمامًا | Automatically detects Python 3.13 or newer and skips tokenizers installation entirely

### مشاكل أخرى | Other Issues

إذا واجهت أي مشاكل أخرى:

If you encounter any other issues:

1. تحقق من ملف السجل للحصول على معلومات تفصيلية | Check the log file for detailed information
2. تأكد من تثبيت جميع المتطلبات الأساسية | Make sure all prerequisites are installed
3. حاول تشغيل السكربت مع خيار `-SkipInstall` إذا كنت قد قمت بتثبيت الاعتماديات بالفعل | Try running the script with the `-SkipInstall` option if you've already installed dependencies
4. تحقق من وجود أخطاء في كود الواجهة الأمامية أو الخادم الخلفي | Check for errors in the frontend or backend code

## الفرق بين وضع التطوير ووضع الإنتاج | Difference Between Development and Production Mode

وضع التطوير يوفر ميزات إضافية تساعد في عملية التطوير:

Development mode provides additional features that help in the development process:

- إعادة التحميل التلقائي عند تغيير الكود | Hot reloading when code changes
- رسائل خطأ مفصلة | Verbose error messages
- أدوات تصحيح إضافية | Additional debugging tools
- تعطيل التخزين المؤقت للملفات الثابتة | Disabled caching of static files
- تعطيل الضغط والتصغير | Disabled minification and compression

هذه الميزات تجعل عملية التطوير أسهل وأسرع، لكنها قد تؤثر على الأداء. لذلك، يجب استخدام وضع الإنتاج عند نشر التطبيق للمستخدمين النهائيين.

These features make the development process easier and faster, but they may affect performance. Therefore, production mode should be used when deploying the application to end users.