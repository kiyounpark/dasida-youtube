/**
 * DOM 관리 모듈
 * DOM 요소를 캐싱하고 다른 모듈에 접근 인터페이스를 제공합니다.
 * 반복적인 querySelector 호출을 방지하여 성능을 향상시킵니다.
 */

/**
 * DOM 요소를 저장하는 캐시 객체
 * @private
 */
let elements = {};

/**
 * DOM 요소를 한번에 캐싱합니다.
 * 애플리케이션 시작 시 호출되어야 합니다.
 */
export function init() {
    elements = {
        titleInput: document.querySelector('.title-input'),
        contentInput: document.querySelector('.content-input'),
        submitButton: document.querySelector('.submit-button'),
        infoBanner: document.querySelector('.info-banner'),
        closeBannerButton: document.querySelector('.close-banner'),
        uploadButton: document.querySelector('.upload-button'),
        fileInput: document.querySelector('.file-input'),
        uploadCountElement: document.querySelector('.upload-count'),
        imagePreviewContainer: document.querySelector('.image-preview-container'),
        appIcon: document.querySelector('.app-icon'),
        contentInputContainer: document.querySelector('.content-input-container'),
        uploadSection: document.querySelector('.upload-section')
    };
}

/**
 * 제목 입력 필드를 반환합니다.
 * @returns {HTMLInputElement} 제목 입력 필드
 */
export function getTitleInput() {
    return elements.titleInput;
}

/**
 * 내용 입력 필드(textarea)를 반환합니다.
 * @returns {HTMLTextAreaElement} 내용 입력 필드
 */
export function getContentInput() {
    return elements.contentInput;
}

/**
 * 등록 버튼을 반환합니다.
 * @returns {HTMLButtonElement} 제출 버튼
 */
export function getSubmitButton() {
    return elements.submitButton;
}

/**
 * 정보 배너를 반환합니다.
 * @returns {HTMLDivElement} 정보 배너 요소
 */
export function getInfoBanner() {
    return elements.infoBanner;
}

/**
 * 배너 닫기 버튼을 반환합니다.
 * @returns {HTMLButtonElement} 배너 닫기 버튼
 */
export function getCloseBannerButton() {
    return elements.closeBannerButton;
}

/**
 * 사진 업로드 버튼을 반환합니다.
 * @returns {HTMLButtonElement} 업로드 버튼
 */
export function getUploadButton() {
    return elements.uploadButton;
}

/**
 * 파일 선택 input 요소를 반환합니다.
 * @returns {HTMLInputElement} 파일 입력 필드
 */
export function getFileInput() {
    return elements.fileInput;
}

/**
 * 업로드된 이미지 개수를 표시하는 요소를 반환합니다.
 * @returns {HTMLSpanElement} 업로드 카운트 표시 요소
 */
export function getUploadCountElement() {
    return elements.uploadCountElement;
}

/**
 * 이미지 미리보기를 담는 컨테이너를 반환합니다.
 * @returns {HTMLDivElement} 이미지 미리보기 컨테이너
 */
export function getImagePreviewContainer() {
    return elements.imagePreviewContainer;
}

/**
 * 앱 아이콘(로고)을 반환합니다.
 * @returns {HTMLImageElement} 앱 아이콘
 */
export function getAppIcon() {
    return elements.appIcon;
}

/**
 * 내용 입력 영역을 감싸는 컨테이너를 반환합니다.
 * @returns {HTMLDivElement} 내용 입력 컨테이너
 */
export function getContentInputContainer() {
    return elements.contentInputContainer;
}

/**
 * 업로드 섹션 전체를 반환합니다.
 * @returns {HTMLDivElement} 업로드 섹션
 */
export function getUploadSection() {
    return elements.uploadSection;
}
