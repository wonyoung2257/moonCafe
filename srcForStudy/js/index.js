// 1. 요구사항 정리
// - 추가 -
// [x] 에스프레소 메뉴에 새로운 메뉴를 확인버튼 클릭으로 추가한다.
//     [ x ] 엔터키 입렵으로 추가한다.
// [x] 메뉴 추가 후 input은 빈 값으로 초기화 한다.
// [x]] 사용자 입력값이 빈값이면 추가하지 않는다.
// [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
//     - 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - 수정 -
// [ ] 수정 버튼을 누르면 메뉴 이름을 입력할 수 있는 prompt를 띄운다.
// [ ] prompt의 확인 창을 누르면 입력한 값으로 메뉴 명이 바뀐다.
// - 삭제 -
// [ ] 삭제 버튼을 누르면 confirm 창을 띄운다.
// [ ] confirm 에서 확인을 누르면 메뉴가 삭제 된다.
// [ ] 삭제 되면 총 메뉴 갯수도 수정한다.

const $ = (tag) => document.querySelector(tag);

function APP() {
  const addMenuName = (menuName) => {
    const menuTemplate = `
      <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${menuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>`;
    if (menuName === "") {
      alert("메뉴 이름을 입력해주세요");
      return;
    }
    $("#menu-list").insertAdjacentHTML("beforeend", menuTemplate);
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#menu-name").value = "";
  };

  $("#menu-form").addEventListener("keypress", (e) => {
    e.preventDefault();
  });
  // 클릭해서 추가하기
  $("#menu-submit-button").addEventListener("click", () => {
    const menuName = $("#menu-name").value;
    addMenuName(menuName);
  });

  // 엔터키로 추가하기
  $("#menu-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const menuName = $("#menu-name").value;
      addMenuName(menuName);
    }
  });
}

const app = new APP();
