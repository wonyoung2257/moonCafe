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

// //step2 요구사항
// ㅁ localStorage Read & Write
// 1. localStorage에 데이터를 저장한다.
// 2. 새로고침해도 데이터를 읽어온다.

// ㅁ 메뉴판 관리
// 에스프레소 메뉴판 관리
// 프라푸치노 메뉴판 관리
// 블렌디드 메뉴판 관리
//  티바나 메뉴판 관리,
//  디저트 메뉴판 관리

// 페이지 접근시 최초 데이터 read & write
// 1. 페이지에 최초로 접근할 때 localStorage 데이터를 읽어온다.
// 2. 에스프레소 메뉴를 페이지에 그려준다.

// 1.품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// 2.품절 버튼을 추가한다.
// 3.품절 버튼을 클릭하면 localStorage에 상태갑이 저장된다.
// 4.품정 해당메뉴의 상태값이 페이지에 그려진다.
// 5.클릭이벤트에서 해당 class속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector);

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

function App() {
  // 상태는 변하는 값 - 메뉴명
  this.menu = [];
  this.init = () => {
    if (store.getLocalStorage().length > 0) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu
      .map((item, index) => {
        // 태크의 data 값 찾아보기
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${item.name}</span>
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
    // $("#espresso-menu-list").innerHTML = menuItemTemplate(espressoMenuName);
    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#espresso-menu-name").value = "";
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정해 주세요", menuName.innerText);
    this.menu[menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  // 이벤트 위임
  $("#espresso-menu-list").addEventListener("click", (e) => {
    // console.log(e.target);
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    // 메뉴 삭제
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  ///////메뉴 추가 //////
  // fomr태그가 자동으로 전송되는걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력 받는다.
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

const app = new App();
app.init();
