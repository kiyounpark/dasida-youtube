/**
 * 홈 화면 API 서비스 모듈
 * 홈 화면 데이터 조회를 담당하며, axios를 사용하여 RESTful API 요청을 처리합니다.
 */

/**
 * API 기본 설정
 * @constant {string} API_BASE_URL - API 서버의 기본 URL
 */
const API_BASE_URL = 'https://local.api.dasida.org:8443';

/**
 * API 키
 * @constant {string} API_KEY - 개발 환경용 API 키
 */
const API_KEY = 'dasida-dev-demo-key-2024';

/**
 * 기본 복습 간격 타입
 * @constant {number} DEFAULT_DAY_TYPE - 기본 복습 간격 타입 값
 */
const DEFAULT_DAY_TYPE = 0;

/**
 * axios 인스턴스 생성 및 기본 설정
 * 공통 헤더와 타임아웃 등을 설정합니다.
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
});

/**
 * 홈 데이터를 가져옵니다.
 * IP 기반 demo 사용자의 퀴즈와 지식 목록을 조회합니다.
 *
 * @returns {Promise<Object>} 퀴즈와 지식 목록을 포함한 홈 데이터
 * @returns {Array} return.quizzes - 퀴즈 목록
 * @returns {Array} return.knowledges - 지식 목록
 * @throws {Error} API 요청 실패 시
 *
 * @example
 * const homeData = await fetchHomeData();
 * console.log(homeData.quizzes);
 * console.log(homeData.knowledges);
 */
export async function fetchHomeData() {
    try {
        const response = await apiClient.get('/home');
        return normalizeHomeData(response.data);
    } catch (error) {
        console.error('홈 데이터 조회 실패:', error);
        throw error;
    }
}

/**
 * 홈 응답 데이터를 프론트 규격에 맞게 정규화합니다.
 *
 * @param {Object} homeData - 홈 응답 데이터
 * @returns {Object} 정규화된 홈 응답 데이터
 */
function normalizeHomeData(homeData) {
    if (!homeData) return homeData;

    const quizzes = Array.isArray(homeData.quizzes)
        ? homeData.quizzes.map((quiz) => ({
            ...quiz,
            dayType: quiz.dayType ?? quiz.day_type,
            quizId: quiz.quizId ?? quiz.quiz_id,
            answerLength: quiz.answerLength ?? quiz.answer_length
        }))
        : homeData.quizzes;

    const knowledges = Array.isArray(homeData.knowledges)
        ? homeData.knowledges.map((knowledge) => ({
            ...knowledge,
            dayType: knowledge.dayType ?? knowledge.day_type
        }))
        : homeData.knowledges;

    return {
        ...homeData,
        hasRegisteredKnowledge: homeData.hasRegisteredKnowledge ?? homeData.has_registered_knowledge,
        quizzes,
        knowledges
    };
}

/**
 * 퀴즈 정답을 제출합니다.
 *
 * @param {number} quizId - 퀴즈 ID
 * @param {string} answer - 사용자가 입력한 정답
 * @param {number} dayType - 복습 간격 타입 (0, 3, 7, 30)
 * @returns {Promise<Object>} 정답 여부를 포함한 응답
 * @returns {boolean} return.correct - 정답 여부
 * @throws {Error} API 요청 실패 시
 */
export async function submitQuizAnswer(quizId, answer, dayType = 0) {
    try {
        const resolvedDayType = DEFAULT_DAY_TYPE;
        const response = await apiClient.post(`/quizzes/${quizId}/answers`, {
            answer: answer.trim(),
            day_type: resolvedDayType
        });
        return response.data;
    } catch (error) {
        console.error('퀴즈 정답 제출 실패:', error);

        const responseData = error.response?.data;
        if (responseData) {
            if (typeof responseData === 'string') {
                throw new Error(responseData);
            }
            if (responseData.message) {
                throw new Error(responseData.message);
            }
            if (responseData.error) {
                throw new Error(responseData.error);
            }

            const fieldMessages = Object.entries(responseData)
                .filter(([, value]) => typeof value === 'string')
                .map(([field, message]) => `${field}: ${message}`);

            if (fieldMessages.length > 0) {
                throw new Error(fieldMessages.join(' '));
            }
        }

        throw new Error('정답 제출에 실패했습니다');
    }
}
