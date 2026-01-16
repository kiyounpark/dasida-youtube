/**
 * 홈 화면 이벤트 핸들러 모듈
 * 버튼 클릭 및 사용자 상호작용 이벤트를 처리합니다.
 */

import { submitQuizAnswer } from './homeApiService.js';
import { getSwiperInstance } from './quizSwiper.js';
import { showToast } from './toast.js';

/**
 * 지식 추가 페이지 URL
 * @constant {string} KNOWLEDGE_ADD_PAGE - 지식 추가 페이지 경로
 */
const KNOWLEDGE_ADD_PAGE = 'index.html';

/**
 * 지식 추가 버튼 클릭 이벤트를 설정합니다.
 * 버튼 클릭 시 지식 추가 페이지로 이동합니다.
 */
export function setupAddKnowledgeButton() {
    const addButton = document.getElementById('addKnowledgeButton');
    if (!addButton) return;

    addButton.addEventListener('click', () => {
        window.location.href = KNOWLEDGE_ADD_PAGE;
    });
}

/**
 * 지식 아이템 클릭 이벤트를 설정합니다.
 * 지식 목록에서 아이템 클릭 시 상세 페이지로 이동합니다.
 */
export function setupKnowledgeItemClick() {
    const knowledgeList = document.getElementById('knowledgeList');
    if (!knowledgeList) return;

    knowledgeList.addEventListener('click', (event) => {
        const knowledgeItem = event.target.closest('.knowledge-item');
        if (knowledgeItem) {
            const knowledgeId = knowledgeItem.dataset.knowledgeId;
            // TODO: 지식 상세 페이지로 이동
            console.log('지식 클릭:', knowledgeId);
        }
    });
}

/**
 * 퀴즈 카드 클릭 이벤트를 설정합니다.
 * 퀴즈 카드 클릭 시 퀴즈 풀이 페이지로 이동합니다.
 */
export function setupQuizCardClick() {
    const quizContainer = document.getElementById('quizCardContainer');
    if (!quizContainer) return;

    quizContainer.addEventListener('click', (event) => {
        if (event.target.closest('.quiz-content')) {
            return;
        }

        const quizCard = event.target.closest('.quiz-card');
        if (quizCard) {
            const quizId = quizCard.dataset.quizId;
            // TODO: 퀴즈 상세/풀이 페이지로 이동
            console.log('퀴즈 클릭:', quizId);
        }
    });
}

/**
 * 바텀 네비게이션 이벤트를 설정합니다.
 */
export function setupBottomNavigation() {
    const navWrongAnswers = document.getElementById('navWrongAnswers');

    if (navWrongAnswers) {
        navWrongAnswers.addEventListener('click', () => {
            showToast('준비중입니다');
        });
    }
}

/**
 * 퀴즈 정답 제출 이벤트를 설정합니다.
 *
 * @param {Array} quizzes - 퀴즈 목록
 */
export function setupQuizAnswerSubmit(quizzes) {
    const quizContainer = document.getElementById('quizCardContainer');
    if (!quizContainer) return;

    const quizCards = quizContainer.querySelectorAll('.quiz-card');

    quizCards.forEach((quizCard) => {
        const answerInput = quizCard.querySelector('.quiz-answer-input');
        const submitButton = quizCard.querySelector('.submit-answer-button');

        if (!answerInput) return;

        quizCard.addEventListener('click', () => {
            console.log('[QuizAnswer] focus input', quizCard.dataset.quizId);
            answerInput.focus();
        });

        if (submitButton) {
            submitButton.addEventListener('click', async () => {
                console.log('[QuizAnswer] submit button click', quizCard.dataset.quizId);
                await handleAnswerSubmit(answerInput, submitButton, quizCard, quizzes);
            });
        }

        answerInput.addEventListener('keydown', async (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();

            console.log('[QuizAnswer] enter key', quizCard.dataset.quizId);
            await handleAnswerSubmit(answerInput, submitButton, quizCard, quizzes);
        });
    });
}

async function handleAnswerSubmit(answerInput, submitButton, quizCard, quizzes) {
    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
        showToast('정답을 입력해주세요');
        return;
    }

    const swiperInstance = getSwiperInstance();
    if (!swiperInstance) return;

    const quizId = quizCard?.dataset.quizId;
    if (!quizId) {
        showToast('퀴즈 정보를 찾을 수 없어요');
        return;
    }

    const currentQuiz = quizzes.find((quiz) => (
        String(quiz.quizId ?? quiz.id) === String(quizId)
    ));

    if (!currentQuiz) return;

    const resolvedQuizId = currentQuiz.quizId ?? currentQuiz.id;
    const resolvedDayType = 0;
    console.log('[QuizAnswer] submit start', resolvedQuizId);
    const originalText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '확인 중...';
    }

    try {
        const response = await submitQuizAnswer(resolvedQuizId, userAnswer, resolvedDayType);
        console.log('[QuizAnswer] submit response', resolvedQuizId, response);

        if (response.correct) {
            showToast('✅ 정답입니다!');
            answerInput.value = '';

            setTimeout(() => {
                const slideElement = quizCard?.closest('.swiper-slide');
                const rawIndex = slideElement
                    ? Array.from(swiperInstance.slides).indexOf(slideElement)
                    : -1;
                const currentIndex = rawIndex >= 0 ? rawIndex : swiperInstance.activeIndex;

                if (currentIndex < quizzes.length - 1) {
                    console.log('[QuizAnswer] slide next', currentIndex + 1);
                    swiperInstance.slideTo(currentIndex + 1);
                } else {
                    console.log('[QuizAnswer] quiz completed');
                    showToast('🎉 모든 퀴즈를 완료했습니다!');
                }
            }, 1000);
        } else {
            showToast('❌ 오답입니다. 다시 시도해보세요');
            answerInput.select();
        }
    } catch (error) {
        console.error('정답 제출 실패:', error);
        showToast(error.message || '정답 제출에 실패했습니다');
    } finally {
        console.log('[QuizAnswer] submit end', resolvedQuizId);
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}
