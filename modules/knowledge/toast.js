/**
 * 토스트 메시지 모듈
 * 하단에 잠깐 나타났다가 사라지는 토스트 메시지를 표시합니다.
 */

/**
 * 토스트 표시 시간 (밀리초)
 * @constant {number} TOAST_DURATION - 토스트가 표시되는 시간
 */
const TOAST_DURATION = 3000;

/**
 * 토스트 페이드아웃 시간 (밀리초)
 * @constant {number} TOAST_FADEOUT_DURATION - 페이드아웃 애니메이션 시간
 */
const TOAST_FADEOUT_DURATION = 300;

/**
 * 토스트 메시지를 표시합니다.
 * 하단에서 나타났다가 자동으로 사라집니다.
 *
 * @param {string} message - 표시할 메시지
 * @param {number} [duration=3000] - 표시 시간 (밀리초)
 *
 * @example
 * showToast('지식이 성공적으로 추가되었습니다!');
 * showToast('오류가 발생했습니다.', 5000);
 */
export function showToast(message, duration = TOAST_DURATION) {
    // 기존 토스트가 있으면 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // 토스트 엘리먼트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // body에 추가
    document.body.appendChild(toast);

    // 약간의 지연 후 표시 (애니메이션을 위해)
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    // 지정된 시간 후 제거
    setTimeout(() => {
        toast.classList.remove('toast-show');

        // 페이드아웃 애니메이션 후 DOM에서 제거
        setTimeout(() => {
            toast.remove();
        }, TOAST_FADEOUT_DURATION);
    }, duration);
}
