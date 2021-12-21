const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error("에러가 발생했습니다.");
  }
  return response.json();
};

// 응답받은 데이터가 없을 때 사용한다.
const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error();
  }
  return response;
};

const MenuApi = {
  async getAllMenuByCategory(category) {
    // 데이터 불러오는 함수는 옵션 따로 넣지 않아도 됨
    return request(`${BASE_URL}/category/${category}/menu`);
    // 이 부분 다시 공부해보기
    // then에서의 리턴은 then에서만 받을 수 있음
  },

  async createMenu(category, name) {
    return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name }));
  },
  async updateMenu(category, name, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
  },
  async toggleSoldOut(category, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
  },
  async deleteMenu(category, menuId) {
    return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
  },
};

export default MenuApi;
