const taxToggle = document.querySelector(".tax-toggle");
const checkbox = document.getElementById("flexSwitchCheckDefault");

taxToggle.addEventListener("click", function (event) {
    const postTax = document.getElementsByClassName("post-tax");
    const preTax = document.getElementsByClassName("pre-tax");
    if (postTax[0].style.display == "none") {
        for (let pT of postTax) {
            pT.style.display = "inline";
        }
        for (let pT of preTax) {
            pT.style.display = "none";
        }
    } else {
        for (let pT of postTax) {
            pT.style.display = "none";
        }
        for (let pT of preTax) {
            pT.style.display = "inline";
        }
    }

    // Prevent the label's default behavior of toggling the checkbox twice
    if (event.target.tagName === "INPUT") {
        return;
    }

    checkbox.checked = !checkbox.checked;
});
