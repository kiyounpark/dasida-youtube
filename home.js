/**
 * 홈 화면 메인 스크립트
 * 직접 입력한 지식 기반 생성된 퀴즈와 지식 목록을 표시합니다.
 * 모듈화된 구조로 API 서비스, 렌더러, 이벤트 핸들러를 통합합니다.
 */

import { fetchHomeData } from './modules/home/homeApiService.js';
import { renderQuizCards, renderKnowledgeList, showLoading, showEmptyState } from './modules/home/homeRenderer.js';
import { setupAddKnowledgeButton, setupKnowledgeItemClick, setupQuizCardClick, setupQuizAnswerSubmit, setupBottomNavigation } from './modules/home/homeEventHandler.js';
import { initQuizSwiper } from './modules/home/quizSwiper.js';

/**
 * 홈 화면을 초기화하고 데이터를 로드합니다.
 * API에서 퀴즈와 지식 데이터를 가져와 화면에 표시합니다.
 */
async function initHome() {
    const quizContainer = document.getElementById('quizCardContainer');
    const knowledgeContainer = document.getElementById('knowledgeList');

    // 로딩 상태 표시
    showLoading(quizContainer);
    showLoading(knowledgeContainer);

    try {
        // 홈 데이터 가져오기
        const homeData = await fetchHomeData();

        // 퀴즈와 지식 렌더링
        renderQuizCards(homeData.quizzes);
        renderKnowledgeList(homeData.knowledges);

        // 퀴즈 스와이퍼 초기화
        if (homeData.quizzes && homeData.quizzes.length > 0) {
            initQuizSwiper(homeData.quizzes);
            setupQuizAnswerSubmit(homeData.quizzes);
        }

    } catch (error) {
        console.error('홈 화면 초기화 실패:', error);
        showEmptyState(quizContainer, '퀴즈를 불러올 수 없어요');
        showEmptyState(knowledgeContainer, '지식을 불러올 수 없어요');
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initHome();
    setupAddKnowledgeButton();
    setupKnowledgeItemClick();
    setupQuizCardClick();
    setupBottomNavigation();
});
