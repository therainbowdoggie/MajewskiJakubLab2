let notes =[];
if(localStorage.getItem("testObject")===null){              // tworzenie localStorage
    localStorage.setItem('testObject', JSON.stringify(notes));
}

document.addEventListener( "DOMContentLoaded", () => {      // Nasłuchiwanie na wypełnienie formularzu
    let form = document.getElementById( "form" );
    form.addEventListener( "submit", function( e ) {
        e.preventDefault();
        let json = toJSONString( this );
    }, false);
});

var retrievedObject = localStorage.getItem('testObject'); // pobieranie danych z localstorage
notes = JSON.parse(retrievedObject);
showNotes();


document.getElementById('popup').style.display = 'none';
document.querySelector(".addNote").addEventListener('click', function(){
    showForm();
})

function showForm(){
    let mainStream = document.getElementById('mainStream');
    let popup = document.getElementById('popup')
    
    if (popup.style.display === "none"){
        mainStream.style.height = "21vw"
        popup.style.display = 'block'
    }else {
        mainStream.style.height = "5vw"
        popup.style.display = 'none'
    }
}
function showNotes(){                           // funkcja odświeżanai notatek na stronie
let notesDiv = document.getElementById("notesDiv"); // połączenie do diva z notatkami get element pobieranie wszystkich elementow po nazwie i div
for(i=1;i<notesDiv.childElementCount;i++){       // czyszczenie diva z notatkami
    notesDiv.removeChild[i];
}
let ids=0;
notes.forEach(element => {                          // stworz element dla kazdej notatki
    let note = document.createElement("div");
    note.className = "note "+element.color;
    note.id=ids++;

    if(element.priority==1){                        // priorytet notatki
        note.style.order=1;
    }
    let noteTitle = document.createElement('textarea'); // dodanie tytułu
    noteTitle.className="noteTitle";
    noteTitle.value = element.title;
    noteTitle.disabled=true;

    
    let noteDesc = document.createElement('textarea'); //dodanie opisu
    noteDesc.className="noteDesc";
    noteDesc.value = element.description;
    noteDesc.disabled=true;

    let noteFooter= document.createElement('footer');   //dodanie daty
    noteFooter.className="noteFooter";
    noteFooter.appendChild(document.createTextNode("Last modified:"+element.date));

    let noteCheck = document.createElement('input');    // Dodanie checkboxa
    noteCheck.type='checkbox';
    if(element.priority==1){
        noteCheck.checked=true;
    }
    else{
        noteCheck.checked=false;
    }
    noteCheck.disabled=true;

    let noteEdit = document.createElement('button');        // przycisk edycji
    noteEdit.innerText="Edit";
    noteEdit.onclick=(e)=>                              // funkcjonalność edycji
    {
        e.target.parentNode.parentNode.childNodes[0].disabled=false; 
        e.target.parentNode.parentNode.childNodes[1].disabled=false;
        e.target.parentNode.childNodes[3].disabled=false;
        noteSave.hidden=false;
        noteEdit.hidden=true;
    };
    let noteSave = document.createElement('button');            // przycisk zapisz
    noteSave.innerText="Save";
    noteSave.hidden=true;
    noteSave.onclick = (e)=>                                    // funcjonalność zapisz
    {           
        parentDiv=e.target.parentNode.parentNode;
        noteSave.hidden=true;
        noteEdit.hidden=false;
        alert("You changed note, please refresh page")
        notes[note.id].title=parentDiv.childNodes[0].value;     // zamiana danych
        notes[note.id].description=parentDiv.childNodes[1].value;
        if(e.target.parentNode.childNodes[3].checked==true){
            notes[note.id].priority=1;
        }
        else{
            notes[note.id].priority=2;            
        }
        parentDiv.childNodes[0].disabled=true;
        parentDiv.childNodes[1].disabled=true;
        e.target.parentNode.childNodes[3].disabled=true;
        notes[note.id].date= new Date();
        localStorage.setItem('testObject', JSON.stringify(notes)); //wysłanie zmian do localstorage i odświeżenie danych
        showNotes();
    }

    note.appendChild(noteTitle);                        // Tworzenie diva
    note.appendChild(noteDesc);
    noteFooter.appendChild(noteEdit);
    noteFooter.appendChild(noteSave);
    noteFooter.appendChild(noteCheck);
    note.appendChild(noteFooter);

    let flag= true;
    notesDiv.childNodes.forEach(e=>{
        if(e.id==note.id){
            flag=false;
            }
        })
    if(flag){
        notesDiv.appendChild(note);                          //ostateczne dodanie notatki        
    }
});
}


function toJSONString( form ) {             // Dodanie notatki z formularzu

    let obj = {};
    let elements = form.querySelectorAll( "input, select, textarea" ); //zbiera wszystkie elementy formularzu
    for( var i = 0; i < elements.length; ++i ) {                        // i przypisuje im odpowiednie wartości.
        let element = elements[i];
        let name = element.name;
        let value;
        if(element.type =="checkbox"){
            if(element.checked== true){
                 value = 1;
            }   
            else{ value = 2;}
        }
        else{
             value = element.value;
        }
        if( name ) {
            obj[ name ] = value;
        }
    }
    obj["color"]= form.parentNode.className.split(' ')[1];
    console.log(obj["color"]);
    obj["date"] = new Date();
    notes.push(obj)                                             //dodanie do notatek, wysłanie do localstorage
    localStorage.setItem('testObject', JSON.stringify(notes));
    showNotes();                                                // i odświeżenie danych
}


function changeColor(e){                                        // Zmiana koloru
    let parent = e.parentNode.parentNode.parentNode.parentNode;
    parent.classList.remove("blue");
    parent.classList.remove("black");
    parent.classList.remove("red");
    parent.classList.remove("yellow");
    parent.classList.remove("green");
    parent.classList.add(e.className.split(' ')[1]);
}