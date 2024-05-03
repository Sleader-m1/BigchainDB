import {useState} from "react";
import {Link} from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import {GetCall} from "../api/ApiCalls";

function GetStudent() {
    const [output, setOutput] = useState({nic: "", name: "", email: "", contact: ""});
    const [nic, setNic] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        setOutput({nic: "", name: "", email: "", contact: ""});
        setResponseMessage("");
        setErrMessage("");
        const newNic = event.target.value;
        setNic(newNic);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!/^[a-zA-Z0-9]+$/.test(nic)) {
            setErrMessage("ID студента не найден или не введен");
            document.getElementById("nic").focus();
            return;
        }
        try {
            const response = await GetCall(nic);
            setResponseMessage("Данные студента успешно получены");
            setOutput({
                nic: response.data.nic,
                name: response.data.name,
                email: response.data.email,
                contact: response.data.contact
            });
        }
        catch (err) {
            if (err.response) {
                setResponseMessage(err.response.data.message);
            } else {
                setResponseMessage(`Error: ${err.message}`);
            }
        }
        finally {
            setNic("");
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"100px"} alt={"student-logo"}/>
            <div className="student-container">
                <h1>Получить данные студента</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Введите ID студента"/>
                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    <button type={"submit"}>Получить данные студента</button>
                    <Link className={"back-link"} to='/dashboard'>Назад</Link>
                </form>
                <OutputContainer
                    nic={output.nic}
                    name={output.name}
                    address={output.email}
                    contact={output.contact}
                />
                <br/>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default GetStudent;