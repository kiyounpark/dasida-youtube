/**
 * 홈 화면 렌더링 모듈
 * 퀴즈 카드와 지식 목록의 HTML 생성 및 DOM 렌더링을 담당합니다.
 */

/**
 * 텍스트 최대 길이 상수
 * @constant {number} MAX_PREVIEW_LENGTH - 지식 미리보기 최대 길이
 */
const MAX_PREVIEW_LENGTH = 50;

/**
 * 퀴즈 카드 HTML을 생성합니다.
 * 질문을 Swiper 슬라이드로 렌더링합니다.
 *
 * @param {Object} quiz - 퀴즈 데이터
 * @param {number} quiz.id - 퀴즈 ID
 * @param {string} quiz.question - 퀴즈 질문
 * @param {string} quiz.answer - 퀴즈 정답
 * @param {string} quiz.source - 지식 출처
 * @returns {string} 퀴즈 카드 HTML (Swiper 슬라이드)
 */
export function createQuizCardHTML(quiz) {
    const quizId = quiz.quizId ?? quiz.id ?? '';

    return `
        <div class="swiper-slide">
            <div class="quiz-card" data-quiz-id="${quizId}">
                <div class="quiz-content">
                    <div class="quiz-question">${quiz.question}</div>
                    <div class="quiz-answer-input-container">
                        <input
                            type="text"
                            class="quiz-answer-input"
                            placeholder="정답을 입력하세요"
                            autocomplete="off"
                            aria-label="정답 입력"
                        />
                        <button type="button" class="submit-answer-button">확인</button>
                    </div>
                </div>
                <div class="quiz-source">${quiz.source || '지식'}</div>
            </div>
        </div>
    `;
}

/**
 * 지식 아이템 HTML을 생성합니다.
 * 제목과 내용 미리보기를 포함한 지식 아이템을 렌더링합니다.
 *
 * @param {Object} knowledge - 지식 데이터
 * @param {number} knowledge.id - 지식 ID
 * @param {string} knowledge.title - 지식 제목
 * @param {string} knowledge.text - 지식 내용
 * @returns {string} 지식 아이템 HTML
 */
export function createKnowledgeItemHTML(knowledge) {
    const preview = truncateText(knowledge.text, MAX_PREVIEW_LENGTH);

    return `
        <div class="knowledge-item" data-knowledge-id="${knowledge.id}">
            <div class="knowledge-title">${knowledge.title}</div>
            <div class="knowledge-preview">${preview}</div>
        </div>
    `;
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표를 추가합니다.
 * 텍스트가 최대 길이를 초과하면 잘라서 "..."를 추가합니다.
 *
 * @param {string} text - 자를 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 잘린 텍스트
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * 빈 상태 메시지를 표시합니다.
 * 데이터가 없을 때 사용자에게 안내 메시지를 보여줍니다.
 *
 * @param {HTMLElement} container - 메시지를 표시할 컨테이너
 * @param {string} message - 표시할 메시지
 */
export function showEmptyState(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <div class="empty-message">${message}</div>
        </div>
    `;
}

/**
 * 로딩 스피너를 표시합니다.
 * 데이터를 불러오는 동안 로딩 상태를 표시합니다.
 *
 * @param {HTMLElement} container - 스피너를 표시할 컨테이너
 */
export function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

/**
 * 퀴즈 카드를 렌더링합니다.
 * 퀴즈 목록을 받아서 화면에 표시합니다.
 *
 * @param {Array} quizzes - 퀴즈 목록
 */
export function renderQuizCards(quizzes) {
    const container = document.getElementById('quizCardContainer');

    if (!quizzes || quizzes.length === 0) {
        showEmptyState(container, '아직 생성된 퀴즈가 없어요');
        return;
    }

    container.innerHTML = quizzes.map(quiz => createQuizCardHTML(quiz)).join('');
}

/**
 * 지식 목록을 렌더링합니다.
 * 지식 목록을 받아서 화면에 표시합니다.
 *
 * @param {Array} knowledges - 지식 목록
 */
export function renderKnowledgeList(knowledges) {
    const container = document.getElementById('knowledgeList');

    if (!knowledges || knowledges.length === 0) {
        showEmptyState(container, '등록된 지식이 없어요');
        return;
    }

    container.innerHTML = knowledges.map(knowledge => createKnowledgeItemHTML(knowledge)).join('');
}
