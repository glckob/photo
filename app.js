/* app.js - Complete Logic including Google Login & Comments */

// --- 1. Translations ---
const translations = {
    appTitle: { km: "កម្មវិធី​កាត់​រូប", en: "Splitter App" },
    navSplitter: { km: "កម្មវិធី​កាត់​រូប", en: "Splitter App" },
    navPost: { km: "ផ្ទាំង​គ្រប់គ្រង (Post)", en: "Post Panel" },
    navLogin: { km: "ចូល (Admin)", en: "Admin Login" },
    navLogout: { km: "ចេញ (Logout)", en: "Logout" },
    mainTitle: { km: "កម្មវិធី​កាត់​រូបថត​សិស្ស", en: "Student Photo Splitter" },
    mainSubtitle: { km: "Upload រូបថត​សន្លឹក (ឧ. ទម្រង់​ពាក្យ​សុំ) ហើយ​កម្មវិធី​នឹង​ស្វែងរក និង​កាត់​រូបថត​សិស្ស​ម្នាក់ៗ​ចេញ​មក។", en: "Upload a photo sheet to automatically detect and crop student photos." },
    commentsTitle: { km: "មតិយោបល់ (User Command)", en: "User Commands / Comments" },
    loginGoogle: { km: "ចូល​តាម Google ដើម្បី​បញ្ចេញ​មតិ", en: "Login with Google to Comment" },
    uploadLabel: { km: "១. ជ្រើសរើស​រូបថត​សន្លឹក​របស់​អ្នក៖", en: "1. Select Photo Sheet:" },
    paddingYLabel: { km: "៣. កំណត់​គែម​កម្ពស់ (លើ/ក្រោម):", en: "3. Height Padding:" },
    paddingXLabel: { km: "៤. កំណត់​គែម​ទទឹង (ឆ្វេង/ស្ដាំ):", en: "4. Width Padding:" },
    filenameModeLabel: { km: "៥. កំណត់​របៀប​ตั้ง​ឈ្មោះ​ឯកសារ:", en: "5. Filename Mode:" },
    filenameModeAuto: { km: "ស្វ័យប្រវត្តិ", en: "Auto" },
    filenameModeManual: { km: "វាយ​បញ្ចូល​ដោយ​ដៃ", en: "Manual" },
    filenameModeNone: { km: "មិន​ដាក់​ឈ្មោះ", en: "No Name" },
    detectButton: { km: "៦. ស្វែងរក និង​កាត់​រូបថត", en: "6. Find & Crop" },
    detectButtonFinding: { km: "កំពុង​ស្វែងរក...", en: "Finding..." },
    originalPhotoTitle: { km: "រូបថត​ដើម", en: "Original" },
    adTitle: { km: "ពាណិជ្ជកម្ម", en: "Advertisement" },
    croppedPhotoTitle: { km: "រូបថត​ដែល​កាត់​បាន", en: "Results" },
    downloadAllButton: { km: "ទាញយក​ទាំងអស់ (ZIP)", en: "Download All (ZIP)" },
    visitorsTitle: { km: "អ្នក​ទស្សនា", en: "Visitors" },
    adsSidebarTitle: { km: "ពាណិជ្ជកម្ម", en: "Advertisement" },
    adminTitle: { km: "គ្រប់គ្រង​ផ្ទាំង​ពាណិជ្ជកម្ម", en: "Manage Ads" },
    adminAddTitle: { km: "បន្ថែម​ពាណិជ្ជកម្ម​ថ្មី", en: "Add New Ad" },
    imgUrlLabel: { km: "Image URL:", en: "Image URL:" },
    descLabel: { km: "Post Description:", en: "Description:" },
    submitPostButton: { km: "បញ្ជូន (Submit Post)", en: "Submit Post" },
    adminExistingTitle: { km: "ពាណិជ្ជកម្ម​បច្ចុប្បន្ន", en: "Current Ads" },
    loginTitle: { km: "ចូល​សម្រាប់ Admin", en: "Admin Login" },
    emailLabel: { km: "Email:", en: "Email:" },
    passwordLabel: { km: "Password:", en: "Password:" },
    loginSubmit: { km: "ចូល", en: "Login" },
    footerLine1: { km: "កម្មវិធីនេះប្រើប្រាស់ដោយមិនគិតថ្លៃ។", en: "Free to use." },
    footerLine2: { km: "បង្កើតឡើងដោយៈ លោកគ្រូ វង្ស សាណូវុទ្ធ", en: "Created by Mr. Vong Sanovuth" },
    footerContact: { km: "ទំនាក់ទំនង: 0972444424", en: "Contact: 0972444424" },
    
    // Dynamic JS
    statusLoading: { km: "កំពុង​ដំណើរការ AI Models...", en: "Loading AI Models..." },
    modelsLoaded: { km: "AI Models ដំណើរការ​រួចរាល់។", en: "AI Ready." },
    modelsError: { km: "Error: មិន​អាច​ដំណើរការ AI models។", en: "AI Error." },
    facesFound: { km: "រក​ឃើញ {count} មុខ។", en: "Found {count} faces." },
    facesNotFound: { km: "រក​មិន​ឃើញ​មុខ​ទេ។", en: "No faces found." },
    downloadButton: { km: "ទាញយក", en: "Download" },
    adjustButton: { km: "កែតម្រូវ", en: "Adjust" },
    zipPreparing: { km: "កំពុង​រៀបចំ ZIP...", en: "Zipping..." },
    adminEdit: { km: "កែប្រែ", en: "Edit" },
    adminDelete: { km: "លុប", en: "Delete" },
    editTitle: { km: "កែប្រែ​ពាណិជ្ជកម្ម", en: "Edit Ad" },
    editSaveButton: { km: "រក្សាទុក", en: "Save" }
};

let currentLanguage = localStorage.getItem('appLanguage') || 'km';

// --- 2. Supabase Setup ---
const SUPABASE_URL = 'https://iiysrygdcimunycfmhls.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpeXNyeWdkY2ltdW55Y2ZtaGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDIwODQsImV4cCI6MjA3ODc3ODA4NH0.NxQkzX7_5kHxOfaN_UwTWrvBLCQV2G21-OSyQdnuMIU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADS_TABLE = 'Post';
const COMMENTS_TABLE = 'Comments'; // Make sure this table exists in Supabase

// Mock Data (Fallback)
const mockAds = [
    { id: 1, post_img_url: 'https://placehold.co/300x200/3b82f6/white?text=Ad+1', post_description: 'Demo Ad 1' }
];

// --- 3. Global Variables ---
const MODEL_URL = 'https://raw.githack.com/justadudewhohacks/face-api.js/master/weights';
let croppedImageUrls = [];
let originalImage = null;
let originalDetections = [];
let totalDetections = 0; 
let currentUser = null; 
let allAdsData = []; 

// --- 4. Helper Functions ---

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('appLanguage', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (translations[key] && translations[key][lang]) {
            el.textContent = translations[key][lang];
        }
    });

    const langToggleCheckbox = document.getElementById('lang-toggle-checkbox');
    if (langToggleCheckbox) langToggleCheckbox.checked = (lang === 'en');
    
    // Update Dynamic Buttons
    const detectBtn = document.getElementById('detectButton');
    if (detectBtn && !detectBtn.disabled) detectBtn.textContent = translations.detectButton[lang];
}

function showView(viewId) {
    document.getElementById('splitter-view').classList.toggle('hidden', viewId !== 'splitter-view');
    document.getElementById('post-view').classList.toggle('hidden', viewId !== 'post-view');
    
    // Update Nav State
    const navSplitter = document.getElementById('nav-splitter-button');
    const navPost = document.getElementById('nav-post-button');
    
    if(viewId === 'splitter-view') {
        navSplitter.classList.add('text-blue-600', 'border-blue-600');
        navSplitter.classList.remove('text-gray-500');
        navPost.classList.remove('text-blue-600', 'border-blue-600');
        navPost.classList.add('text-gray-500');
    } else {
        navPost.classList.add('text-blue-600', 'border-blue-600');
        navPost.classList.remove('text-gray-500');
        navSplitter.classList.remove('text-blue-600', 'border-blue-600');
        navSplitter.classList.add('text-gray-500');
    }
}

function showModal(modalId, show = true) {
    document.getElementById(modalId).classList.toggle('hidden', !show);
}

function addWatermark(base64Image, text) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            if (text && text.trim() !== '') {
                const fontSize = Math.max(16, img.height * 0.05); 
                ctx.font = `bold ${fontSize}px 'Khmer Os Siemreap', Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = Math.max(2, fontSize * 0.1); 
                ctx.strokeText(text, canvas.width/2, canvas.height - (fontSize * 0.5));
                ctx.fillStyle = 'white';
                ctx.fillText(text, canvas.width/2, canvas.height - (fontSize * 0.5));
            }
            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.src = base64Image;
    });
}

// --- 5. Ads & Admin Logic ---

async function fetchAds() {
    if (!supabaseClient) {
        renderAds(mockAds); 
        return;
    }
    const { data, error } = await supabaseClient
        .from(ADS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (!error && data) {
        allAdsData = data;
        renderAds(data);
        renderAdminAdsList(data);
    } else {
        console.error('Ads Fetch Error:', error);
    }
}

function renderAds(ads) {
    const leftContent = document.getElementById('ad-banner-left-content');
    const rightContent = document.getElementById('ad-banner-right');
    const leftWrapper = document.getElementById('ad-banner-left');
    
    leftContent.innerHTML = '';
    rightContent.innerHTML = '';
    
    if (!ads || ads.length === 0) {
        leftWrapper.classList.add('hidden');
        return;
    }

    // Render Left Ad (First one)
    const adLeft = ads[0];
    const imgLeft = document.createElement('img');
    imgLeft.src = adLeft.post_img_url;
    imgLeft.className = "w-full h-auto object-cover cursor-pointer hover:opacity-90";
    imgLeft.onclick = () => openAdModal(adLeft);
    leftContent.appendChild(imgLeft);
    leftWrapper.classList.remove('hidden');

    // Render Right Ads (All)
    ads.forEach(ad => {
        const imgRight = document.createElement('img');
        imgRight.src = ad.post_img_url;
        imgRight.className = "w-full h-auto rounded-lg shadow-sm object-cover cursor-pointer hover:opacity-90";
        imgRight.onclick = () => openAdModal(ad);
        rightContent.appendChild(imgRight);
    });
}

function openAdModal(ad) {
    document.getElementById('ad-modal-image').src = ad.post_img_url;
    document.getElementById('ad-modal-description').textContent = ad.post_description || '';
    showModal('ad-content-modal', true);
}

function renderAdminAdsList(ads) {
    const list = document.getElementById('admin-ads-list');
    list.innerHTML = '';
    
    if (ads.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center">No Ads.</p>';
        return;
    }

    ads.forEach(ad => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 bg-gray-50 rounded border';
        item.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <img src="${ad.post_img_url}" class="w-12 h-12 object-cover rounded">
                <span class="text-sm truncate">${ad.post_description}</span>
            </div>
            <div class="flex gap-2 shrink-0">
                <button class="bg-yellow-500 text-white text-xs px-2 py-1 rounded edit-btn">Edit</button>
                <button class="bg-red-500 text-white text-xs px-2 py-1 rounded delete-btn">Del</button>
            </div>
        `;
        
        item.querySelector('.edit-btn').onclick = () => openEditModal(ad);
        item.querySelector('.delete-btn').onclick = () => deletePost(ad.id);
        list.appendChild(item);
    });
}

function openEditModal(ad) {
    document.getElementById('edit-post-id').value = ad.id;
    document.getElementById('edit-ad-img-url').value = ad.post_img_url;
    document.getElementById('edit-ad-description').value = ad.post_description;
    showModal('edit-post-modal', true);
}

async function handlePostSubmit(e) {
    e.preventDefault();
    const url = document.getElementById('ad-img-url').value;
    const desc = document.getElementById('ad-description').value;
    
    const { error } = await supabaseClient.from(ADS_TABLE).insert([{ post_img_url: url, post_description: desc }]);
    if (!error) {
        alert(translations.postSuccess[currentLanguage]);
        e.target.reset();
        fetchAds();
    } else {
        alert(error.message);
    }
}

async function handleUpdatePost(e) {
    e.preventDefault();
    const id = document.getElementById('edit-post-id').value;
    const url = document.getElementById('edit-ad-img-url').value;
    const desc = document.getElementById('edit-ad-description').value;

    const { error } = await supabaseClient.from(ADS_TABLE).update({ post_img_url: url, post_description: desc }).eq('id', id);
    if (!error) {
        alert(translations.editSuccess[currentLanguage]);
        showModal('edit-post-modal', false);
        fetchAds();
    } else {
        alert(error.message);
    }
}

async function deletePost(id) {
    if (confirm(translations.deleteConfirm[currentLanguage])) {
        const { error } = await supabaseClient.from(ADS_TABLE).delete().eq('id', id);
        if (!error) fetchAds();
    }
}

// --- 6. Comment System (User Command) ---

async function fetchComments() {
    const { data, error } = await supabaseClient
        .from(COMMENTS_TABLE)
        .select('*')
        .order('created_at', { ascending: true }); // Oldest top, Newest bottom (Chat style)
    
    if (data) renderComments(data);
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    list.innerHTML = '';
    
    if (comments.length === 0) {
        list.innerHTML = '<div class="text-center text-gray-400 text-sm mt-4">No comments yet.</div>';
        return;
    }

    comments.forEach(c => {
        const bubble = document.createElement('div');
        bubble.className = 'comment-bubble';
        
        const time = new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const avatarUrl = c.user_avatar_url || 'https://www.svgrepo.com/show/496632/user-circle.svg'; // Default avatar

        bubble.innerHTML = `
            <div class="comment-header">
                <img src="${avatarUrl}" class="comment-avatar">
                <span class="comment-name">${c.user_name || 'User'}</span>
                <span class="comment-time">${time}</span>
            </div>
            <div class="comment-text">${c.content}</div>
        `;
        list.appendChild(bubble);
    });
    
    // Auto scroll to bottom
    list.scrollTop = list.scrollHeight;
}

async function sendComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text || !currentUser) return;

    // Insert into Supabase
    const { error } = await supabaseClient.from(COMMENTS_TABLE).insert([{
        content: text,
        user_id: currentUser.id,
        user_name: currentUser.user_metadata?.full_name || currentUser.email,
        user_avatar_url: currentUser.user_metadata?.avatar_url
    }]);

    if (!error) input.value = '';
}

// --- 7. Auth Logic (Admin & Google) ---

function updateAuthUI() {
    const loginBtn = document.getElementById('nav-login-button');
    const logoutBtn = document.getElementById('nav-logout-button');
    const postNav = document.getElementById('nav-post-button');
    
    const commentAuthSection = document.getElementById('comment-auth-section'); // Button Google
    const commentInputSection = document.getElementById('comment-input-section'); // Input Field
    
    if (currentUser) {
        // Global Login State
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        // Comments: Show Input, Hide Login Button
        commentAuthSection.classList.add('hidden');
        commentInputSection.classList.remove('hidden');
        
        // Set User Info for Comments
        const avatar = document.getElementById('user-avatar');
        const name = document.getElementById('user-name');
        avatar.src = currentUser.user_metadata?.avatar_url || 'https://www.svgrepo.com/show/496632/user-circle.svg';
        name.textContent = currentUser.user_metadata?.full_name || currentUser.email;

        // Admin specific check (For now, simply enable Post tab if logged in via Email)
        // In real app, check user ID or role.
        if (currentUser.app_metadata?.provider === 'email') {
            postNav.classList.remove('hidden');
        } else {
            // Google User -> Hide Admin Panel
            postNav.classList.add('hidden');
            showView('splitter-view'); // Force back to main view
        }

    } else {
        // Logged Out
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        postNav.classList.add('hidden');
        showView('splitter-view');
        
        // Comments: Show Login Button
        commentAuthSection.classList.remove('hidden');
        commentInputSection.classList.add('hidden');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        document.getElementById('login-error-message').textContent = translations.loginError[currentLanguage];
    } else {
        showModal('login-modal', false);
    }
}

async function handleGoogleLogin() {
    await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.href
        }
    });
}

// --- 8. Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // -- Init UI --
    setLanguage(currentLanguage);
    
    // -- AI Load --
    loadFaceAPI();

    // -- Supabase Auth Listener --
    supabaseClient.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateAuthUI();
        if (currentUser) {
            fetchAds(); // Refresh private data if needed
        }
    });

    // -- Initial Data Fetch --
    fetchAds();
    fetchComments();

    // -- Realtime Comments Subscription --
    supabaseClient
        .channel('public:Comments')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Comments' }, payload => {
            // Simple approach: re-fetch all (or append payload.new)
            fetchComments(); 
        })
        .subscribe();

    // -- Event Listeners --
    
    // Language Toggle
    document.getElementById('lang-toggle-checkbox').addEventListener('change', (e) => {
        setLanguage(e.target.checked ? 'en' : 'km');
    });

    // Navbar
    document.getElementById('nav-splitter-button').onclick = () => showView('splitter-view');
    document.getElementById('nav-post-button').onclick = () => showView('post-view');
    document.getElementById('nav-login-button').onclick = () => showModal('login-modal', true);
    document.getElementById('nav-logout-button').onclick = () => supabaseClient.auth.signOut();

    // Modals
    document.getElementById('login-modal-close').onclick = () => showModal('login-modal', false);
    document.getElementById('ad-modal-close').onclick = () => closeAdModal();
    document.getElementById('edit-post-modal-close').onclick = () => showModal('edit-post-modal', false);

    // Forms
    document.getElementById('login-form').onsubmit = handleAdminLogin;
    document.getElementById('post-form').onsubmit = handlePostSubmit;
    document.getElementById('edit-post-form').onsubmit = handleUpdatePost;

    // Comments
    document.getElementById('btn-google-login').onclick = handleGoogleLogin;
    document.getElementById('btn-send-comment').onclick = sendComment;
    document.getElementById('comment-input').onkeypress = (e) => {
        if (e.key === 'Enter') sendComment();
    };

    // Splitter App Logic (Detect, Crop, etc.)
    setupSplitterLogic();
});

// --- 9. Splitter Logic (Face API) ---
// Separated to keep main init clean

async function loadFaceAPI() {
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        document.getElementById('status-text').textContent = translations.modelsLoaded[currentLanguage];
        document.getElementById('status').classList.replace('bg-blue-500', 'bg-green-600');
        document.getElementById('status-spinner').style.display = 'none';
        document.getElementById('upload-section').classList.remove('opacity-50', 'pointer-events-none');
        document.getElementById('settings-section').classList.remove('opacity-50', 'pointer-events-none');
        document.getElementById('filename-mode-section').classList.remove('opacity-50', 'pointer-events-none');
    } catch (err) {
        console.error(err);
        document.getElementById('status-text').textContent = translations.modelsError[currentLanguage];
        document.getElementById('status').classList.replace('bg-blue-500', 'bg-red-600');
    }
}

function setupSplitterLogic() {
    const imageUpload = document.getElementById('imageUpload');
    const detectBtn = document.getElementById('detectButton');
    const downloadAllBtn = document.getElementById('downloadAllButton');
    const previewImg = document.getElementById('imagePreview');
    const resultsContainer = document.getElementById('results-container');
    const resultsDiv = document.getElementById('results');
    
    // Sliders
    const padY = document.getElementById('paddingSliderY');
    const padX = document.getElementById('paddingSliderX');
    
    // File Upload
    imageUpload.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        originalImage = new Image();
        originalImage.src = URL.createObjectURL(file);
        originalImage.onload = () => {
            previewImg.src = originalImage.src;
            document.getElementById('preview-container').classList.remove('hidden');
            detectBtn.disabled = false;
            detectBtn.textContent = translations.detectButton[currentLanguage];
            resultsDiv.innerHTML = '';
            resultsContainer.classList.add('hidden');
        };
    };

    // Detect
    detectBtn.onclick = async () => {
        if(!originalImage) return;
        detectBtn.disabled = true;
        detectBtn.textContent = translations.detectButtonFinding[currentLanguage];
        resultsDiv.innerHTML = '';
        
        originalDetections = await faceapi.detectAllFaces(originalImage);
        totalDetections = originalDetections.length;
        
        if (totalDetections > 0) {
            resultsContainer.classList.remove('hidden');
            document.getElementById('results-count').textContent = translations.facesFound[currentLanguage].replace('{count}', totalDetections);
            downloadAllBtn.classList.remove('hidden');

            // Render each face
            const globalPadY = parseInt(padY.value);
            const globalPadX = parseInt(padX.value);
            
            originalDetections.forEach((det, i) => {
                createFaceCard(det.box, i, globalPadY, globalPadX);
            });

        } else {
            resultsContainer.classList.remove('hidden');
            document.getElementById('results-count').textContent = translations.facesNotFound[currentLanguage];
        }
        detectBtn.disabled = false;
        detectBtn.textContent = translations.detectButton[currentLanguage];
    };

    // Download All
    downloadAllBtn.onclick = async () => {
        if(croppedImageUrls.length === 0) return;
        downloadAllBtn.textContent = translations.zipPreparing[currentLanguage];
        downloadAllBtn.disabled = true;
        
        const zip = new JSZip();
        croppedImageUrls.forEach(imgData => {
            if(imgData) {
                const b64 = imgData.watermarkedUrl.split(',')[1];
                zip.file(`${imgData.filename}.jpg`, b64, {base64: true});
            }
        });
        
        const content = await zip.generateAsync({type:"blob"});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'student_photos.zip';
        link.click();
        
        downloadAllBtn.disabled = false;
        downloadAllBtn.textContent = translations.downloadAllButton[currentLanguage];
    };
}

// Create Individual Face Card UI
async function createFaceCard(box, index, padYPercent, padXPercent) {
    const croppedUrl = await cropFace(box, padYPercent, padXPercent, 0, 0);
    if(!croppedUrl) return;

    const mode = document.querySelector('input[name="filenameMode"]:checked').value;
    const defaultName = `student_${index + 1}`;
    let watermarkText = defaultName;
    if(mode === 'none') watermarkText = "";

    const finalUrl = await addWatermark(croppedUrl, watermarkText);
    
    // Store data
    croppedImageUrls[index] = {
        originalUrl: croppedUrl, // clean crop
        watermarkedUrl: finalUrl,
        filename: defaultName,
        box: box
    };

    const card = document.createElement('div');
    card.className = "border rounded p-3 relative bg-gray-50";
    
    // UI Elements construction (Abbreviated for length, logic matches previous)
    // Image
    const img = document.createElement('img');
    img.src = finalUrl;
    img.className = "w-full rounded shadow mb-2";
    
    // Controls Container
    const controls = document.createElement('div');
    controls.className = "space-y-2";

    // Buttons
    const btnRow = document.createElement('div');
    btnRow.className = "grid grid-cols-2 gap-2";
    
    const dlBtn = document.createElement('a');
    dlBtn.href = finalUrl;
    dlBtn.download = `${defaultName}.jpg`;
    dlBtn.className = "bg-blue-500 text-white text-center text-xs py-1 rounded";
    dlBtn.textContent = translations.downloadButton[currentLanguage];
    
    const adjBtn = document.createElement('button');
    adjBtn.className = "bg-yellow-500 text-white text-xs py-1 rounded";
    adjBtn.textContent = translations.adjustButton[currentLanguage];
    
    btnRow.append(dlBtn, adjBtn);
    
    // Filename Input
    const nameInput = document.createElement('input');
    nameInput.type = "text";
    nameInput.value = defaultName;
    nameInput.className = `w-full border px-2 py-1 text-xs rounded ${mode !== 'manual' ? 'hidden' : ''}`;
    
    // Sliders (Pad Y, X, Move Y, X) - Simplified generation
    const createSlider = (label, val, min, max) => {
        const div = document.createElement('div');
        div.className = "text-xs";
        div.innerHTML = `<span>${label}</span> <span class="text-blue-600 font-bold">${val}%</span>`;
        const range = document.createElement('input');
        range.type = "range"; range.min = min; range.max = max; range.value = val;
        range.className = "w-full h-1 bg-gray-300 rounded cursor-pointer";
        range.oninput = (e) => div.querySelector('span:last-child').textContent = e.target.value + '%';
        return { div, range };
    };

    const sPadY = createSlider(translations.padYLabel[currentLanguage], padYPercent, 0, 100);
    const sPadX = createSlider(translations.padXLabel[currentLanguage], padXPercent, 0, 100);
    const sMovY = createSlider(translations.moveYLabel[currentLanguage], 0, -100, 100);
    const sMovX = createSlider(translations.moveXLabel[currentLanguage], 0, -100, 100);

    // Adjust Logic
    adjBtn.onclick = async () => {
        const pY = parseInt(sPadY.range.value);
        const pX = parseInt(sPadX.range.value);
        const mY = parseInt(sMovY.range.value);
        const mX = parseInt(sMovX.range.value);
        
        const newCrop = await cropFace(box, pY, pX, mY, mX);
        const curMode = document.querySelector('input[name="filenameMode"]:checked').value;
        const curName = nameInput.value;
        let wmText = curName;
        if(curMode === 'none') wmText = "";

        const newFinal = await addWatermark(newCrop, wmText);
        
        img.src = newFinal;
        dlBtn.href = newFinal;
        dlBtn.download = `${curName}.jpg`;
        
        croppedImageUrls[index] = {
            originalUrl: newCrop,
            watermarkedUrl: newFinal,
            filename: curName,
            box: box
        };
    };

    // Live Text Update
    nameInput.oninput = async (e) => {
        const val = e.target.value;
        // Re-apply watermark to clean crop
        const clean = croppedImageUrls[index].originalUrl;
        const newWm = await addWatermark(clean, val);
        img.src = newWm;
        dlBtn.href = newWm;
        dlBtn.download = `${val}.jpg`;
        croppedImageUrls[index].watermarkedUrl = newWm;
        croppedImageUrls[index].filename = val;
    };

    // Delete
    const delBtn = document.createElement('button');
    delBtn.innerHTML = "&times;";
    delBtn.className = "absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600";
    delBtn.onclick = () => {
        card.remove();
        delete croppedImageUrls[index]; // remove from data
        // update count logic if needed
    };

    controls.append(btnRow, nameInput, sPadY.div, sPadY.range, sPadX.div, sPadX.range, sMovY.div, sMovY.range, sMovX.div, sMovX.range);
    card.append(img, delBtn, controls);
    document.getElementById('results').appendChild(card);
}

// Crop Helper (Reused)
function cropFace(box, pY, pX, mY, mX) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const padY = box.height * (pY/100);
        const padX = box.width * (pX/100);
        const offY = box.height * (mY/100);
        const offX = box.width * (mX/100);
        
        const x = Math.max(0, box.x - padX + offX);
        const y = Math.max(0, box.y - padY + offY);
        const w = box.width + (padX*2);
        const h = box.height + (padY*2);
        
        canvas.width = w;
        canvas.height = h;
        
        ctx.drawImage(originalImage, x, y, w, h, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg'));
    });
}