/*
  app.js
  នេះ​ជា​ JavaScript Logic ទាំង​អស់​របស់​អ្នក 
  ដែល​បាន​ដក​ចេញ​ពី​ឯកសារ HTML 
*/
// --- Supabase Configuration ---
const SUPABASE_URL = 'https://iiysrygdcimunycfmhls.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpeXNyeWdkY2ltdW55Y2ZtaGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDIwODQsImV4cCI6MjA3ODc3ODA4NH0.NxQkzX7_5kHxOfaN_UwTWrvBLCQV2G21-OSyQdnuMIU';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADS_TABLE = 'Post';

const mockAds = [
    { id: 1, post_img_url: 'https://placehold.co/300x250/3b82f6/white?text=Ad+Banner+1', post_description: 'Mock Ad 1' },
    { id: 2, post_img_url: 'https://placehold.co/300x250/10b981/white?text=Sponsor+2', post_description: 'Mock Ad 2' }
];

// --- Configuration ---
const MODEL_URL = 'https://raw.githack.com/justadudewhohacks/face-api.js/master/weights';
let croppedImageUrls = [];
let originalImage = null;
let originalDetections = [];
let totalDetections = 0; 
let currentUser = null; 
let allAdsData = []; // រក្សាទុក Ads data

// --- អនុគមន៍​ទាញ​យក និង​បង្ហាញ​ពាណិជ្ជកម្ម (សម្រាប់ Visitor) ---
function displayAds(ads) {
    const adContainerRight = document.getElementById('ad-banner-right');
    const adContainerLeftContent = document.getElementById('ad-banner-left-content');
    const adBannerLeftWrapper = document.getElementById('ad-banner-left');
    
    adContainerRight.innerHTML = '';
    adContainerLeftContent.innerHTML = '';
    
    if (!ads || ads.length === 0) {
        adBannerLeftWrapper.classList.add('hidden');
        return;
    }
    
    // បង្ហាញ​ផ្ទាំង​ខាង​ឆ្វេង
    const adLeft = ads[0];
    const adLeftImg = document.createElement('img');
    adLeftImg.src = adLeft.post_img_url;
    adLeftImg.alt = "Commercial Ad";
    adLeftImg.className = "w-full h-auto object-cover cursor-pointer hover:opacity-80 transition-opacity";
    adLeftImg.addEventListener('click', () => showAdModal(adLeft)); 
    adContainerLeftContent.appendChild(adLeftImg);
    adBannerLeftWrapper.classList.remove('hidden');

    // បង្ហាញ​ផ្ទាំង​ខាង​ស្ដាំ
    ads.forEach(ad => {
        const adRightImg = document.createElement('img');
        adRightImg.src = ad.post_img_url;
        adRightImg.alt = "Commercial Ad";
        adRightImg.className = "w-full h-auto rounded-lg shadow-sm object-cover cursor-pointer hover:opacity-80 transition-opacity";
        adRightImg.addEventListener('click', () => showAdModal(ad)); 
        adContainerRight.appendChild(adRightImg);
    });
}

async function fetchAdsFromSupabase() {
    if (!supabaseClient || SUPABASE_URL === 'https://your-project-id.supabase.co') {
        console.warn("Supabase not configured. Using mock ads.");
        allAdsData = mockAds; // រក្សាទុក
        displayAds(allAdsData);
        loadAdminPostData(allAdsData); 
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from(ADS_TABLE)
            .select('id, post_img_url, post_description')
            .order('created_at', { ascending: false }); 
        
        if (error) throw error;
        allAdsData = data; // រក្សាទុក
        displayAds(allAdsData); 
        loadAdminPostData(allAdsData); 
        
    } catch (error) {
        console.error('Error fetching ads from Supabase:', error.message);
        allAdsData = mockAds; // ប្រើ Mock data ពេល Error
        displayAds(allAdsData); 
        loadAdminPostData(allAdsData);
    }
}

// --- អនុគមន៍​ថ្មី​សម្រាប់​ផ្ទាំង Admin ---

function showView(viewId) {
    const splitterView = document.getElementById('splitter-view');
    const postView = document.getElementById('post-view');
    const navSplitterButton = document.getElementById('nav-splitter-button');
    const navPostButton = document.getElementById('nav-post-button');

    splitterView.classList.toggle('hidden', viewId !== 'splitter-view');
    postView.classList.toggle('hidden', viewId !== 'post-view');
    
    navSplitterButton.classList.toggle('border-blue-600', viewId === 'splitter-view');
    navSplitterButton.classList.toggle('text-blue-600', viewId === 'splitter-view');
    navSplitterButton.classList.toggle('text-gray-500', viewId !== 'splitter-view');
    
    navPostButton.classList.toggle('border-blue-600', viewId === 'post-view');
    navPostButton.classList.toggle('text-blue-600', viewId === 'post-view');
    navPostButton.classList.toggle('text-gray-500', viewId !== 'post-view');
}

function showLoginModal(show) {
    const modal = document.getElementById('login-modal');
    modal.classList.toggle('hidden', !show);
    if (show) {
        document.getElementById('login-error-message').textContent = '';
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    }
}

function showAdModal(ad) {
    const modal = document.getElementById('ad-content-modal');
    const modalImage = document.getElementById('ad-modal-image');
    const modalDescription = document.getElementById('ad-modal-description');
    
    modalImage.src = ad.post_img_url;
    modalDescription.textContent = ad.post_description || ''; 
    
    modal.classList.remove('hidden');
}

function closeAdModal() {
    const modal = document.getElementById('ad-content-modal');
    modal.classList.add('hidden');
}

function handleShowEditModal(show, ad = null) {
    const modal = document.getElementById('edit-post-modal');
    modal.classList.toggle('hidden', !show);
    
    if (show && ad) {
        document.getElementById('edit-post-id').value = ad.id;
        document.getElementById('edit-ad-img-url').value = ad.post_img_url;
        document.getElementById('edit-ad-description').value = ad.post_description;
        document.getElementById('edit-post-form-message').textContent = '';
        document.getElementById('edit-post-submit-button').disabled = false;
        document.getElementById('edit-post-submit-button').textContent = 'រក្សាទុក​ការ​ផ្លាស់ប្ដូរ';
    }
}

async function handleUpdatePost(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Session ផុត​កំណត់​។ សូម Login ម្ដង​ទៀត។');
        return;
    }
    
    const id = document.getElementById('edit-post-id').value;
    const imgUrl = document.getElementById('edit-ad-img-url').value;
    const description = document.getElementById('edit-ad-description').value;
    const message = document.getElementById('edit-post-form-message');
    const submitButton = document.getElementById('edit-post-submit-button');

    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'កំពុង​រក្សាទុក...';
    
    try {
        const { error } = await supabaseClient
            .from(ADS_TABLE)
            .update({ 
                post_img_url: imgUrl, 
                post_description: description 
            })
            .eq('id', id); // សំខាន់​ណាស់ (WHERE id = ...)
        
        if (error) throw error;
        
        message.textContent = 'បាន​កែប្រែ​ដោយ​ជោគជ័យ!';
        fetchAdsFromSupabase(); // ផ្ទុក​ទិន្នន័យ​បញ្ជី Post ឡើង​វិញ
        
        // បិទ Modal ក្រោយ​ពេល ១ វិនាទី
        setTimeout(() => {
            handleShowEditModal(false);
        }, 1000);
        
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
        submitButton.disabled = false;
        submitButton.textContent = 'រក្សាទុក​ការ​ផ្លាស់ប្ដូរ';
    }
}

function loadAdminPostData(ads) {
    const adminList = document.getElementById('admin-ads-list');
    adminList.innerHTML = '';
    if (ads.length === 0) {
        adminList.innerHTML = '<p class="text-gray-500 text-center">មិន​ទាន់​មាន​ពាណិជ្ជកម្ម​ទេ។</p>';
        return;
    }
    
    ads.forEach(ad => {
        const adElement = document.createElement('div');
        adElement.className = 'flex items-center justify-between p-2 bg-white rounded-lg shadow-sm';
        adElement.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${ad.post_img_url}" alt="Ad Thumbnail" class="w-16 h-10 object-cover rounded">
                <p class="text-sm text-gray-700 truncate">${ad.post_description}</p>
            </div>
            <div class="flex gap-2">
                <button data-id="${ad.id}" class="edit-ad-button px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600">
                    កែប្រែ
                </button>
                <button data-id="${ad.id}" class="delete-ad-button px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600">
                    លុប
                </button>
            </div>
        `;
        adminList.appendChild(adElement);
    });
    
    document.querySelectorAll('.delete-ad-button').forEach(button => {
        button.addEventListener('click', handleDeleteAd);
    });
    
    document.querySelectorAll('.edit-ad-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const adId = e.target.dataset.id;
            const adToEdit = allAdsData.find(a => a.id == adId); // ស្វែងរក​ទិន្នន័យ Ad ពី​ក្នុង Array
            if (adToEdit) {
                handleShowEditModal(true, adToEdit); // បើក Edit Modal ជាមួយ​ទិន្នន័យ​នោះ
            }
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('login-error-message');
    const submitButton = document.getElementById('login-submit-button');
    
    errorMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'កំពុង​ចូល...';

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
    } catch (error) {
        errorMessage.textContent = 'Email ឬ Password មិន​ត្រឹមត្រូវ​ទេ។';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'ចូល (Login)';
    }
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
}

async function handlePostSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Session ផុត​កំណត់​។ សូម Login ម្ដង​ទៀត។');
        return;
    }
    
    const imgUrl = document.getElementById('ad-img-url').value;
    const description = document.getElementById('ad-description').value;
    const message = document.getElementById('post-form-message');
    const submitButton = document.getElementById('post-submit-button');

    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'កំពុង​បញ្ជូន...';
    
    try {
        const { error } = await supabaseClient
            .from(ADS_TABLE)
            .insert([
                { post_img_url: imgUrl, post_description: description }
            ]);
        if (error) throw error;
        
        message.textContent = 'បាន​បន្ថែម​ពាណិជ្ជកម្ម​ថ្មី​ដោយ​ជោគជ័យ!';
        document.getElementById('post-form').reset();
        fetchAdsFromSupabase(); 
        
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'បញ្ជូន (Submit Post)';
    }
}

async function handleDeleteAd(e) {
    const adId = e.target.dataset.id;
    if (!adId) return;
    if (!confirm(`តើ​អ្នក​ពិត​ជា​ចង់​លុប Post នេះ​មែន​ទេ?`)) return;

    try {
        const { error } = await supabaseClient
            .from(ADS_TABLE)
            .delete()
            .eq('id', adId);
        if (error) throw error;
        
        fetchAdsFromSupabase(); 
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// --- ដំណើរការ AI Models (មិន​ផ្លាស់ប្ដូរ) ---
async function loadModels() {
    const statusText = document.getElementById('status-text');
    const statusDiv = document.getElementById('status');
    const statusSpinner = document.getElementById('status-spinner');
    const uploadSection = document.getElementById('upload-section');
    const settingsSection = document.getElementById('settings-section'); 
    
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        statusText.textContent = 'AI Models បាន​ដំណើរការ​រួចរាល់។ សូម​ Upload រូបថត​របស់​អ្នក។';
        statusDiv.classList.remove('bg-blue-500');
        statusDiv.classList.add('bg-green-600');
        statusSpinner.style.display = 'none';
        uploadSection.classList.remove('opacity-50', 'pointer-events-none');
        settingsSection.classList.remove('opacity-50', 'pointer-events-none'); 
    } catch (error) {
        console.error("Error loading models:", error);
        statusText.textContent = 'Error: មិន​អាច​ដំណើរការ AI models បាន​ទេ។ សូម Refresh ទំព័រ​។';
        statusDiv.classList.remove('bg-blue-500');
        statusDiv.classList.add('bg-red-600');
        statusSpinner.style.display = 'none';
    }
}

// --- កូដ​កម្មវិធី​សំខាន់ (Splitter) ---
document.addEventListener('DOMContentLoaded', () => {
    
    const imageUpload = document.getElementById('imageUpload');
    const detectButton = document.getElementById('detectButton');
    const downloadAllButton = document.getElementById('downloadAllButton'); 
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('preview-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsDiv = document.getElementById('results');
    const resultsCount = document.getElementById('results-count');
    const paddingSliderY = document.getElementById('paddingSliderY'); 
    const paddingValueY = document.getElementById('paddingValueY'); 
    const paddingSliderX = document.getElementById('paddingSliderX'); 
    const paddingValueX = document.getElementById('paddingValueX'); 
    const navSplitterButton = document.getElementById('nav-splitter-button');
    const navPostButton = document.getElementById('nav-post-button');
    const navLoginButton = document.getElementById('nav-login-button');
    const navLogoutButton = document.getElementById('nav-logout-button');
    const loginModal = document.getElementById('login-modal');
    const loginModalClose = document.getElementById('login-modal-close');
    const loginForm = document.getElementById('login-form');
    const postForm = document.getElementById('post-form');
    const adModalClose = document.getElementById('ad-modal-close');
    
    const editPostModalClose = document.getElementById('edit-post-modal-close');
    const editPostForm = document.getElementById('edit-post-form');
    editPostModalClose.addEventListener('click', () => handleShowEditModal(false));
    editPostForm.addEventListener('submit', handleUpdatePost);

    adModalClose.addEventListener('click', closeAdModal);

    loadModels();
    fetchAdsFromSupabase(); 
    showView('splitter-view'); 

    navSplitterButton.addEventListener('click', () => showView('splitter-view'));
    navPostButton.addEventListener('click', () => showView('post-view'));
    navLoginButton.addEventListener('click', () => showLoginModal(true));
    navLogoutButton.addEventListener('click', handleLogout);
    loginModalClose.addEventListener('click', () => showLoginModal(false));
    loginForm.addEventListener('submit', handleLogin);
    postForm.addEventListener('submit', handlePostSubmit);

    supabaseClient.auth.onAuthStateChange((event, session) => {
        const user = session?.user;
        if (user) {
            currentUser = user;
            navLoginButton.classList.add('hidden');
            navLogoutButton.classList.remove('hidden');
            navPostButton.classList.remove('hidden');
            showLoginModal(false); 
            fetchAdsFromSupabase(); 
        } else {
            currentUser = null;
            navLoginButton.classList.remove('hidden');
            navLogoutButton.classList.add('hidden');
            navPostButton.classList.add('hidden');
            showView('splitter-view'); 
        }
    });

    paddingSliderY.addEventListener('input', (e) => {
        paddingValueY.textContent = `${e.target.value}%`;
    });
    paddingSliderX.addEventListener('input', (e) => {
        paddingValueX.textContent = `${e.target.value}%`;
    });

    imageUpload.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        originalImage = new Image();
        const objectUrl = URL.createObjectURL(file);
        originalImage.onload = () => {
            imagePreview.src = originalImage.src;
            previewContainer.classList.remove('hidden');
            detectButton.disabled = false;
            detectButton.textContent = '៥. ស្វែងរក និង​កាត់​រូបថត';
            resultsDiv.innerHTML = '';
            resultsContainer.classList.add('hidden');
            downloadAllButton.classList.add('hidden'); 
            originalDetections = []; 
            croppedImageUrls = []; 
            totalDetections = 0;
            URL.revokeObjectURL(objectUrl);
        };
        originalImage.src = objectUrl;
    });
    
    function addWatermark(base64Image, text) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const fontSize = Math.max(16, img.height * 0.05); 
                ctx.font = `bold ${fontSize}px 'Khmer Os Siemreap', Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                const x = canvas.width / 2;
                const y = canvas.height - (fontSize * 0.5); 
                ctx.strokeStyle = 'black';
                ctx.lineWidth = Math.max(2, fontSize * 0.1); 
                ctx.strokeText(text, x, y);
                ctx.fillStyle = 'white';
                ctx.fillText(text, x, y);
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.onerror = reject;
            img.src = base64Image;
        });
    }

    function cropFace(originalBox, padPercentY, padPercentX, offsetPercentY, offsetPercentX) {
        const box = originalBox; 
        const offsetY = box.height * (offsetPercentY / 100);
        const offsetX = box.width * (offsetPercentX / 100);
        const padY = box.height * (padPercentY / 100); 
        const padX = box.width * (padPercentX / 100);
        const paddedBox = new faceapi.Box({
            x: Math.max(0, box.x - padX + offsetX), 
            y: Math.max(0, box.y - padY + offsetY), 
            width: box.width + (padX * 2),
            height: box.height + (padY * 2)
        });
        try {
            const cropCanvas = document.createElement('canvas');
            const cropCtx = cropCanvas.getContext('2d');
            cropCanvas.width = paddedBox.width;
            cropCanvas.height = paddedBox.height;
            cropCtx.drawImage(
                originalImage,
                paddedBox.x, paddedBox.y, paddedBox.width, paddedBox.height,
                0, 0, paddedBox.width, paddedBox.height
            );
            return cropCanvas.toDataURL('image/jpeg');
        } catch (cropError) {
            console.error("Error during cropping:", cropError);
            return null;
        }
    }

    detectButton.addEventListener('click', async () => {
        if (!originalImage) return;
        detectButton.disabled = true;
        detectButton.textContent = 'កំពុង​ស្វែងរក...';
        resultsDiv.innerHTML = '';
        resultsContainer.classList.add('hidden');
        downloadAllButton.classList.add('hidden'); 
        croppedImageUrls = []; 
        originalDetections = []; 
        totalDetections = 0;
        
        const oldCanvas = previewContainer.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();

        originalDetections = await faceapi.detectAllFaces(originalImage);
        totalDetections = originalDetections.length; 
        const GLOBAL_CROP_PADDING_Y = parseInt(paddingSliderY.value);
        const GLOBAL_CROP_PADDING_X = parseInt(paddingSliderX.value);

        if (originalDetections.length > 0) {
            const canvas = faceapi.createCanvasFromMedia(originalImage);
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            imagePreview.parentNode.appendChild(canvas); 
            faceapi.matchDimensions(canvas, originalImage);
            resultsContainer.classList.remove('hidden');
            resultsCount.textContent = `រក​ឃើញ ${totalDetections} មុខ។`;
            
            for (let i = 0; i < originalDetections.length; i++) {
                const detection = originalDetections[i];
                const box = detection.box;
                const padY_draw = box.height * (GLOBAL_CROP_PADDING_Y / 100);
                const padX_draw = box.width * (GLOBAL_CROP_PADDING_X / 100);
                const paddedBox_draw = new faceapi.Box({
                    x: Math.max(0, box.x - padX_draw), y: Math.max(0, box.y - padY_draw),
                    width: box.width + (padX_draw * 2), height: box.height + (padY_draw * 2)
                });
                const drawBox = new faceapi.draw.DrawBox(paddedBox_draw, { 
                    label: `Face ${i+1}`, boxColor: 'rgba(0, 255, 0, 1)', drawLabel: true, lineWidth: 2 
                });
                drawBox.draw(canvas);

                const croppedImageUrl_Original = cropFace(box, GLOBAL_CROP_PADDING_Y, GLOBAL_CROP_PADDING_X, 0, 0);
                
                if (croppedImageUrl_Original) {
                    const defaultFilename = `student_${i + 1}`;
                    const croppedImageUrl_Watermarked = await addWatermark(croppedImageUrl_Original, defaultFilename);
                    croppedImageUrls[i] = {
                        originalUrl: croppedImageUrl_Original, 
                        watermarkedUrl: croppedImageUrl_Watermarked, 
                        filename: defaultFilename
                    };
                    
                    const itemContainer = document.createElement('div');
                    itemContainer.className = 'flex flex-col gap-3 p-3 border rounded-lg bg-gray-50 shadow-sm relative';
                    
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'w-full';
                    const img = document.createElement('img');
                    img.src = croppedImageUrl_Watermarked; 
                    img.className = 'w-full h-auto rounded-lg shadow-md';
                    imgWrapper.appendChild(img);

                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = '&times;'; 
                    deleteButton.className = 'absolute top-1 right-1 w-7 h-7 flex items-center justify-center bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 focus:outline-none transition-all z-10';
                    deleteButton.title = 'ដក​ចេញ';
                    itemContainer.appendChild(deleteButton); 
                    
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'grid grid-cols-2 gap-2 mt-2'; 
                    const downloadLink = document.createElement('a');
                    downloadLink.href = croppedImageUrl_Watermarked; 
                    downloadLink.download = `${defaultFilename}.jpg`; 
                    downloadLink.textContent = 'ទាញយក';
                    downloadLink.className = 'text-center bg-blue-500 text-white text-sm py-2 px-2 rounded-lg hover:bg-blue-600 transition-all';
                    const adjustButton = document.createElement('button');
                    adjustButton.textContent = 'កែតម្រូវ';
                    adjustButton.className = 'text-center bg-yellow-500 text-white text-sm py-2 px-2 rounded-lg hover:bg-yellow-600 transition-all';
                    buttonContainer.appendChild(downloadLink);
                    buttonContainer.appendChild(adjustButton);
                    
                    const filenameContainer = document.createElement('div');
                    filenameContainer.innerHTML = `<label class="block text-xs font-medium text-gray-700">ឈ្មោះ​ឯកសារ (Filename):</label>`;
                    const filenameInput = document.createElement('input');
                    filenameInput.type = 'text';
                    filenameInput.value = defaultFilename; 
                    filenameInput.className = 'w-full px-2 py-1 border border-gray-300 rounded-md text-sm';
                    filenameContainer.appendChild(filenameInput);

                    const sliderPadYContainer = document.createElement('div');
                    sliderPadYContainer.innerHTML = `<label class="block text-xs font-medium text-gray-700">ពង្រីក​កម្ពស់: <span class="font-bold text-blue-600">${GLOBAL_CROP_PADDING_Y}%</span></label>`;
                    const sliderPadY = document.createElement('input');
                    sliderPadY.type = 'range'; sliderPadY.min = '0'; sliderPadY.max = '100'; sliderPadY.value = GLOBAL_CROP_PADDING_Y; 
                    sliderPadY.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer';
                    sliderPadYContainer.appendChild(sliderPadY);
                    
                    const sliderPadXContainer = document.createElement('div');
                    sliderPadXContainer.innerHTML = `<label class="block text-xs font-medium text-gray-700">ពង្រីក​ទទឹង: <span class="font-bold text-blue-600">${GLOBAL_CROP_PADDING_X}%</span></label>`;
                    const sliderPadX = document.createElement('input');
                    sliderPadX.type = 'range'; sliderPadX.min = '0'; sliderPadX.max = '100'; sliderPadX.value = GLOBAL_CROP_PADDING_X; 
                    sliderPadX.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer';
                    sliderPadXContainer.appendChild(sliderPadX);

                    const sliderOffsetYContainer = document.createElement('div');
                    sliderOffsetYContainer.innerHTML = `<label class="block text-xs font-medium text-gray-700">រំកិល​បញ្ឈរ: <span class="font-bold text-blue-600">0%</span></label>`;
                    const sliderOffsetY = document.createElement('input');
                    sliderOffsetY.type = 'range'; sliderOffsetY.min = '-100'; sliderOffsetY.max = '100'; sliderOffsetY.value = '0'; 
                    sliderOffsetY.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer';
                    sliderOffsetYContainer.appendChild(sliderOffsetY);
                    
                    const sliderOffsetXContainer = document.createElement('div');
                    sliderOffsetXContainer.innerHTML = `<label class="block text-xs font-medium text-gray-700">រំកិល​ផ្ដេក: <span class="font-bold text-blue-600">0%</span></label>`;
                    const sliderOffsetX = document.createElement('input');
                    sliderOffsetX.type = 'range'; sliderOffsetX.min = '-100'; sliderOffsetX.max = '100'; sliderOffsetX.value = '0'; 
                    sliderOffsetX.className = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer';
                    sliderOffsetXContainer.appendChild(sliderOffsetX);

                    itemContainer.appendChild(imgWrapper);
                    itemContainer.appendChild(filenameContainer); 
                    itemContainer.appendChild(sliderPadYContainer); 
                    itemContainer.appendChild(sliderPadXContainer);
                    itemContainer.appendChild(sliderOffsetYContainer); 
                    itemContainer.appendChild(sliderOffsetXContainer); 
                    itemContainer.appendChild(buttonContainer); 
                    resultsDiv.appendChild(itemContainer);
                    
                    sliderPadY.addEventListener('input', () => { sliderPadYContainer.querySelector('span').textContent = `${sliderPadY.value}%`; });
                    sliderPadX.addEventListener('input', () => { sliderPadXContainer.querySelector('span').textContent = `${sliderPadX.value}%`; });
                    sliderOffsetY.addEventListener('input', () => { sliderOffsetYContainer.querySelector('span').textContent = `${sliderOffsetY.value}%`; });
                    sliderOffsetX.addEventListener('input', () => { sliderOffsetXContainer.querySelector('span').textContent = `${sliderOffsetX.value}%`; });
                    
                    adjustButton.addEventListener('click', async () => {
                        const newPadY = parseInt(sliderPadY.value);
                        const newPadX = parseInt(sliderPadX.value);
                        const newOffsetY = parseInt(sliderOffsetY.value);
                        const newOffsetX = parseInt(sliderOffsetX.value);
                        const newCroppedOriginalUrl = cropFace(box, newPadY, newPadX, newOffsetY, newOffsetX);
                        if (newCroppedOriginalUrl) {
                            const currentFilename = filenameInput.value || `student_${i+1}`;
                            const newWatermarkedUrl = await addWatermark(newCroppedOriginalUrl, currentFilename);
                            img.src = newWatermarkedUrl;
                            downloadLink.href = newWatermarkedUrl;
                            downloadLink.download = `${currentFilename}.jpg`;
                            croppedImageUrls[i] = {
                                originalUrl: newCroppedOriginalUrl,
                                watermarkedUrl: newWatermarkedUrl,
                                filename: currentFilename
                            };
                        }
                    });

                    filenameInput.addEventListener('input', async (e) => {
                        const newFilename = e.target.value || `student_${i+1}`;
                        const originalCropped = croppedImageUrls[i].originalUrl;
                        const newWatermarkedUrl = await addWatermark(originalCropped, newFilename);
                        img.src = newWatermarkedUrl;
                        downloadLink.href = newWatermarkedUrl;
                        downloadLink.download = `${newFilename}.jpg`;
                        croppedImageUrls[i].watermarkedUrl = newWatermarkedUrl; 
                        croppedImageUrls[i].filename = newFilename; 
                    });
                    
                    deleteButton.addEventListener('click', () => {
                        itemContainer.remove();
                        croppedImageUrls[i] = null; 
                        totalDetections--;
                        resultsCount.textContent = `រក​ឃើញ ${totalDetections} មុខ។`;
                        if (totalDetections === 0) {
                            downloadAllButton.classList.add('hidden');
                        }
                    });
                }
            }
            if (totalDetections > 0) {
                downloadAllButton.classList.remove('hidden');
            }
        } else {
            resultsContainer.classList.remove('hidden');
            resultsCount.textContent = 'Error: រក​មិន​ឃើញ​មុខ​ទេ។ សូម​សាកល្បង​រូបថត​ផ្សេង​ទៀត។';
        }
        detectButton.disabled = false;
        detectButton.textContent = '៥. ស្វែងរក និង​កាត់​រូបថត';
    });

    downloadAllButton.addEventListener('click', async () => {
        if (croppedImageUrls.length === 0) return;
        downloadAllButton.textContent = 'កំពុង​រៀបចំ ZIP...';
        downloadAllButton.disabled = true;
        try {
            const zip = new JSZip();
            for (let i = 0; i < croppedImageUrls.length; i++) {
                const imageData = croppedImageUrls[i];
                if(imageData !== null) {
                    const dataUrl = imageData.watermarkedUrl;
                    const base64Data = dataUrl.split(',')[1];
                    const filename = `${imageData.filename}.jpg`;
                    zip.file(filename, base64Data, { base64: true });
                }
            }
            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'all_student_photos.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (zipError) {
            console.error("Error creating ZIP:", zipError);
        } finally {
            downloadAllButton.textContent = 'ទាញយក​ទាំងអស់ (ZIP)';
            downloadAllButton.disabled = false;
        }
    });
});