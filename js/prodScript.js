function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}
let generateIdButton = () => {
  let button = document.createElement("button");
  button.className = "btn-primary btn-small";
  button.innerHTML = "Generate IDs";
  button.setAttribute("onclick", "generateIds(csv)");
  document.getElementById("buttonspace").append(button);
};

var progress = document.querySelector(".percent");
let csv;
let json;
function updateProgress(evt) {
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      progress.style.width = percentLoaded + "%";
      progress.textContent = percentLoaded + "%";
    }
  }
}

var fileInput = document.getElementById("csvFile"),
  readFile = function(evt) {
    progress.style.width = "0%";
    progress.textContent = "0%";

    var reader = new FileReader();
    reader.onprogress = updateProgress;
    reader.onloadstart = function(e) {
      document.getElementById("progress_bar").className = "loading";
    };
    reader.onload = function() {
      progress.style.width = "100%";
      progress.textContent = "100%";
      // document.getElementById("prompt").innerHTML = reader.result;
      csv = reader.result;
      generateIdButton();
      console.log(csv);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
    // start reading the file. When it is done, calls the onload event defined above.
    reader.readAsText(fileInput.files[0]);
  };

let generateIds = csv => {
  console.log("begin", json);
  json = CSVJSON.csv2json(csv, { parseNumbers: true });
  console.log(json);
  generateCards(json);
};
let generateCards = arr => {
  let filler = document.querySelector("#filler");
  arr.map((obj, index) => {
    let objId = index;
    let div = document.createElement("div");
    div.className = `col-md-4 col-sm-12 card card border-dark mb-3`;
    let name = obj.Names;
    let role = obj.Department;
    let staffNo = obj.ID_No;
    let family = obj.Family;

    div.innerHTML = `<div class="card-header bg-transparent border-success">
      <p>Department: ${role}</p>
      <p>Person: ${name}</p>
      <p>Family: ${family}</p>
    </div>
    <div class="card-body" >
      <div class="idBox1" id="idCard${objId}">
        <img src="backie.jpg" alt="Cinque Terre" crossorigin="anonymous"  />
        <div class="tester1" id="imgBox${objId}"></div>

        <div class="bottom">
          <p><span class="tiga"><strong>Name:</strong></span>&nbsp;${name}</p>
          <p><span class="tiga"><strong>Dept:</strong></span> &nbsp;&nbsp;${role}</p>
          <p><span class="tiga"><strong>ID No: </strong></span>&nbsp;${staffNo}</p>
        </div>

      </div>
    </div>
    <div class="card-footer">
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="imgFile">Image</label>
          <input
            type="file"
            id="imgFile${objId}"
            aria-aria-describedby="imgHelp"
          />
          <small id="imgHelp" class="form-text text-warning"
            >Strictly CSV files Please</small
          >
        </div>
        <div class="form-group col-md-6" id="idCard${objId}f">
          <button
            type="button"
            class="btn btn-primary btn-small"
            id="${objId}"
            onclick="addIdImage(this.id)"
          >
            Add Image
          </button>
          <button
            type="button"
            class="btn btn-success btn-small"
            id="${objId}"
            onclick="generateId(this.id)"
          >
            Get ID
          </button>
        </div>
      </div>
    </div>`;
    filler.append(div);
  });
};

let addIdImage = id => {
  let pic = document.querySelector(`#imgFile${id}`).files[0];
  let imgBox = document.querySelector(`#imgBox${id}`);
  while (imgBox.firstChild) imgBox.removeChild(imgBox.firstChild);
  var image = new Image();
  image.setAttribute("height", 240);
  image.setAttribute("width", 180);
  let reader = new FileReader();
  reader.readAsDataURL(pic);
  reader.onload = () => {
    console.log("imageloaded");
    image.src = reader.result;
    imgBox.append(image);
  };
  reader.onerror = function(error) {
    alert("There was an error please retry");
    console.log("Error: ", error);
  };
};
let generateId = id => {
  // JsBarcode(`#barcode${id}`, `json[id].ID_No`, {
  //   // format: "pharmacode",
  //   lineColor: "#fff",
  //   background: "#00000000",
  //   width: 0.8,
  //   height: 20,
  //   displayValue: false
  // });
  let newId = document.querySelector(`#idCard${id}`);
  var boxe = document.getElementById("prompt");
  let footer = document.querySelector(`#idCard${id}f`);
  console.log(`#idCard${id}f`);
  let dname = json[id].Names;
  console.log("Gotten Id", dname);

  html2canvas(newId).then(canvas => {
    // let img = convertCanvasToImage(canvas);
    // boxe.append(canvas);
    console.log("begun");
    let lnk = document.createElement("a"),
      e;
    lnk.className = "btn btn-primary btn-sm";
    lnk.innerHTML = "Download";
    lnk.download = `${dname} Card`;
    lnk.href = canvas.toDataURL("image/png;base64");
    footer.append(lnk);
  });
};
fileInput.addEventListener("change", readFile);
