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
// [x] 메뉴판을 버튼을 클릭하여 메뉴판을 변경할 수 있다.
// [x] 에스프레소 메뉴판을 관리할 수 있다.
// [x] 프라푸치노 메뉴판을 관리할 수 있다.
// [x] 블렌디드 메뉴판을 관리할 수 있다.
// [x] 티바나 메뉴판을 관리할 수 있다.
// [x] 디저트 메뉴판을 관리할 수 있다.
// [x] 최초 접속시 에스프레소 메뉴를 localStorage에서 불러와 우선 보이게 한다.
//   - 품절 처리 부분 -
// [x] 품절버튼을 추가한다.
// [x] 버튼 클릭시 sold-out class를 추가하여 상태를 토글로 변경한다.
/**
 * step 3 요구사항 정리
 *  - API 적용하기
 * [x] 메뉴 생성하기 api를 사용하여 메뉴를 추가한다.
 * [x] 카테코리별 메뉴리스트 불러오기 api를 사용하여 메뉴를 추가한다.
 * [x]] 메뉴 이름 수정하기 api를 사용하여 메뉴 이름을 update한다.
 * [x] 메뉴 삭제하기 api를 사용하여 메뉴를 삭제한다.
 * [x] 메뉴 품점 처리 api를 사용하여 메뉴를 품절처리 한다.
 *
 * [x] localStorage에 저장하는 로직은 지운다.
 * [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.
 *
 * [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
 * [ ] 중복되는 메뉴는 추가할 수 없다.
 */

import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";

function APP() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCartagory = "espresso";
  this.init = async () => {
    this.menu[this.currentCartagory] = await MenuApi.getAllMenuByCategory(this.currentCartagory);
    eventListener();
    render();
  };

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("메뉴 이름을 입력해주세요");
      return;
    }
    const duplicateItem = this.menu[this.currentCartagory].find((menuItem) => menuItem.name === menuName);
    if (duplicateItem) {
      alert("이미 등록된 메뉴입니다.");
      $("#menu-name").value = "";
      return;
    }
    await MenuApi.createMenu(this.currentCartagory, menuName);
    this.menu[this.currentCartagory] = await MenuApi.getAllMenuByCategory(this.currentCartagory);
    render();
    updateMenuCount();
  };

  const render = async () => {
    this.menu[this.currentCartagory] = await MenuApi.getAllMenuByCategory(this.currentCartagory);
    const menuTemplate = this.menu[this.currentCartagory]
      .map((menuItem) => {
        return `
        <li data-menu-id = ${menuItem.id} class="menu-list-item d-flex items-center py-2">
          <span class="${menuItem.isSoldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${menuItem.name}</span>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
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

  const updateMenuCount = () => {
    // 화살표 함수의 this와 익명함수 this가 서로 다른 객체를 가르켜 에러 발생
    const menuCount = this.menu[this.currentCartagory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정해 주세요", menuName.innerText);
    await MenuApi.updateMenu(this.currentCartagory, updatedMenuName, menuId);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCartagory, menuId);
      render();
      updateMenuCount();
    }
  };

  const toggleSoldOut = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOut(this.currentCartagory, menuId);
    render();
  };

  const changeCategory = (e) => {
    if (e.target.tagName === "BUTTON") {
      const menuTitle = e.target.innerText;
      this.currentCartagory = e.target.dataset.categoryName;
      $("#category-title").innerText = `${menuTitle} 메뉴 관리`;
      render();
    }
  };

  const eventListener = () => {
    $("nav").addEventListener("click", (e) => {
      changeCategory(e);
    });

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        toggleSoldOut(e);
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
  };
}

const app = new APP();
app.init();
