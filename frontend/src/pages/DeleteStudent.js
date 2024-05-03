import {Link} from "react-router-dom";
import {useState} from "react";
import {DeleteCall} from "../api/ApiCalls";

function DeleteStudent() {
    const [nic, setNic] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
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
            await DeleteCall(nic);
            setResponseMessage("Студент успешно удален из базы данных");
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
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"}/>
            <div className="student-container">
                <h1>Удалить студента</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Введите ID студента"/>
                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    <button type={"submit"}>Удалить студента</button>
                    <Link className={"back-link"} to='/dashboard'>Назад</Link>
                </form>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default DeleteStudent;