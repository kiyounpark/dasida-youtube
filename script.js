// State management
let uploadedImages = [];
const MAX_IMAGES = 3;

// DOM elements
const titleInput = document.querySelector('.title-input');
const contentInput = document.querySelector('.content-input');
const submitButton = document.querySelector('.submit-button');
const infoBanner = document.querySelector('.info-banner');
const closeBannerButton = document.querySelector('.close-banner');
const uploadButton = document.querySelector('.upload-button');
const fileInput = document.querySelector('.file-input');
const uploadCountElement = document.querySelector('.upload-count');
const imagePreviewContainer = document.querySelector('.image-preview-container');
const appIcon = document.querySelector('.app-icon');
const contentInputContainer = document.querySelector('.content-input-container');
const uploadSection = document.querySelector('.upload-section');

// Initialize
function init() {
    // Event listeners
    titleInput.addEventListener('input', validateForm);
    contentInput.addEventListener('input', handleContentInput);
    closeBannerButton.addEventListener('click', closeBanner);
    uploadButton.addEventListener('click', openFileDialog);
    fileInput.addEventListener('change', handleFileSelect);
    submitButton.addEventListener('click', handleSubmit);
    appIcon.addEventListener('click', handleIconClick);

    // Set initial textarea height
    adjustTextareaHeight();
}

// Handle content input with auto-resize
function handleContentInput() {
    adjustTextareaHeight();
    validateForm();
}

// Adjust textarea height based on content
function adjustTextareaHeight() {
    contentInput.style.height = 'auto';
    contentInput.style.height = contentInput.scrollHeight + 'px';

    // Update container and upload section position
    const newContainerHeight = Math.max(200, contentInput.scrollHeight + 24);
    contentInputContainer.style.minHeight = newContainerHeight + 'px';

    const bannerClosed = infoBanner.classList.contains('hidden');
    const baseTop = bannerClosed ? 122 : 240;
    const newUploadTop = baseTop + newContainerHeight + 18;
    uploadSection.style.top = newUploadTop + 'px';
}

// Validate form to enable/disable submit button
function validateForm() {
    const hasTitle = titleInput.value.trim().length > 0;
    const hasContent = contentInput.value.trim().length > 0 || uploadedImages.length > 0;

    submitButton.disabled = !(hasTitle && hasContent);
}

// Close info banner
function closeBanner() {
    infoBanner.classList.add('hidden');

    // Move content input and upload section up
    contentInputContainer.classList.add('banner-closed');
    uploadSection.classList.add('banner-closed');

    // Hide banner completely after animation
    setTimeout(() => {
        infoBanner.style.display = 'none';
        adjustTextareaHeight(); // Recalculate upload position after banner closes
    }, 300);
}

// Open file dialog
function openFileDialog() {
    if (uploadedImages.length >= MAX_IMAGES) {
        alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`);
        return;
    }
    fileInput.click();
}

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);

    // Check if adding these files would exceed the limit
    const remainingSlots = MAX_IMAGES - uploadedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
        alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다. ${remainingSlots}개만 추가됩니다.`);
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = filesToAdd.filter(file => {
        if (!validTypes.includes(file.type)) {
            alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.\n지원 가능파일: JPEG, PNG, WEBP`);
            return false;
        }
        return true;
    });

    // Process valid files
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = {
                id: Date.now() + Math.random(),
                file: file,
                dataUrl: e.target.result
            };
            uploadedImages.push(imageData);
            renderImagePreview(imageData);
            updateUploadCount();
            validateForm();
        };
        reader.readAsDataURL(file);
    });

    // Reset file input
    fileInput.value = '';
}

// Render image preview
function renderImagePreview(imageData) {
    const previewElement = document.createElement('div');
    previewElement.className = 'image-preview';
    previewElement.dataset.imageId = imageData.id;

    previewElement.innerHTML = `
        <img src="${imageData.dataUrl}" alt="업로드된 이미지">
        <button class="remove-image" data-image-id="${imageData.id}" aria-label="이미지 삭제">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 3L3 9M3 3L9 9" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;

    // Add remove event listener
    const removeButton = previewElement.querySelector('.remove-image');
    removeButton.addEventListener('click', () => removeImage(imageData.id));

    imagePreviewContainer.appendChild(previewElement);
}

// Remove image
function removeImage(imageId) {
    uploadedImages = uploadedImages.filter(img => img.id !== imageId);

    const previewElement = document.querySelector(`.image-preview[data-image-id="${imageId}"]`);
    if (previewElement) {
        previewElement.remove();
    }

    updateUploadCount();
    validateForm();
}

// Update upload count display
function updateUploadCount() {
    uploadCountElement.textContent = uploadedImages.length;

    // Disable upload button if max reached
    if (uploadedImages.length >= MAX_IMAGES) {
        uploadButton.style.opacity = '0.5';
        uploadButton.style.cursor = 'not-allowed';
    } else {
        uploadButton.style.opacity = '1';
        uploadButton.style.cursor = 'pointer';
    }
}

// Handle form submission
function handleSubmit() {
    if (submitButton.disabled) return;

    const formData = {
        title: titleInput.value.trim(),
        content: contentInput.value.trim(),
        images: uploadedImages.map(img => img.file)
    };

    console.log('제출된 데이터:', formData);
    console.log('제목:', formData.title);
    console.log('내용:', formData.content);
    console.log('이미지 개수:', formData.images.length);

    // 실제 구현에서는 여기서 서버로 데이터를 전송합니다
    alert('지식이 성공적으로 추가되었습니다!');

    // Reset form (optional)
    // resetForm();
}

// Handle app icon click
function handleIconClick() {
    console.log('앱 아이콘 클릭');
    // 실제 구현에서는 여기서 홈으로 이동하거나 메뉴를 열 수 있습니다
    // window.location.href = '/';
}

// Reset form
function resetForm() {
    titleInput.value = '';
    contentInput.value = '';
    uploadedImages = [];
    imagePreviewContainer.innerHTML = '';
    updateUploadCount();
    validateForm();
    adjustTextareaHeight();
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
