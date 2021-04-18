const displayModal = () => {

  //body element selector
  const body = document.querySelector("body");
  body.style.width = "100%";
  body.style.height = "100%";
  body.style.overflow = "hidden";

  // modal element created
  const modal = document.createElement("div");
  modal.className = "GDPR__modal";

  // popup element created
  const popup = document.createElement("div");
  popup.className = "GDPR__popup";
  popup.innerHTML = "<h1>GDPR consent</h1>";

  // form element
  const form = document.createElement("form");
  form.className = "GDPR__form-container";

  // form items list
  const formItems = document.createElement("div");
  formItems.className = "GDPR__form-items";

  // form buttons
  const buttons = document.createElement("div");
  buttons.className = "GDPR__form-buttons";

  const acceptButton = document.createElement("button");
  acceptButton.innerHTML = "ACCEPT";
  acceptButton.setAttribute("type", "submit");
  acceptButton.setAttribute("id", "accepted");

  const rejectButton = document.createElement("button");
  rejectButton.innerHTML = "REJECT";
  rejectButton.setAttribute("type", "submit");
  rejectButton.setAttribute("id", "rejected");

  // buttons - onClick functions
  const saveForm = (e) => {
    const data = e.srcElement;
    const inputs = data.querySelectorAll("input");

    let acceptedContractorsId = [];
    inputs.forEach((i) => i.checked && acceptedContractorsId.push(i.id));

    const cookie = { decision: e.submitter.id, acceptedContractorsId };

    const today = new Date();
    const expiresDate = new Date(today);
    expiresDate.setDate(expiresDate.getDate() + 1);
    document.cookie = `GDPR=${JSON.stringify(
      cookie
    )}; expires= ${expiresDate.toUTCString()}`;
  };

  // download and render contractors list
  const renderContractor = (contractor) => {
    const contractorElement = document.createElement("div");
    contractorElement.className = "GDPR__form-item";
    contractorElement.innerHTML = `<div>
            <input type="checkbox" id=${contractor.id}>
            <label for"${contractor.id}">${contractor.name}
            <a href="${contractor.policyUrl}">(read contractor policy)</a>
            </label>
        </div>`;

    formItems.appendChild(contractorElement);
  };

  const fetchData = () => {
    fetch("http://optad360.mgr.consensu.org/cmp/v2/vendor-list.json")
      .then((res) => res.json())
      .then((data) => {
        const contractors = Object.values(data.vendors);
        contractors.forEach((c) => renderContractor(c));
      });
  };

  fetchData();

  // display all elements
  buttons.appendChild(acceptButton);
  buttons.appendChild(rejectButton);
  form.appendChild(formItems);
  form.appendChild(buttons);
  popup.appendChild(form);
  modal.appendChild(popup);
  document.body.appendChild(modal);

  form.addEventListener("submit", saveForm)
};

// should modal be rendered
const currentCookies = document.cookie;
currentCookies.length ===0 && displayModal()

if ((currentCookies.length > 0)) {
  const cookieObject = currentCookies
    .split(";")
    .map((cookie) => cookie.split("="))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key.trim()]: decodeURIComponent(value),
      }),
      {}
    );

    !cookieObject.GDPR && displayModal();
}