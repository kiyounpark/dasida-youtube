/**
 * 홈 화면 이벤트 핸들러 모듈
 * 버튼 클릭 및 사용자 상호작용 이벤트를 처리합니다.
 */

import { submitQuizAnswer } from './homeApiService.js';
import { getSwiperInstance } from './quizSwiper.js';
import { showToast } from './toast.js';

/**
 * 모든 퀴즈 완료 시 표시할 화면을 렌더링합니다.
 */
function showAllQuizzesCompleted() {
    const quizContainer = document.getElementById('quizCardContainer');
    if (!quizContainer) return;

    // Swiper 인스턴스 제거
    const swiperInstance = getSwiperInstance();
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    }

    // 완료 메시지 표시
    quizContainer.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            padding: 40px 20px;
            text-align: center;
        ">
            <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
            <div style="
                font-family: 'Pretendard Variable';
                font-size: 20px;
                font-weight: 700;
                color: #1A1F1F;
                margin-bottom: 8px;
            ">모든 퀴즈를 완료했습니다!</div>
            <div style="
                font-family: 'Pretendard Variable';
                font-size: 14px;
                color: #6F8080;
            ">오늘도 훌륭하게 학습하셨어요</div>
        </div>
    `;

    showToast('🎉 모든 퀴즈를 완료했습니다!');
}

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
        const errorElement = quizCard.querySelector('.quiz-answer-error');

        if (!answerInput) return;

        quizCard.addEventListener('click', () => {
            console.log('[QuizAnswer] focus input', quizCard.dataset.quizId);
            answerInput.focus();
        });

        quizCard.addEventListener('touchend', (event) => {
            if (event.target.closest('.quiz-answer-input, .submit-answer-button')) {
                return;
            }
            console.log('[QuizAnswer] touch focus input', quizCard.dataset.quizId);
            answerInput.focus();
        });

        answerInput.addEventListener('touchend', () => {
            answerInput.focus();
        });

        // 입력 시작하면 에러 메시지 숨기기
        answerInput.addEventListener('input', () => {
            if (errorElement && answerInput.value.trim()) {
                errorElement.style.display = 'none';
            }
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
    const errorElement = quizCard.querySelector('.quiz-answer-error');

    // 에러 메시지 숨기기
    if (errorElement) {
        errorElement.style.display = 'none';
    }

    if (!userAnswer) {
        // 에러 메시지 표시
        if (errorElement) {
            errorElement.style.display = 'block';
        }
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
            // 정답 애니메이션 적용
            quizCard.classList.add('correct-answer');
            answerInput.value = '';

            setTimeout(() => {
                const slideElement = quizCard?.closest('.swiper-slide');
                const rawIndex = slideElement
                    ? Array.from(swiperInstance.slides).indexOf(slideElement)
                    : -1;
                const currentIndex = rawIndex >= 0 ? rawIndex : swiperInstance.activeIndex;

                // 현재 퀴즈를 배열에서 제거
                quizzes.splice(currentIndex, 1);

                // Swiper에서 현재 슬라이드 제거
                swiperInstance.removeSlide(currentIndex);

                console.log('[QuizAnswer] removed slide', currentIndex, 'remaining:', quizzes.length);

                // 모든 퀴즈를 완료한 경우
                if (quizzes.length === 0) {
                    console.log('[QuizAnswer] all quizzes completed');
                    showAllQuizzesCompleted();
                }
            }, 800);
        } else {
            // 오답 애니메이션 적용
            quizCard.classList.add('wrong-answer');

            // 애니메이션 종료 후 클래스 제거 및 입력창 다시 선택
            setTimeout(() => {
                quizCard.classList.remove('wrong-answer');
                const currentSlide = quizCard.closest('.swiper-slide');
                const activeSlide = swiperInstance.slides?.[swiperInstance.activeIndex] ?? null;
                if (currentSlide && activeSlide && currentSlide === activeSlide) {
                    answerInput.focus();
                    answerInput.select();
                }
            }, 500);
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
