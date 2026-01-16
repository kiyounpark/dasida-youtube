/**
 * 폼 검증 모듈
 * 입력 필드의 유효성을 검사하고 제출 버튼의 활성화 상태를 관리합니다.
 */

import { getImageCount } from './state.js';
import { getTitleInput, getContentInput, getSubmitButton } from './domManager.js';

/**
 * 폼 전체의 유효성을 검증하고 제출 버튼 상태를 업데이트합니다.
 *
 * 검증 조건:
 * - 제목: 공백이 아닌 문자가 1자 이상 입력되어야 함
 * - 내용: 텍스트가 입력되거나 이미지가 1개 이상 업로드되어야 함
 *
 * 두 조건이 모두 충족되면 제출 버튼이 활성화됩니다.
 */
export function validateForm() {
    const hasTitle = getTitleInput().value.trim().length > 0;
    const hasContent = getContentInput().value.trim().length > 0 || getImageCount() > 0;

    getSubmitButton().disabled = !(hasTitle && hasContent);
}
