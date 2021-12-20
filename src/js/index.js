// $표시는 관용적으로 쿼리 셀럭터로 사용됨
const $ = (selector) => document.querySelector(selector);

function App() {
  /////메뉴 수정////////
  // 1. 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
  // 2. 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#espresso-menu-name").value = "";
  };
  // 이벤트 위임
  $("#espresso-menu-list").addEventListener("click", (e) => {
    // console.log(e.target);
    if (e.target.classList.contains("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedMenuName = prompt("메뉴명을 수정해 주세요", $menuName.innerText);
      $menuName.innerText = updatedMenuName;
    }
    // 메뉴 삭제
    if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("삭제하시겠습니까?")) {
        e.target.closest("li").remove();
        updateMenuCount();
      }
    }
  });

  ///////메뉴 추가 //////
  // fomr태그가 자동으로 전송되는걸 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }

    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    // 새로 입력된 값을 덮어버림
    // $("#espresso-menu-list").innerHTML = menuItemTemplate(espressoMenuName);
    $("#espresso-menu-list").insertAdjacentHTML("afterbegin", menuItemTemplate(espressoMenuName));
    updateMenuCount();
  };
  console.log("asdf");
  $("#espresso-menu-submit-button").addEventListener("click", () => {
    addMenuName();
  });

  // 메뉴의 이름을 입력 받는다.
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });

  // ///////메뉴 삭제 ///////////
  // 1. 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
  // 2. 확인 버튼을 클릭하면 메뉴가 삭제된다.
  // 3. 총 메뉴 갯수를 count하여 상단에 보여준다.
}

App();
