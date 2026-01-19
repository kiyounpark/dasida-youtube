/**
 * 퀴즈 스와이퍼 모듈
 * Swiper.js 라이브러리를 사용하여 퀴즈 카드 스와이프 기능을 제공합니다.
 */

/**
 * Swiper 인스턴스
 * @type {Swiper|null}
 */
let swiperInstance = null;

/**
 * 전체 퀴즈 목록
 * @type {Array}
 */
let quizzes = [];

/**
 * 맞춘 퀴즈 개수
 * @type {number}
 */
let correctCount = 0;

function isMobileDevice() {
    return /Android|iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function blurActiveAnswerInput() {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.classList.contains('quiz-answer-input')) {
        activeElement.blur();
    }
}

/**
 * 퀴즈 스와이퍼를 초기화합니다.
 * Swiper 라이브러리를 사용하여 슬라이드 기능을 설정합니다.
 *
 * @param {Array} quizData - 퀴즈 데이터 배열
 */
export function initQuizSwiper(quizData) {
    quizzes = quizData;
    correctCount = 0;

    if (quizzes.length === 0) return;

    // Swiper 초기화 (렌더링 후에 실행되어야 함)
    setTimeout(() => {
        if (isMobileDevice()) {
            document.documentElement.classList.add('mobile');
        }
        if (isIOS()) {
            document.documentElement.classList.add('ios');
        }

        const swiperOptions = {
            grabCursor: true,
            preventClicks: false,
            preventClicksPropagation: false,
            touchStartPreventDefault: false,
            noSwiping: true,
            noSwipingSelector: '.quiz-answer-input, .submit-answer-button',
            pagination: {
                el: '.quiz-pagination',
                clickable: true,
            },
            on: {
                touchStart: function(swiper, event) {
                    if (event?.target?.closest?.('.quiz-answer-input, .submit-answer-button')) {
                        return;
                    }
                    blurActiveAnswerInput();
                },
                touchEnd: function() {
                    this.allowClick = true;
                },
                slideChangeTransitionStart: function() {
                    blurActiveAnswerInput();
                },
                slideChange: function() {
                    updateProgressIndicator(this.activeIndex);
                }
            }
        };

        if (isMobileDevice()) {
            swiperOptions.effect = 'slide';
        } else {
            swiperOptions.effect = 'cards';
            swiperOptions.cardsEffect = {
                slideShadows: true,
                perSlideOffset: 8,
                perSlideRotate: 2,
            };
        }

        swiperInstance = new Swiper('.quiz-swiper', swiperOptions);

        updateProgressIndicator(0);
    }, 100);
}

/**
 * 퀴즈 정답을 체크합니다.
 *
 * @param {string} userAnswer - 사용자 답변
 * @returns {boolean} 정답 여부
 */
export function checkAnswer(userAnswer) {
    if (!swiperInstance) return false;

    const currentIndex = swiperInstance.activeIndex;
    const currentQuiz = quizzes[currentIndex];

    if (!currentQuiz) return false;

    const isCorrect = userAnswer.trim().toLowerCase() === currentQuiz.answer.trim().toLowerCase();

    if (isCorrect) {
        correctCount++;
        showFeedback(true);

        // 1초 후 다음 슬라이드로
        setTimeout(() => {
            if (currentIndex < quizzes.length - 1) {
                swiperInstance.slideNext();
            } else {
                showCompletionMessage();
            }
        }, 1000);
    } else {
        showFeedback(false);
    }

    return isCorrect;
}

/**
 * 다음 퀴즈로 이동합니다.
 */
export function nextQuiz() {
    if (swiperInstance) {
        swiperInstance.slideNext();
    }
}

/**
 * 이전 퀴즈로 이동합니다.
 */
export function prevQuiz() {
    if (swiperInstance) {
        swiperInstance.slidePrev();
    }
}

/**
 * 피드백을 표시합니다.
 *
 * @param {boolean} isCorrect - 정답 여부
 */
function showFeedback(isCorrect) {
    // TODO: 피드백 UI 구현
    console.log(isCorrect ? '✅ 정답입니다!' : '❌ 오답입니다.');
}

/**
 * 진행 표시기를 업데이트합니다.
 *
 * @param {number} currentIndex - 현재 퀴즈 인덱스
 */
function updateProgressIndicator(currentIndex) {
    const progressElement = document.querySelector('.quiz-progress');
    if (!progressElement) {
        console.log(`퀴즈 진행: ${currentIndex + 1}/${quizzes.length}`);
        return;
    }

    const totalSlides = swiperInstance?.slides?.length ?? quizzes.length;
    if (!totalSlides) {
        progressElement.textContent = '';
        return;
    }

    progressElement.textContent = `${currentIndex + 1} / ${totalSlides}`;
}

/**
 * 완료 메시지를 표시합니다.
 */
function showCompletionMessage() {
    const container = document.querySelector('.quiz-swiper');
    if (!container) return;

    // Swiper 인스턴스 제거
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
    }

    container.innerHTML = `
        <div class="quiz-completion">
            <div class="completion-icon">🎉</div>
            <div class="completion-title">모든 퀴즈를 완료했습니다!</div>
            <div class="completion-score">${correctCount}/${quizzes.length}개 정답</div>
        </div>
    `;
}

/**
 * Swiper 인스턴스를 반환합니다.
 *
 * @returns {Swiper|null} Swiper 인스턴스
 */
export function getSwiperInstance() {
    return swiperInstance;
}
