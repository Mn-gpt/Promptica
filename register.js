document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    
    // تحميل بيانات المستخدمين من localStorage إذا كانت موجودة
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // دالة لحفظ نسخة احتياطية من البيانات
    function backupUsersData() {
        localStorage.setItem('users_backup', JSON.stringify(users));
        console.log('تم إنشاء نسخة احتياطية من بيانات المستخدمين');
    }
    
    // دالة لاستعادة البيانات من النسخة الاحتياطية
    function restoreUsersData() {
        const backup = localStorage.getItem('users_backup');
        if (backup) {
            users = JSON.parse(backup);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('تم استعادة بيانات المستخدمين من النسخة الاحتياطية');
            return true;
        }
        return false;
    }
    
    // تسجيل مستخدم جديد
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
        const emailExists = users.some(user => user.email === email);
        
        if (emailExists) {
            showMessage('هذا البريد الإلكتروني مسجل بالفعل!', 'error');
            return;
        }
        
        // إنشاء مستخدم جديد
        const newUser = {
            id: Date.now(), // استخدام الطوابع الزمنية كمعرف فريد
            username: username,
            email: email,
            registeredAt: new Date().toISOString()
        };
        
        // إضافة المستخدم إلى المصفوفة
        users.push(newUser);
        
        // حفظ البيانات في localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // إنشاء نسخة احتياطية
        backupUsersData();
        
        // عرض رسالة النجاح
        showMessage('تم تسجيلك بنجاح!', 'success');
        
        // تفريغ الحقول
        registerForm.reset();
        
        // عرض بيانات المستخدمين في الكونسول (لأغراض الاختبار)
        console.log('المستخدمون المسجلون:', users);
    });
    
    // دالة لعرض الرسائل
    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = 'message ' + type;
        
        // إخفاء الرسالة بعد 3 ثواني
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
    
    // اختبار استعادة البيانات عند الضرورة
    if (users.length === 0) {
        console.log('محاولة استعادة البيانات من النسخة الاحتياطية...');
        restoreUsersData();
    }
    
    // يمكنك استدعاء هذه الدالة يدوياً عند الحاجة لاستعادة البيانات
    window.restoreBackup = function() {
        if (restoreUsersData()) {
            showMessage('تم استعادة البيانات بنجاح من النسخة الاحتياطية', 'success');
        } else {
            showMessage('لا توجد نسخة احتياطية للاستعادة', 'error');
        }
    };
});