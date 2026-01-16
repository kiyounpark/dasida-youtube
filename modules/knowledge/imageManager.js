/**
 * 이미지 관리 모듈
 * 이미지 업로드, 검증, 미리보기, 삭제 등 이미지 관련 모든 기능을 담당합니다.
 */

import { addImage, removeImage, getImageCount, isMaxReached, getMaxImages } from './state.js';
import { getUploadButton, getFileInput, getUploadCountElement, getImagePreviewContainer } from './domManager.js';
import { validateForm } from './formValidator.js';

/**
 * 지원되는 이미지 파일 타입 목록
 * @constant {string[]}
 */
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * 파일 선택 다이얼로그를 엽니다.
 * 최대 업로드 개수에 도달한 경우 경고 메시지를 표시하고 종료합니다.
 */
export function openFileDialog() {
    if (isMaxReached()) {
        alert(`최대 ${getMaxImages()}개의 이미지만 업로드할 수 있습니다.`);
        return;
    }
    getFileInput().click();
}

/**
 * 파일 선택 이벤트를 처리합니다.
 * 선택된 파일의 개수를 확인하고 타입을 검증한 후 유효한 파일만 업로드합니다.
 *
 * @param {Event} event - 파일 입력 이벤트
 */
export function handleFileSelect(event) {
    const files = Array.from(event.target.files);

    // 최대 개수 초과 여부 확인
    const remainingSlots = getMaxImages() - getImageCount();
    const filesToAdd = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
        alert(`최대 ${getMaxImages()}개의 이미지만 업로드할 수 있습니다. ${remainingSlots}개만 추가됩니다.`);
    }

    // 파일 타입 검증
    const validFiles = filesToAdd.filter(file => {
        if (!VALID_IMAGE_TYPES.includes(file.type)) {
            alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.\n지원 가능파일: JPEG, PNG, WEBP`);
            return false;
        }
        return true;
    });

    // 유효한 파일 처리
    validFiles.forEach(file => {
        processImageFile(file);
    });

    // 파일 입력 필드 초기화 (같은 파일을 다시 선택할 수 있도록)
    getFileInput().value = '';
}

/**
 * 이미지 파일을 읽어서 Base64로 변환하고 상태에 추가합니다.
 *
 * @private
 * @param {File} file - 처리할 이미지 파일
 */
function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = {
            id: Date.now() + Math.random(), // 고유 ID 생성
            file: file,
            dataUrl: e.target.result         // Base64 인코딩된 이미지 데이터
        };
        addImage(imageData);
        renderImagePreview(imageData);
        updateUploadCount();
        validateForm();
    };
    reader.readAsDataURL(file);
}

/**
 * 이미지 미리보기 요소를 생성하고 컨테이너에 추가합니다.
 * 각 미리보기에는 삭제 버튼이 포함됩니다.
 *
 * @private
 * @param {Object} imageData - 렌더링할 이미지 데이터
 * @param {number} imageData.id - 이미지 고유 ID
 * @param {string} imageData.dataUrl - Base64 인코딩된 이미지 URL
 */
function renderImagePreview(imageData) {
    const imagePreviewContainer = getImagePreviewContainer();
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

    // 삭제 버튼 이벤트 리스너 등록
    const removeButton = previewElement.querySelector('.remove-image');
    removeButton.addEventListener('click', () => removeImageHandler(imageData.id));

    imagePreviewContainer.appendChild(previewElement);
}

/**
 * ID에 해당하는 이미지를 삭제합니다.
 * 상태에서 제거하고 DOM에서도 미리보기 요소를 제거합니다.
 *
 * @param {number} imageId - 삭제할 이미지의 고유 ID
 */
export function removeImageHandler(imageId) {
    removeImage(imageId);

    const previewElement = document.querySelector(`.image-preview[data-image-id="${imageId}"]`);
    if (previewElement) {
        previewElement.remove();
    }

    updateUploadCount();
    validateForm();
}

/**
 * 업로드된 이미지 개수를 화면에 업데이트하고 업로드 버튼 상태를 조정합니다.
 * 최대 개수에 도달하면 버튼을 비활성화 스타일로 변경합니다.
 */
export function updateUploadCount() {
    const uploadCountElement = getUploadCountElement();
    const uploadButton = getUploadButton();

    uploadCountElement.textContent = getImageCount();

    // 최대 개수 도달 시 버튼 비활성화 스타일 적용
    if (isMaxReached()) {
        uploadButton.style.opacity = '0.5';
        uploadButton.style.cursor = 'not-allowed';
    } else {
        uploadButton.style.opacity = '1';
        uploadButton.style.cursor = 'pointer';
    }
}
