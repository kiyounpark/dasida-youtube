/**
 * Textarea 관리 모듈
 * 내용 입력 필드의 자동 높이 조절과 관련 레이아웃 업데이트를 담당합니다.
 */

import { getContentInput, getContentInputContainer, getUploadSection, getInfoBanner } from './domManager.js';
import { validateForm } from './formValidator.js';

/**
 * 내용 입력 이벤트를 처리합니다.
 * 입력 시마다 textarea 높이를 조절하고 폼 검증을 실행합니다.
 */
export function handleContentInput() {
    adjustTextareaHeight();
    validateForm();
}

/**
 * Textarea의 높이를 내용에 맞게 자동으로 조절합니다.
 * 또한 하위 업로드 섹션의 위치도 함께 조정하여 레이아웃이 겹치지 않도록 합니다.
 *
 * 계산 방식:
 * - Textarea 최소 높이: 200px (패딩 24px 포함)
 * - 업로드 섹션 위치: 배너 상태(열림/닫힘)와 textarea 높이에 따라 동적 계산
 * - 배너 열림: baseTop = 240px
 * - 배너 닫힘: baseTop = 122px
 */
export function adjustTextareaHeight() {
    const contentInput = getContentInput();
    const contentInputContainer = getContentInputContainer();
    const uploadSection = getUploadSection();
    const infoBanner = getInfoBanner();

    // Textarea 높이를 내용에 맞게 조절
    contentInput.style.height = 'auto';
    contentInput.style.height = contentInput.scrollHeight + 'px';

    // 컨테이너 높이 업데이트 (최소 200px)
    const newContainerHeight = Math.max(200, contentInput.scrollHeight + 24);
    contentInputContainer.style.minHeight = newContainerHeight + 'px';

    // 배너 상태에 따라 업로드 섹션 위치 계산
    const bannerClosed = infoBanner.classList.contains('hidden');
    const baseTop = bannerClosed ? 122 : 240;
    const newUploadTop = baseTop + newContainerHeight + 18;
    uploadSection.style.top = newUploadTop + 'px';
}
