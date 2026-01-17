/**
 * API 서비스 모듈
 * 서버와의 HTTP 통신을 담당하며, axios를 사용하여 RESTful API 요청을 처리합니다.
 * 모든 API 엔드포인트와 공통 에러 처리 로직을 중앙화하여 관리합니다.
 */

/**
 * API 기본 설정
 * @constant {string} BASE_URL - API 서버의 기본 URL
 */
const BASE_URL = "https://dev.api.dasida.org";

/**
 * API 엔드포인트 경로
 * @constant {Object} ENDPOINTS
 */
const ENDPOINTS = {
  KNOWLEDGE: "/knowledge", // 지식 등록 엔드포인트
  UPLOAD_IMAGE: "/image", // 이미지 업로드 엔드포인트
};

/**
 * axios 인스턴스 생성 및 기본 설정
 * 공통 헤더와 타임아웃 등을 설정합니다.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터
 * 모든 요청 전에 실행되며, 인증 토큰 추가 등의 작업을 수행합니다.
 */
apiClient.interceptors.request.use(
  (config) => {
    // 개발 환경용 API Key 추가
    config.headers["X-API-Key"] = "dasida-dev-demo-key-2024";

    console.log("API 요청:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * 모든 응답을 받은 후 실행되며, 공통 에러 처리를 수행합니다.
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log("API 응답:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("API 에러:", error);

    // 에러 타입별 처리
    if (error.response) {
      // 서버가 2xx 범위를 벗어나는 상태 코드로 응답
      console.error("응답 에러:", error.response.status, error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      console.error("응답 없음:", error.request);
    } else {
      // 요청 설정 중 에러 발생
      console.error("요청 설정 에러:", error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * 지식(knowledge)을 서버에 등록합니다.
 * JSON 형식으로 title, text, images를 전송합니다.
 *
 * @param {Object} data - 등록할 지식 데이터
 * @param {string} data.title - 제목
 * @param {string} data.text - 내용
 * @param {string[]} data.images - 이미지 URL 배열 (최대 3개)
 * @returns {Promise<Object>} 서버 응답 데이터 (needPushPermission 포함)
 * @throws {Error} API 요청 실패 시 에러 발생
 *
 * @example
 * const data = {
 *   title: '제목',
 *   text: '내용',
 *   images: ['https://example.com/image1.jpg']
 * };
 * const result = await submitKnowledge(data);
 */
export async function submitKnowledge(data) {
  try {
    const payload = {
      title: data.title,
      text: data.text, // content → text로 필드명 변경
      images: data.images || [], // 이미지 URL 배열 추가
    };

    const response = await apiClient.post(ENDPOINTS.KNOWLEDGE, payload);

    return response.data;
  } catch (error) {
    // 에러 처리 및 사용자 친화적 메시지 생성
    let errorMessage = "지식 등록에 실패했습니다.";

    if (error.response) {
      // 서버가 에러 응답을 보낸 경우
      switch (error.response.status) {
        case 400:
          errorMessage = "입력 데이터가 올바르지 않습니다.";
          break;
        case 401:
          errorMessage = "인증이 필요합니다. 다시 로그인해주세요.";
          break;
        case 403:
          // 백엔드에서 3회 제한 에러
          errorMessage =
            error.response.data?.message ||
            "지식 등록은 최대 3회까지만 가능합니다.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
    }

    throw new Error(errorMessage);
  }
}

/**
 * 이미지를 업로드하고 공개 URL을 반환합니다.
 * multipart/form-data로 파일을 전송합니다.
 *
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise<string>} 업로드된 이미지의 공개 URL
 * @throws {Error} 이미지 업로드 실패 시 에러 발생
 */
export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(ENDPOINTS.UPLOAD_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.imageUrl;
  } catch (error) {
    let errorMessage = "이미지 업로드에 실패했습니다.";

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "이미지 파일이 올바르지 않습니다.";
          break;
        case 413:
          errorMessage = "파일 크기가 너무 큽니다.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
    }

    throw new Error(errorMessage);
  }
}

/**
 * API 서버의 상태를 확인합니다.
 * 헬스체크용 엔드포인트로 사용할 수 있습니다.
 *
 * @returns {Promise<boolean>} 서버 정상 여부
 */
export async function checkServerHealth() {
  try {
    const response = await apiClient.get("/health");
    return response.status === 200;
  } catch (error) {
    console.error("서버 상태 확인 실패:", error);
    return false;
  }
}

/**
 * API 기본 URL을 반환합니다.
 * 디버깅이나 테스트 목적으로 사용할 수 있습니다.
 *
 * @returns {string} API 기본 URL
 */
export function getBaseURL() {
  return BASE_URL;
}
