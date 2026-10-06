/**
 * وظيفة تفاعلية ذكية لتبديل لغة الموقع بالكامل
 * تقوم بقلب اتجاه الصفحة وتحديث مظهر العناصر لتناسب تجربة المستخدم
 */
function toggleLanguage() {
    const body = document.body;
    const btn = document.querySelector('.lang-switch');
    
    // التبديل الانسيابي بناءً على اتجاه الترميز الحالي
    if (body.getAttribute('dir') === 'rtl') {
        body.setAttribute('dir', 'ltr');
        body.setAttribute('lang', 'en');
    } else {
        body.setAttribute('dir', 'rtl');
        body.setAttribute('lang', 'ar');
    }
}
