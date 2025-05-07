# إصلاح مشكلة إعدادات Webpack | Webpack Configuration Fix

## المشكلة | The Problem

كانت الواجهة الأمامية تفشل في الإقلاع بسبب خطأ في إعدادات Webpack. المشكلة الرئيسية هي أن Webpack 5 لا يقبل خاصية `fallback` ضمن `configuration.resolve` عند استخدام `react-app-rewired`.

The frontend was failing to start due to an error in the Webpack configuration. The main issue is that Webpack 5 doesn't accept the `fallback` property within `configuration.resolve` when using `react-app-rewired`.

## التغييرات التي تم إجراؤها | Changes Made

### 1. تحديث ملف config-overrides.js | Update config-overrides.js

تم تعديل ملف `config-overrides.js` لإزالة استخدام `resolve.fallback` واستبداله بالإعدادات الصحيحة:

The `config-overrides.js` file was modified to remove the use of `resolve.fallback` and replace it with the correct settings:

```javascript
// قبل التعديل | Before:
config.resolve.fallback = {
  ...config.resolve.fallback,
  path: require.resolve('path-browserify'),
  os: require.resolve('os-browserify/browser'),
  // ... other fallbacks
};

// بعد التعديل | After:
config.resolve = {
  ...config.resolve,
  alias: {
    ...config.resolve.alias,
    process: 'process/browser',
    path: 'path-browserify',
    os: 'os-browserify/browser',
    // ... other aliases
  },
  extensions: ['.js', '.jsx', '.json'],
};
```

### 2. تحديث طريقة إضافة Plugins | Update Plugin Addition Method

تم تحديث طريقة إضافة Plugins لاستخدام الطريقة الموصى بها:

The method for adding plugins was updated to use the recommended approach:

```javascript
// قبل التعديل | Before:
config.plugins = config.plugins.concat([
  new webpack.ProvidePlugin({
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer']
  }),
  // ... other plugins
]);

// بعد التعديل | After:
config.plugins = [
  ...(config.plugins || []),
  new webpack.ProvidePlugin({
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer'],
  }),
  // ... other plugins
];
```

## كيفية اختبار الإصلاح | How to Test the Fix

يمكنك اختبار الإصلاح باستخدام الأمر التالي:

You can test the fix using the following command:

```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm start
```

أو باستخدام السكريبت المرفق:

Or by using the included script:

```powershell
.\test-webpack-fix.ps1
```

## ملاحظات إضافية | Additional Notes

- تم الاحتفاظ بإعداد `NODE_OPTIONS=--openssl-legacy-provider` في سكريبت npm لضمان التوافق مع Node.js الحديث
  The `NODE_OPTIONS=--openssl-legacy-provider` setting was kept in the npm script to ensure compatibility with modern Node.js

- يستخدم المشروع إصدارًا قديمًا من react-scripts (4.0.3) مع React 18.2.0، مما قد يسبب مشاكل توافق
  The project uses an older version of react-scripts (4.0.3) with React 18.2.0, which might cause compatibility issues

- يستخدم المشروع webpack 4.29.6، وهو إصدار قديم
  The project uses webpack 4.29.6, which is an older version

## الخطوات التالية الموصى بها | Recommended Next Steps

للحصول على تجربة تطوير أفضل، نوصي بالتحديث إلى إصدارات أحدث من المكتبات:

For a better development experience, we recommend upgrading to newer versions of the libraries:

1. تحديث react-scripts إلى الإصدار 5.x
   Upgrade react-scripts to version 5.x

2. تحديث webpack إلى الإصدار 5.x
   Upgrade webpack to version 5.x

3. إزالة علم `--openssl-legacy-provider` بعد التحديث
   Remove the `--openssl-legacy-provider` flag after upgrading