export function generateMarkdownReport(result) {
  if (!result || !result.analysis) return "# ❗ تحليل غير متوفر";

  const { filename, analysis, summary } = result;
  const now = new Date().toISOString().split("T")[0];

  let md = `# 📊 تقرير تحليل الكود – ${filename || "ملف غير معروف"}

📅 التاريخ: ${now}
`;

  if (summary?.description) {
    md += `\n## 📝 وصف الملف\n${summary.description}\n`;
  }

  if (summary?.message) {
    md += `\n## 📣 رسالة التحليل\n> ${summary.message}\n`;
  }

  // أنواع التحليلات
  const analysisTypes = Object.keys(analysis)
    .filter(k => Array.isArray(analysis[k]) && analysis[k].length > 0);

  if (analysisTypes.length) {
    md += `\n## 🔍 أنواع التحليلات المنفذة\n`;
    analysisTypes.forEach(type => {
      md += `- ${type}\n`;
    });
  }

  // تعقيد الدوال
  if (analysis.complexity && analysis.complexity.length) {
    md += `\n## 🧠 تعقيد الدوال\n`;
    const sorted = analysis.complexity.sort((a, b) => b.complexity - a.complexity);
    sorted.forEach(func => {
      md += `- \`${func.name}()\` — التعقيد: ${func.complexity}\n`;
    });
  }

  // التكرار
  if (analysis.duplication?.length) {
    md += `\n## ♻️ دوال مكررة\n`;
    analysis.duplication.forEach(block => {
      md += `- 📌 مكرر ${block.count} مرات في الأسطر ${block.lines}\n`;
    });
  }

  // الأنماط السيئة
  if (analysis.codeSmells?.length) {
    md += `\n## 🚫 تنبيهات الأنماط السيئة\n`;
    analysis.codeSmells.forEach(smell => {
      md += `- ⚠️ ${smell.message} (السطر ${smell.line})\n`;
    });
  }

  // التبعيات
  if (analysis.dependencies?.length) {
    md += `\n## 🧩 خريطة التبعيات\n`;
    analysis.dependencies.forEach(dep => {
      md += `- 📦 ${dep}\n`;
    });
  }

  // الأداء (اختياري)
  if (summary?.performance) {
    md += `\n## ⚙️ تحليل الأداء\n`;
    Object.entries(summary.performance).forEach(([key, value]) => {
      md += `- ${key}: ${value}\n`;
    });
  }

  // الخلاصة
  md += `\n## ✅ الخلاصة\n`;
  md += `تم تنفيذ التحليل بنجاح بدون أخطاء حرجة. يمكن استخدام النتائج لتحسين جودة الكود وقراءة الفريق.`;

  return md;
}