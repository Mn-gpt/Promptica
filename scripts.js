// تفعيل/إلغاء الأقسام
function setupToggleSections() {
    const categories = ['human', 'animal', 'nature', 'machine'];
    
    categories.forEach(category => {
        const toggle = document.getElementById(`toggle-${category}`);
        const content = document.querySelector(`#${category}-category .category-content`);
        
        // التهيئة الأولية
        content.style.display = toggle.checked ? 'block' : 'none';
        
        // تغيير الحالة عند النقر
        toggle.addEventListener('change', () => {
            content.style.display = toggle.checked ? 'block' : 'none';
        });
    });
}

function generatePrompt() {
    const sections = {
        human: {
            enabled: document.getElementById("toggle-human").checked,
            base: `بشري (${getValue("human-gender")}, ${getValue("human-age")}, ${getValue("human-expression")})`,
            attributes: attributes.human
        },
        animal: {
            enabled: document.getElementById("toggle-animal").checked,
            base: `حيوان ${getValue("animal-type")} ${getValue("animal-action")}`,
            attributes: attributes.animal
        },
        nature: {
            enabled: document.getElementById("toggle-nature").checked,
            base: `في ${getValue("nature-type")} أثناء ${getValue("nature-weather")}`,
            attributes: attributes.nature
        },
        machine: {
            enabled: document.getElementById("toggle-machine").checked,
            base: `آلة ${getValue("machine-type")} ${getValue("machine-style")}`,
            attributes: attributes.machine
        }
    };

    const activeSections = Object.entries(sections)
        .filter(([_, section]) => section.enabled)
        .map(([_, section]) => {
            return section.attributes.length > 0 
                ? `${section.base}، ${section.attributes.join("، ")}`
                : section.base;
        });

    const finalPrompt = activeSections.length > 0
        ? `أريد صورة ${formatArabicList(activeSections)}. النمط الفني: ${getValue("art-style") || "واقعي عالي الدقة"}.`
        : "الرجاء تفعيل قسم واحد على الأقل!";

    document.getElementById("generated-prompt").value = finalPrompt;
}

// دالة مساعدة للجمع بالعربية
function formatArabicList(items) {
    if (items.length === 1) return items[0];
    const last = items.pop();
    return `${items.join("، ")} و${last}`;
}

// دالة مساعدة مختصرة
function getValue(id) {
    return document.getElementById(id).value;
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    setupToggleSections();
    // ... باقي الدوال
});
// بيانات العينات (يمكن استبدالها بقاعدة بيانات حقيقية)
let humanPrompts = {
    male: {
        styles: [
            { title: "واقعي", desc: "تفاصيل فوتوغرافية دقيقة", code: "--v 5 --style realistic" },
            { title: "أنمي", desc: "أسلوب رسوم يابانية", code: "--niji 5" }
        ],
        presets: [
            { title: "رجل أعمال", desc: "رجل أنيق ببدلة رمادية، إضاءة استوديو، خلفية ضبابية" },
            { title: "محارب", desc: "محارب قديم بدرع متقن، إضاءة دراماتيكية، خلفية معركة" }
        ]
    },
    female: {
        styles: [
            { title: "فن تشكيلي", desc: "ألوان زيتية وفرشاة واضحة", code: "--style 4b" }
        ],
        presets: [
            { title: "سيدة أعمال", desc: "سيدة ببدلة رسمية، إضاءة ذهبية، خلفية مدينة" }
        ]
    }
};

// عرض البيانات عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    loadGenderData('male');
});

// التبديل بين الرجل والمرأة
function showGender(gender) {
    document.querySelectorAll('.gender-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    document.querySelectorAll('.gender-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(`${gender}-section`).style.display = 'block';
    
    loadGenderData(gender);
}

// تحميل بيانات الجنس المحدد
function loadGenderData(gender) {
    loadStyles(gender);
    loadPresets(gender);
}

// تحميل الأنماط
function loadStyles(gender) {
    const container = document.getElementById(`${gender}-styles`);
    container.innerHTML = humanPrompts[gender].styles.map(style => `
        <div class="prompt-card">
            <h3>${style.title}</h3>
            <p>${style.desc}</p>
            <small><code>${style.code || ''}</code></small>
            <button class="btn btn-sm" onclick="applyToMain('${gender}', 'style', ${JSON.stringify(style).replace(/"/g, '&quot;')})">
                تطبيق
            </button>
        </div>
    `).join('');
}

// تحميل الأوصاف الجاهزة
function loadPresets(gender) {
    const container = document.getElementById(`${gender}-presets`);
    container.innerHTML = humanPrompts[gender].presets.map(preset => `
        <div class="prompt-card">
            <h3>${preset.title}</h3>
            <p>${preset.desc}</p>
            <button class="btn btn-sm" onclick="applyToMain('${gender}', 'preset', ${JSON.stringify(preset).replace(/"/g, '&quot;')})">
                تطبيق
            </button>
        </div>
    `).join('');
}

// تطبيق على الواجهة الرئيسية
function applyToMain(gender, type, data) {
    localStorage.setItem('selectedHumanPrompt', JSON.stringify({
        gender,
        type,
        data
    }));
    
    // نقل المستخدم للواجهة الرئيسية
    window.location.href = 'My-prompt.html';
}

// فتح/إغلاق نموذج الإضافة
// تحميل البيانات المختارة من الصفحة الفرعية
function loadSelectedPrompt() {
    const savedPrompt = localStorage.getItem('selectedHumanPrompt');
    if (savedPrompt) {
        const { gender, type, data } = JSON.parse(savedPrompt);
        
        if (type === 'style') {
            document.getElementById('art-style').value = data.title;
        } else {
            // تطبيق الوصف الجاهز على الحقول
            document.getElementById('human-desc').value = data.desc;
        }
        
        localStorage.removeItem('selectedHumanPrompt');
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadSelectedPrompt);
function openAddForm() {
    document.getElementById('add-form').style.display = 'flex';
}

function closeAddForm() {
    document.getElementById('add-form').style.display = 'none';
}

// حفظ العنصر الجديد
function saveNewItem() {
    const type = document.getElementById('add-type').value;
    const gender = document.getElementById('add-gender').value;
    const title = document.getElementById('add-title').value;
    const desc = document.getElementById('add-desc').value;
    
    const newItem = { title, desc };
    if (type === 'style') newItem.code = desc;
    
    humanPrompts[gender][type === 'style' ? 'styles' : 'presets'].push(newItem);
    localStorage.setItem('humanPrompts', JSON.stringify(humanPrompts));
    
    loadGenderData(gender);
    closeAddForm();
}