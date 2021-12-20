// $표시는 관용적으로 쿼리 셀럭터로 사용됨
const $ = (selector) => document.querySelector(selector);

function App() {
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

    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#espresso-menu-name").value = "";
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
}

App();
console.log("asdfas");
