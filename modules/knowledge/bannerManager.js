/**
 * 배너 관리 모듈
 * 정보 배너의 표시, 숨김 및 애니메이션을 담당합니다.
 */

import { getInfoBanner, getContentInputContainer, getUploadSection } from './domManager.js';
import { adjustTextareaHeight } from './textareaManager.js';

/**
 * 정보 배너를 닫고 레이아웃을 재조정합니다.
 *
 * 동작 순서:
 * 1. 배너에 'hidden' 클래스 추가 (애니메이션 시작)
 * 2. 내용 입력 영역과 업로드 섹션에 'banner-closed' 클래스 추가 (위로 이동)
 * 3. 300ms 후 배너를 완전히 숨기고 레이아웃 재계산
 *
 * 배너가 닫히면 전체 UI가 위로 올라가 공간을 효율적으로 사용합니다.
 */
export function closeBanner() {
    const infoBanner = getInfoBanner();
    const contentInputContainer = getContentInputContainer();
    const uploadSection = getUploadSection();

    // 배너 숨김 애니메이션 시작
    infoBanner.classList.add('hidden');

    // 내용 입력 영역과 업로드 섹션을 위로 이동
    contentInputContainer.classList.add('banner-closed');
    uploadSection.classList.add('banner-closed');

    // 애니메이션 완료 후 배너를 완전히 숨기고 레이아웃 재계산
    setTimeout(() => {
        infoBanner.style.display = 'none';
        adjustTextareaHeight(); // 배너 닫힌 상태로 업로드 섹션 위치 재계산
    }, 300);
}
