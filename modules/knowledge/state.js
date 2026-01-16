/**
 * 상태 관리 모듈
 * 업로드된 이미지 배열과 관련 상수를 중앙에서 관리합니다.
 */

/**
 * 애플리케이션 전역 상태
 * @private
 */
const state = {
    uploadedImages: [], // 업로드된 이미지 데이터 배열
    MAX_IMAGES: 3       // 최대 업로드 가능한 이미지 개수
};

/**
 * 이미지를 상태에 추가합니다.
 * 최대 개수를 초과하면 추가하지 않습니다.
 *
 * @param {Object} imageData - 추가할 이미지 데이터
 * @param {number} imageData.id - 이미지 고유 ID
 * @param {File} imageData.file - 파일 객체
 * @param {string} imageData.dataUrl - Base64 인코딩된 이미지 URL
 * @returns {boolean} 추가 성공 여부
 */
export function addImage(imageData) {
    if (state.uploadedImages.length < state.MAX_IMAGES) {
        state.uploadedImages.push(imageData);
        return true;
    }
    return false;
}

/**
 * ID에 해당하는 이미지를 상태에서 제거합니다.
 *
 * @param {number} imageId - 제거할 이미지의 고유 ID
 */
export function removeImage(imageId) {
    state.uploadedImages = state.uploadedImages.filter(img => img.id !== imageId);
}

/**
 * 현재 업로드된 모든 이미지 배열을 반환합니다.
 * 원본 배열의 복사본을 반환하여 외부에서 직접 수정할 수 없도록 합니다.
 *
 * @returns {Array<Object>} 이미지 데이터 배열의 복사본
 */
export function getImages() {
    return [...state.uploadedImages];
}

/**
 * 현재 업로드된 이미지의 개수를 반환합니다.
 *
 * @returns {number} 업로드된 이미지 개수
 */
export function getImageCount() {
    return state.uploadedImages.length;
}

/**
 * 업로드된 모든 이미지를 삭제합니다.
 * 폼 리셋 시 사용됩니다.
 */
export function clearImages() {
    state.uploadedImages = [];
}

/**
 * 최대 업로드 개수에 도달했는지 확인합니다.
 *
 * @returns {boolean} 최대 개수 도달 여부
 */
export function isMaxReached() {
    return state.uploadedImages.length >= state.MAX_IMAGES;
}

/**
 * 최대 업로드 가능한 이미지 개수를 반환합니다.
 *
 * @returns {number} 최대 이미지 개수 (3개)
 */
export function getMaxImages() {
    return state.MAX_IMAGES;
}
