// ======= hide-prompts.js =======
// سكريبت مؤقت لإخفاء تبويب إدارة البرومبتات للزوار القادمين من فيسبوك

document.addEventListener("DOMContentLoaded", function() {

  // التحقق من مصدر الزيارة
  if(document.referrer.includes("facebook.com")) {

    // البحث عن التبويب عبر النص "إدارة البرومبتات"
    var tabs = document.querySelectorAll('[role="tab"]'); // جميع التبويبات
    tabs.forEach(function(tab) {
      if(tab.textContent.includes("إدارة البرومبتات")) {
        tab.style.display = "none"; // إخفاء التبويب
        console.log("تم إخفاء تبويب إدارة البرومبتات لمستخدم قادم من فيسبوك.");
      }
    });

  } else {
    console.log("تبويب الإدارة ظاهر للزائر. مصدر الزيارة: " + document.referrer);
  }

});