var beams, columns, structure,columnLines;
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
        downloadCSV(getColumnLinesCsv(),"column lines");
        downloadCSV(getColumnsCsv(),"columns");
        
    }
});

const uploadFile = (file) => {

    // add file to FormData object
    const fd = new FormData();
    fd.append('file', file);
    console.log("inside upload file");
    // send `POST` request
    fetch('http://localhost:8080/api/v1/upload', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(json => {
        structure = json;
        console.log(structure);
        beams = structure["beams"];
        columns = structure["columns"];
        columnLines = structure["columnLineResponses"];
        console.log("*********colunmLines***********");
        console.log(columnLines);
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
        else{
            console.log("found beam with null Top Reinforcement having segment number: "+element.segmentNumber);
        }
        if(element.bottomReinforcement){
            bottomReinforcement = element.bottomReinforcement;
        }
        else{
            console.log("found beam with null Bottom Reinforcement having segment number: "+element.segmentNumber);
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
        else{
            console.log("found beam with null shearReinforcement having segment number: "+element.segmentNumber);
        }

        csvStr += type + ','+pass+','+ segmentNumber +','+ incidence +','+length+','+sizeX+','+sizeY+','+
        topReinforcementStart +','+ topReinforcementMid +','+topReinforcementEnd +','+
        bottomReinforcement +','+ cover +','+concreteGrade+','+mainReinforcementGrade +','+shearReinforcementGrade +','+
        shearReinforcement_0 +','+shearReinforcement_1 +','+','+shearReinforcement_2+','+shearReinforcement_3 +','+shearReinforcement_4+"\n";
    });
    return csvStr;
}

function getColumnsCsv(){
    JsonFields = ["Type","Pass", "Segment Number", "Incidence", "Length","CrossSection X","CrossSection Y", "cover","Required Steel Area",
    "tieReinforcement diameter","tieReinforcement tie",
     "Main ReinforcementGrade", "Tie Reinforcement Grade","Concrete Grade"];
    var csvStr = JsonFields.join(",") + "\n";
    var tieReinforementDiameter,tieReinforementTie,crossSectionX,crossSectionY;
    columns.forEach(element => {
        type = element.type;
        pass = element.pass;
        segmentNumber = element.segmentNumber;
        incidence = element.incidence;
        length = element.length;
        if(element.crossSection){
            crossSectionX = element.crossSection[0];
            crossSectionY = element.crossSection[1];
        }
        else{
            console.log("found column with null cross section having segment number: "+element.segmentNumber);
        }
        cover = element.cover;
        requiredSteelArea = element.requiredSteelArea;
        if(element.tieReinforement){
            tieReinforementDiameter = element.tieReinforement["diameter"];
            tieReinforementTie = element.tieReinforement["tie"];
        }
        else{
            console.log("found column with null tie reinforcement having segment number: "+ element.segmentNumber);
        }
       
        mainReinforcementGrade = element.mainReinforcementGrade;
        tieReinforcementGrade = element.tieReinforcementGrade;
        concreteGrade = element.concreteGrade;

        csvStr += type + ','+pass + ','+segmentNumber + ','+incidence + ','+length + ','+crossSectionX + ','+crossSectionY + ','+cover + ','+requiredSteelArea + ','+
        tieReinforementDiameter + ','+tieReinforementTie + ','+mainReinforcementGrade + ','+tieReinforcementGrade + ','+ concreteGrade + "\n";

    });

    return csvStr;

}

function getColumnLinesCsv(){
    console.log("inside getColumnLinesCsv");
    JsonFields = ["Node Number","Cross Section X", "Cross Section Y", "Maximum Required Steel Area", "All Required Steel Areas -> "];
    var csvStr = JsonFields.join(",") + "\n";
    var crossSectionX,crossSectionY;
    columnLines.forEach(element =>{
        nodeNumber = element.nodeNumber;
        if(element.crossSection){
            crossSectionX = element.crossSection[0];
            crossSectionY = element.crossSection[1];
        }
        else{
            console.log("colunline with null corss section found having nodeId: "+ element.nodeNumber)
        }
        
        maxRequiredSteelArea = element.maxRequiredSteelArea;
        csvStr += nodeNumber + ','+ crossSectionX + ','+ crossSectionY + ','+ maxRequiredSteelArea;
        for(i in element.requiredSteelAreas){
            csvStr+= ','+element.requiredSteelAreas[i];
        }
        csvStr+= "\n";
    });
    return csvStr;
}

function getshearReinforcementString(shearReinforcement){
    var str = "diameter: "+ shearReinforcement["diameter"];
    str+= "leg: "+ shearReinforcement["leg"];
    str+= "spacing: "+ shearReinforcement["spacing"];
    return str;
}

