const BASE_URL = "http://localhost:3000";

// 옵션을 객체로 만들어 재사용할 수 있게 함
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
    console.error(e);
  }
  return response.json();
};

const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.error(e);
  }
  return response;
};

const MenuApi = {
  async getAllMenuByCategory(category) {
    return request(`${BASE_URL}/api/category/${category}/menu`); // 옵션에 아무것도 넣지않으면 GET으로 동작
  },

  async createMenu(category, name) {
    return request(`${BASE_URL}/api/category/${category}/menu`, HTTP_METHOD.POST({ name }));
  },
  async updateMenu(category, name, menuId) {
    return request(`${BASE_URL}/api/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
  },
  async deleteMenu(category, menuId) {
    //데이터가 없는 상태에서 데이터 파씽하여 에러발생
    return requestWithoutJson(`${BASE_URL}/api/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
  },
  async toggleSoldOut(category, menuId) {
    return request(`${BASE_URL}/api/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
  },
};

export default MenuApi;
