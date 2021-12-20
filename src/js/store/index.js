const store = {
  // 데이터 변경하는 부분을 최대한 적게하기 위해 따로 객체로 선언
  setLocalStorage(menu) {
    // 로컬스토리에는 문자값만 넣을 수 있음
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
