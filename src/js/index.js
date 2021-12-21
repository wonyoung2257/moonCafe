// $표시는 관용적으로 쿼리 셀럭터로 사용됨

// ///////메뉴 삭제 ///////////
// 1. 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// 2. 확인 버튼을 클릭하면 메뉴가 삭제된다.
// 3. 총 메뉴 갯수를 count하여 상단에 보여준다.

/////메뉴 수정////////
// 1. 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
// 2. 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// 새로 알게된 메서드
// insertAdjacentHTML, $표시로 DOM 조작하기, 이벤트 위임 다시 찾아보기

// 리팩토링
// 1. 선언부분과 바인드부분을 구분한다. 선언을 위로 올려 한번에 볼 수 있게 한다.
// 2. 하나의 기능들을 바인드부분에서 사용하지 않고 함수로 작성하여 사용한다.
// 3. 화살표함수를 사용하지 않아도 되는 것은 생략하여 가독성을 높힌다.
// step 2
// 1. 한 파일에는 대표가 되는 것 하나만 남겨두는 것이 좋다. '$', 'store'를 다른 파일로 분리
// 2. 유사한 것을 묶어서 관리한다. -> eventListener
// 3. 코드의 통일성을 올린다. -> 문자열을 수정하던 것을 ->render함수로 대체함
// 4. 중복되는 코드를 지운다. -> count하는 함수를 중복되던 것을 지움
// step 3
// 1. js에서 키 벨류 이름이 같으면 하나만 적어도 된다.

// //step2 요구사항
// ㅁ localStorage Read & Write
// 1. localStorage에 데이터를 저장한다.
// 2. 새로고침해도 데이터를 읽어온다.

// ㅁ 메뉴판 관리
// 에스프레소 메뉴판 관리
// 프라푸치노 메뉴판 관리
// 블렌디드 메뉴판 관리
//  티바나 메뉴판 관리
//  디저트 메뉴판 관리

// 페이지 접근시 최초 데이터 read & write
// 1. 페이지에 최초로 접근할 때 localStorage 데이터를 읽어온다.
// 2. 에스프레소 메뉴를 페이지에 그려준다.

// 1.품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// 2.품절 버튼을 추가한다.
// 3.품절 버튼을 클릭하면 localStorage에 상태갑이 저장된다.
// 4.품정 해당메뉴의 상태값이 페이지에 그려진다.
// 5.클릭이벤트에서 해당 class속성 값에 sold-out을 추가한다.

//step3 요구사항
// 웹 서버를 띄운다.
// 서버에 새로운 메뉴명을 추가될 수 있도록 요청한다.
// 서버에 카테고리별 메뉴리스트를 불러온다.
// 서버에 메뉴가 수정 될 수 있도록 요청한다.
// 서버에 메뉴 품절상태를 토클될 수 있도록 요청한다.
// 서버에 메뉴가 삭제 될 수 있도록 요청한다.
// async, await - 순서를 보장해주고 싶은 곳에 await를 붙인다. 서버와 통신하는 부분만 뭍인다.
import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    // 이 부분 다시 공부해보기
    // then에서의 리턴은 then에서만 받을 수 있음
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },
  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
  async updateMenu(category, name, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
    return response.json();
  },
  async toggleSoldOut(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
      method: "PUT",
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
  async deleteMenu(category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("에러가 발생했습니다.");
    }
  },
};

function App() {
  // 상태는 변하는 값 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso";
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item) => {
        // 태크의 data 값 찾아보기
        return `
        <li data-menu-id="${item.id}" class=" menu-list-item d-flex items-center py-2">
        <span class=" ${item.isSoldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${item.name}</span>
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

    // 새로 입력된 값을 덮어버림
    // $("#menu-list").innerHTML = menuItemTemplate(espressoMenuName);
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#menu-name").value = "";
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }

    const menuName = $("#menu-name").value;

    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    $("#menu-name").value = "";

    // this.menu[this.currentCategory].push({ name: menuName }); 로컬 전용
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정해 주세요", menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
      // this.menu[this.currentCategory].splice(menuId, 1);
      // store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOut(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);

    render();
  };

  const initEventListeners = () => {
    // 이벤트 위임
    $("#menu-list").addEventListener("click", (e) => {
      // console.log(e.target);
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      // 메뉴 삭제
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    ///////메뉴 추가 //////
    // fomr태그가 자동으로 전송되는걸 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력 받는다.
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name"); // boolean값의 변수는 is접두어 붙임

      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
