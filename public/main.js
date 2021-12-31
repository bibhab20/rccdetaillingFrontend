var beams, columns, structure;
const uploadButton = document.getElementById('upload-btn');
const downloadButton = document.getElementById('download-btn');
const submitButton = document.getElementById("submit-btn");
var statusLabel = document.getElementById("status-lable");
var fileNameLabel = document.getElementById("file-chosen");
var downloadButtonLabel = document.getElementById("download-btn-label");
var srcfile;

console.log("inside main");
downloadButtonLabel.hidden = true;
// add event listener
uploadButton.addEventListener('change', () => {
    srcfile = uploadButton.files[0];
    fileNameLabel.textContent= uploadButton.files[0].name;
});

submitButton.addEventListener('click',() => {
    console.log("inside submit button listner");
    if(srcfile){
        console.log("src file found");
        statusLabel.innerHTML = "Processing Please Wait";
        uploadFile(uploadButton.files[0]);
    }
});
downloadButton.addEventListener('click', () =>{
    console.log("inside download button listener");
    if(structure){
        downloadCSV(getBeamCSV(), "beams");
    }
});

const uploadFile = (file) => {

    // add file to FormData object
    const fd = new FormData();
    fd.append('file', file);
    console.log("inside upload file");
    // send `POST` request
    fetch('https://rccdetailling.herokuapp.com/api/v1/upload', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(json => {
        structure = json;
        console.log(structure);
        beams = structure["beams"];
        columns = structure["columns"];
        console.log("*********Beams***********");
        console.log(beams);
        statusLabel.innerHTML = "Your file is ready to download";
        downloadButtonLabel.hidden = false;
    })
    .catch(err => console.error(err));

    
}

function downloadCSV(csvStr, filename) {

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = filename+'\.csv';
    hiddenElement.click();
}

function getBeamCSV(){

    JsonFields = ["Type","Pass", "Segment Number", "Incidence", "Length","Size X","Size Y", 
    "Top Reinforcement start", "Top Reinforcement mid", "Top Reinforcement end","Bottom Reinforcement", "cover",
    "Concrete Grade", "Main ReinforcementGrade", "Shear ReinforcementGrade",
    "Shear Reinforcement_1", "Shear Reinforcement_2", "Shear Reinforcement_3","Shear Reinforcement_4","Shear Reinforcement_5"];
    var csvStr = JsonFields.join(",") + "\n";
    var topReinforcementStart, topReinforcementMid, topReinforcementEnd, bottomReinforcement;
    var shearReinforcement_0, shearReinforcement_1, shearReinforcement_2, shearReinforcement_3, shearReinforcement_4;
    beams.forEach(element => {
        type = element.type;
        pass = element.pass;
        segmentNumber = element.segmentNumber;
        incidence = element.incidence;
        length = element.length;
        sizeX = element.size[0];
        sizeY = element.size[1];
        if(element.topReinforcement){
            topReinforcementStart = element.topReinforcement["start"];
            topReinforcementMid = element.topReinforcement["mid"];
            topReinforcementEnd = element.topReinforcement["end"];
            
        }
        if(element.bottomReinforcement){
            bottomReinforcement = element.bottomReinforcement;
        }  
        cover = element.cover;
        concreteGrade = element.concreteGrade;
        mainReinforcementGrade = element.mainReinforcementGrade;
        shearReinforcementGrade = element.shearReinforcementGrade;
        if(element.shearReinforcement && element.shearReinforcement.length ==5){
            shearReinforcement_0 = getshearReinforcementString(element.shearReinforcement[0]);
            shearReinforcement_1 = getshearReinforcementString(element.shearReinforcement[1]);
            shearReinforcement_2 = getshearReinforcementString(element.shearReinforcement[2]);
            shearReinforcement_3 = getshearReinforcementString(element.shearReinforcement[3]);
            shearReinforcement_4 = getshearReinforcementString(element.shearReinforcement[4]);
        }

        csvStr += type + ','+pass+','+ segmentNumber +','+ incidence +','+length+','+sizeX+','+sizeY+','+
        topReinforcementStart +','+ topReinforcementMid +','+topReinforcementEnd +','+
        bottomReinforcement +','+ cover +','+concreteGrade+','+mainReinforcementGrade +','+shearReinforcementGrade +','+
        shearReinforcement_0 +','+shearReinforcement_1 +','+','+shearReinforcement_2+','+shearReinforcement_3 +','+shearReinforcement_4+"\n";
    });
    return csvStr;
}

function getColumnsCsv(){

}

function getshearReinforcementString(shearReinforcement){
    var str = "diameter: "+ shearReinforcement["diameter"];
    str+= "leg: "+ shearReinforcement["leg"];
    str+= "spacing: "+ shearReinforcement["spacing"];
    return str;
}

