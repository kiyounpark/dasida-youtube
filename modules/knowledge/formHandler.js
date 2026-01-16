/**
 * 폼 처리 모듈
 * 폼 제출, 초기화, 앱 아이콘 클릭 등의 이벤트를 담당합니다.
 */

import { getImages, clearImages } from './state.js';
import { getTitleInput, getContentInput, getSubmitButton, getImagePreviewContainer } from './domManager.js';
import { validateForm } from './formValidator.js';
import { updateUploadCount } from './imageManager.js';
import { adjustTextareaHeight } from './textareaManager.js';
import { submitKnowledge, uploadImage } from './apiService.js';
import { showToast } from './toast.js';

/**
 * 폼 제출을 처리합니다.
 * 제출 버튼이 비활성화 상태면 아무 동작도 하지 않습니다.
 *
 * 수집되는 데이터:
 * - title: 제목 (공백 제거)
 * - content: 내용 (공백 제거)
 * - images: 업로드된 이미지 파일 배열
 *
 * axios를 통해 서버로 데이터를 전송하고 응답을 처리합니다.
 */
export async function handleSubmit() {
    if (getSubmitButton().disabled) return;

    const submitButton = getSubmitButton();
    const originalText = submitButton.textContent;

    try {
        // 제출 버튼 비활성화 및 로딩 상태 표시
        submitButton.disabled = true;
        submitButton.textContent = '등록 중...';

        // 폼 데이터 수집
        const title = getTitleInput().value.trim();
        const content = getContentInput().value.trim();
        const images = getImages().map(img => img.file);

        const imageUrls = await uploadImages(images);

        const formData = {
            title,
            text: content,      // content → text로 필드명 변경
            images: imageUrls   // 이미지 URL 배열 별도 전달
        };

        console.log('제출된 데이터:', formData);
        console.log('제목:', title);
        console.log('내용 길이:', content.length);
        console.log('이미지 개수:', imageUrls.length);

        // API 서비스를 통해 서버로 데이터 전송
        const response = await submitKnowledge(formData);

        console.log('서버 응답:', response);

        // 푸시 알림 권한 요청이 필요한 경우
        if (response?.needPushPermission) {
            requestPushNotificationPermission();
        }

        // 성공 토스트 표시 후 홈 화면으로 이동
        showToast('지식이 성공적으로 추가되었습니다!');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } catch (error) {
        // 에러 토스트 표시
        console.error('제출 실패:', error);
        showToast(error.message || '지식 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
        // 제출 버튼 원래 상태로 복구
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

/**
 * 푸시 알림 권한을 요청합니다.
 * 브라우저에서 Notification API를 지원하고, 권한이 아직 요청되지 않은 경우에만 실행됩니다.
 */
function requestPushNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('푸시 알림 권한:', permission);
            if (permission === 'granted') {
                console.log('푸시 알림 권한이 허용되었습니다.');
            } else if (permission === 'denied') {
                console.log('푸시 알림 권한이 거부되었습니다.');
            }
        });
    } else if ('Notification' in window) {
        console.log('푸시 알림 권한 상태:', Notification.permission);
    } else {
        console.log('이 브라우저는 푸시 알림을 지원하지 않습니다.');
    }
}

// 향후 사용 가능성을 위해 주석 처리하여 보존
// function buildContentWithImages(content, imageUrls) {
//     if (!imageUrls.length) return content;
//
//     const imageTags = imageUrls
//         .filter(Boolean)
//         .map((url) => `<img src="${url}" alt="업로드 이미지">`)
//         .join('\n');
//
//     if (!content) {
//         return imageTags;
//     }
//
//     return `${content}\n\n${imageTags}`;
// }

async function uploadImages(files) {
    if (!files.length) return [];

    return Promise.all(files.map((file) => uploadImage(file)));
}

/**
 * 폼을 초기 상태로 리셋합니다.
 *
 * 리셋 동작:
 * - 제목 및 내용 입력 필드 비우기
 * - 모든 업로드된 이미지 삭제
 * - 이미지 미리보기 컨테이너 비우기
 * - 업로드 카운트 업데이트
 * - 폼 검증 상태 업데이트
 * - Textarea 높이 초기화
 */
export function resetForm() {
    getTitleInput().value = '';
    getContentInput().value = '';
    clearImages();
    getImagePreviewContainer().innerHTML = '';
    updateUploadCount();
    validateForm();
    adjustTextareaHeight();
}

/**
 * 앱 아이콘 클릭 이벤트를 처리합니다.
 * 실제 구현에서는 홈으로 이동하거나 메뉴를 여는 등의 동작을 수행할 수 있습니다.
 */
export function handleIconClick() {
    console.log('앱 아이콘 클릭');
    // TODO: 실제 구현에서는 여기서 홈으로 이동하거나 메뉴를 열 수 있습니다
    // Example: window.location.href = '/';
}
