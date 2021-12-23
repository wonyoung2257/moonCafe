// step1 요구사항 정리
// - 추가 -
// [x] 에스프레소 메뉴에 새로운 메뉴를 확인버튼 클릭으로 추가한다.
//     [ x ] 엔터키 입렵으로 추가한다.
// [x] 메뉴 추가 후 input은 빈 값으로 초기화 한다.
// [x]] 사용자 입력값이 빈값이면 추가하지 않는다.
// [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
//     - 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - 수정 -
// [x] 수정 버튼을 누르면 메뉴 이름을 입력할 수 있는 prompt를 띄운다.
// [X] prompt의 확인 창을 누르면 입력한 값으로 메뉴 명이 바뀐다.
// - 삭제 -
// [x] 삭제 버튼을 누르면 confirm 창을 띄운다.
// [x] confirm 에서 확인을 누르면 메뉴가 삭제 된다.
// [x ] 삭제 되면 총 메뉴 갯수도 수정한다.

// step2 요구사항 정리
//  - localStorage -
// [x] localStorage에 메뉴 데이터를 저장한다.
// [x] localStorage에 저장 된 데이터를 불러온다.

//  - 각각 메뉴 관리 부분
// [ ] 메뉴판을 버튼을 클릭하여 메뉴판을 변경할 수 있다.
// [ ] 에스프레소 메뉴판을 관리할 수 있다.
// [ ] 프라푸치노 메뉴판을 관리할 수 있다.
// [ ] 블렌디드 메뉴판을 관리할 수 있다.
// [ ] 티바나 메뉴판을 관리할 수 있다.
// [ ] 디저트 메뉴판을 관리할 수 있다.
// [ ] 최초 접속시 에스프레소 메뉴를 localStorage에서 불러와 우선 보이게 한다.
//   - 품절 처리 부분 -
// [ ] 품절버튼을 추가한다.
// [ ] 버튼 클릭시 sold-out class를 추가하여 상태를 토글로 변경한다.

/**
 * 메뉴는 배열로 들어가야함
 * 메뉴를 가지는 배열을 만들어서 localStorage에 저장
 * 배열을 순환하여 메뉴판에 보여준다.
 */

const $ = (tag) => document.querySelector(tag);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

function APP() {
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length > 0) {
      this.menu = store.getLocalStorage();
      render();
    }
  };

  const addMenuName = () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("메뉴 이름을 입력해주세요");
      return;
    }

    // $("#menu-list").insertAdjacentHTML("beforeend", menuTemplate(menuName));
    this.menu.push({ name: menuName });
    store.setLocalStorage(this.menu);
    render();
    updateMenuCount();
  };

  const render = () => {
    const menuTemplate = this.menu
      .map((meneItem) => {
        return `
      <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${meneItem.name}</span>
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
      })
      .join("");
    $("#menu-list").innerHTML = menuTemplate;
    updateMenuCount();
  };

  const updateMenuCount = function () {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const changeMenu = prompt("수정할 이름을 입력해주세요", $menuName.innerText);
    $menuName.innerText = changeMenu;
  };

  const removeMenuName = (e) => {
    if (confirm("삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  // 클릭해서 추가하기
  $("#menu-submit-button").addEventListener("click", () => {
    addMenuName();
  });

  // 엔터키로 추가하기
  $("#menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

const app = new APP();
app.init();
