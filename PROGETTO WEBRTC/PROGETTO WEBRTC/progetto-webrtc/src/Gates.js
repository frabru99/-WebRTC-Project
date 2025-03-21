import './Gates.css';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function Gates() {

    //variabile di stato che memorizza l'id relativo all'ingresso/uscita selezionata
    const [id_gates, setIDGates] = useState(0);
    const [random_ID, setRandomID] = useState(""); //il random ID serve come misura di sicurezza e viene generato dalla scheda ESP-32 NOW che fa da server

    //questo effetto collaterale si verifica ogni volta che cambia lo stato di random ID
    useEffect(() => {

        //evitiamo che gestisca il valore corrispondente a quello di default
        if(id_gates===0){
            return;
        }

        const xhr = new XMLHttpRequest(); //definisco una richiesta XML HTTP
        xhr.open('POST','http://192.168.122.89/gates', true); //genero la richiesta HTTP in base all'id ottenuto
        xhr.onload = function() {
            setIDGates(0);
            if(xhr.status===200){ //se va tutto ok,
                toast.success("Gate "+id_gates+" azionato con successo!");
            } else if (xhr.status === 401) {
                toast.error("Posti non cambiati! Richiesta non autorizzata.");
            } else { //altrimenti mostro un pop-up di errore in basso a sinistra
                toast.error("Errore nell'azionamento del Gate "+id_gates+"!");
            }
        };

        //se dovesse andare male la richiesta,
        xhr.onerror = function(){
            toast.error("Errore nell'azionamento del Gate "+id_gates+"!"); //mostro un pop-up di errore
        };

        //console.log(JSON.stringify({ id:id_gates, random: random_ID}));
        xhr.send(JSON.stringify({id:id_gates, random:random_ID})); //mando la richiesta al server

    }, [random_ID]);


    //effetto collaterale che si verifica ogni volta che si aggiorna id_gates, ossia ogni volta che si clicca un bottone
    useEffect(() => {

        //qui evitiamo che l'effetto si triggheri anche quando la variabile di stato ha il suo valore di default
        if(id_gates===0){
            return;
        }

        //GET alla schedina server per ottenere l'ID random
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "http://192.168.122.89/2002200001280929", true);

        xhr.onload = () =>{
            if(xhr.status===200){
                setRandomID(xhr.responseText); //setto l'ID random che mi ha fornito il server sulla scheda
            }
        }

         //se dovesse andare male la richiesta,
        xhr.onerror = function(){
            toast.error("Errore nell'azionamento del Gate!"); //mostro un pop-up di errore
        };

        xhr.send();

    }, [id_gates])


    return (
        <div className="Gates">
            <div className="container">
                <p><strong>Apri/Chiudi Gates</strong></p>
                <div className="section">
                    <p>
                    <button className="button" onClick={() => setIDGates(1)}>Ingresso 1</button>
                    <strong> </strong>
                    <button className="button" onClick={() => setIDGates(2)}>Ingresso 2</button>
                    </p>
                    <p>
                    <button className="button" onClick={() => setIDGates(3)}>Uscita 1</button>
                    <strong> </strong>
                    <button className="button" onClick={() => setIDGates(4)}>Uscita 2</button>
                    </p>
                </div>

                <div className="Caution">
                    <div className="section"> 
                        <p> 
                            <strong>
                                Attenzione: Per usufruire delle piene funzionalità si consiglia di visitare la pagina da un Personal Computer.
                            </strong>
                        </p>
                    </div>
                </div>

            </div>

            
                
            

        </div>
    );
}

export default Gates;
