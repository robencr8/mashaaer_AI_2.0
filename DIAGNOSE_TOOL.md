# أداة تشخيص المجلدات | Directory Diagnosis Tool

## نظرة عامة | Overview

أداة تشخيص المجلدات هي سكربت PowerShell يقوم بفحص وإنشاء جميع المجلدات المطلوبة لمشروع مشاعر المحسن. تساعد هذه الأداة في تجنب أخطاء "FileNotFoundError" التي قد تحدث عند تشغيل التطبيق.

The Directory Diagnosis Tool is a PowerShell script that checks and creates all required directories for the Mashaaer Enhanced Project. This tool helps prevent "FileNotFoundError" errors that might occur when running the application.

## الاستخدام | Usage

لتشغيل أداة التشخيص، قم بتنفيذ الخطوات التالية:

To run the diagnosis tool, follow these steps:

1. افتح PowerShell في مجلد المشروع | Open PowerShell in the project folder
2. قم بتشغيل السكربت | Run the script:

```powershell
.\diagnose.ps1
```

## ماذا تفعل الأداة؟ | What Does the Tool Do?

تقوم الأداة بفحص وإنشاء المجلدات التالية:

The tool checks and creates the following directories:

### المجلدات الرئيسية | Main Directories
- `data` - مجلد تخزين البيانات العامة | General data storage directory
- `logs` - مجلد سجلات التطبيق | Application logs directory
- `cache` - مجلد ملفات التخزين المؤقت | Temporary cache files directory
- `temp` - مجلد الملفات المؤقتة | Temporary files directory

### مجلدات الخادم الخلفي | Backend Directories
- `backend\data` - تخزين بيانات الخادم الخلفي | Backend data storage
- `backend\fine_tune_corpus` - بيانات التدريب وسجلات لضبط النموذج | Training data and logs for model fine-tuning
- `backend\mashaer_base_model` - ملفات النموذج الأساسي | Base model files
- `backend\routes` - تعريفات مسارات API | API route definitions

### مجلدات خاصة بالوحدات | Module-specific Directories
- `backend\data\dreams` - تخزين بيانات محاكي الأحلام | Dream simulator data storage
- `backend\data\emotions` - تخزين بيانات المشاعر | Emotion data storage
- `backend\data\feelings` - تخزين بيانات مسجل المشاعر | Feeling recorder data storage
- `backend\data\empathy` - تخزين بيانات واجهة التعاطف | Empathy interface data storage
- `backend\data\legacy` - تخزين بيانات الوضع القديم | Legacy mode data storage
- `backend\data\consciousness` - تخزين بيانات الوعي طويل المدى | Long-term consciousness data storage
- `backend\data\reflections` - تخزين بيانات محرك التفكير الحلقي | Loop reflection engine data storage
- `backend\data\memory` - تخزين بيانات مفهرس الذاكرة | Memory indexer data storage
- `backend\data\associations` - تخزين ارتباطات الذاكرة والشخصية | Memory-persona associations storage
- `backend\data\evolution` - تخزين بيانات شبكة الشخصيات المتوازية | Parallel personas network data storage
- `backend\data\blend` - تخزين بيانات شبكة الشخصيات | Persona mesh data storage
- `backend\data\shadow` - تخزين بيانات محرك الظل | Shadow engine data storage
- `backend\data\state` - تخزين بيانات مكامل الحالة | State integrator data storage
- `backend\data\metrics` - تخزين بيانات مقاييس النظام | System metrics data storage

## المخرجات | Output

تقوم الأداة بإنشاء ملف سجل مع طابع زمني في مجلد المشروع. يحتوي هذا الملف على:

The tool creates a log file with a timestamp in the project folder. This file contains:

- قائمة بجميع المجلدات التي تم فحصها | A list of all directories checked
- حالة كل مجلد (موجود أو تم إنشاؤه) | The status of each directory (existing or created)
- ملخص لعدد المجلدات التي تم فحصها وإنشاؤها | A summary of the number of directories checked and created

## متى تستخدم هذه الأداة؟ | When to Use This Tool?

استخدم هذه الأداة في الحالات التالية:

Use this tool in the following cases:

- عند تثبيت المشروع لأول مرة | When installing the project for the first time
- عند مواجهة أخطاء `FileNotFoundError` | When encountering `FileNotFoundError` errors
- بعد تحديث المشروع | After updating the project
- قبل تشغيل التطبيق للتأكد من وجود جميع المجلدات المطلوبة | Before running the application to ensure all required directories exist

## التكامل مع سكربت التشغيل | Integration with Startup Script

يمكنك تشغيل أداة التشخيص قبل تشغيل التطبيق للتأكد من وجود جميع المجلدات المطلوبة:

You can run the diagnosis tool before starting the application to ensure all required directories exist:

```powershell
# تشغيل أداة التشخيص أولاً | Run the diagnosis tool first
.\diagnose.ps1

# ثم تشغيل التطبيق | Then start the application
.\start-mashaaer.ps1
```

أو يمكنك إضافة سطر إلى ملف `start.bat` لتشغيل أداة التشخيص تلقائيًا قبل تشغيل التطبيق:

Or you can add a line to the `start.bat` file to automatically run the diagnosis tool before starting the application:

```batch
@echo off
echo Running directory diagnosis...
powershell -ExecutionPolicy Bypass -File "%~dp0diagnose.ps1"
echo Starting Mashaaer Enhanced Project...
powershell -ExecutionPolicy Bypass -File "%~dp0start-mashaaer.ps1"
```