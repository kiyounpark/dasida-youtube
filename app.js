/**
 * 애플리케이션 진입점
 * 모든 모듈을 초기화하고 이벤트 리스너를 설정합니다.
 *
 * 모듈 구조:
 * - state.js: 상태 관리 (이미지 배열)
 * - domManager.js: DOM 요소 캐싱
 * - formValidator.js: 폼 검증
 * - textareaManager.js: Textarea 자동 높이 조절
 * - bannerManager.js: 배너 제어
 * - imageManager.js: 이미지 업로드 관리
 * - formHandler.js: 폼 제출 및 리셋
 */

import * as DOMManager from './modules/knowledge/domManager.js';
import { validateForm } from './modules/knowledge/formValidator.js';
import { handleContentInput, adjustTextareaHeight } from './modules/knowledge/textareaManager.js';
import { closeBanner } from './modules/knowledge/bannerManager.js';
import { openFileDialog, handleFileSelect } from './modules/knowledge/imageManager.js';
import { handleSubmit, handleIconClick } from './modules/knowledge/formHandler.js';

/**
 * 애플리케이션을 초기화합니다.
 *
 * 초기화 순서:
 * 1. DOM Manager 초기화 (모든 DOM 요소 캐싱)
 * 2. 각 DOM 요소에 이벤트 리스너 등록
 * 3. Textarea 초기 높이 설정
 */
function init() {
    // DOM 요소 캐싱
    DOMManager.init();

    // 캐싱된 DOM 요소 가져오기
    const titleInput = DOMManager.getTitleInput();
    const contentInput = DOMManager.getContentInput();
    const closeBannerButton = DOMManager.getCloseBannerButton();
    const uploadButton = DOMManager.getUploadButton();
    const fileInput = DOMManager.getFileInput();
    const submitButton = DOMManager.getSubmitButton();
    const appIcon = DOMManager.getAppIcon();

    // 이벤트 리스너 등록
    titleInput.addEventListener('input', validateForm);           // 제목 입력 → 폼 검증
    contentInput.addEventListener('input', handleContentInput);   // 내용 입력 → 높이 조절 + 폼 검증
    closeBannerButton.addEventListener('click', closeBanner);     // 배너 닫기
    uploadButton.addEventListener('click', openFileDialog);       // 파일 선택 다이얼로그 열기
    fileInput.addEventListener('change', handleFileSelect);       // 파일 선택 처리
    submitButton.addEventListener('click', handleSubmit);         // 폼 제출
    appIcon.addEventListener('click', handleIconClick);           // 앱 아이콘 클릭

    // Textarea 초기 높이 설정
    adjustTextareaHeight();
}

/**
 * DOM이 준비되면 애플리케이션을 초기화합니다.
 * DOMContentLoaded 이벤트를 기다리거나, 이미 로드된 경우 즉시 실행합니다.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
