var beams, columns, structure;
const input = document.getElementById('avatar');
const downloadButton = document.getElementById('download');
console.log("inside main");
// add event listener
input.addEventListener('change', () => {
    uploadFile(input.files[0]);
});

downloadButton.addEventListener('click', () =>{
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
        shearReinforcement = element.shearReinforcement;

        csvStr += type + ','+pass+','+ segmentNumber +','+ incidence +','+length+','+sizeX+','+sizeY+','+cover+"\n";
    });
    return csvStr;
}

function getColumnsCsv(){

}

