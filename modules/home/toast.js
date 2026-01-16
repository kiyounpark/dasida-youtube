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
 */
export function showToast(message, duration = TOAST_DURATION) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('toast-show');

        setTimeout(() => {
            toast.remove();
        }, TOAST_FADEOUT_DURATION);
    }, duration);
}
