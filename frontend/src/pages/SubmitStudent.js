import {useState} from "react";
import {Link} from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import {PostCall} from "../api/ApiCalls";

function SubmitStudent() {
    const [output, setOutput] = useState({nic: "", name: "", address: "", contact: ""});
    const [student, setStudent] = useState({nic: "", name: "", address: "", contact: ""});
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    function handleChange(event) {
        const {name, value} = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    function handleCheckOut() {
        setErrMessage("");
        setResponseMessage("");
        if (!/^[a-zA-Z0-9]+$/.test(student.nic)) {
            setErrMessage("ID студента не введено или не найдено");
            document.getElementById("nic").focus();
            return;
        } else if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё ]+$/.test(student.name)) {
            setErrMessage("Имя студента не введено или не найдено");
            document.getElementById("name").focus();
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(student.address)) {
            setErrMessage("Почта студента не введена или не найдена");
            document.getElementById("address").focus();
            return;
        } else if (!/^\+?\d{1,2}\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(student.contact)) {
            setErrMessage("Номер телефона студента не введен или не найден");
            document.getElementById("contact").focus();
            return;
        }
        setOutput({nic: student.nic, name: student.name, address: student.address, contact: student.contact});
        setStudent({nic: "", name: "", address: "", contact: ""});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!output.nic || !output.name || !output.address || !output.contact) {
            setErrMessage("Значения не проверены");
            return;
        }
        try {
            const response = await PostCall(output);
            setResponseMessage("Студент добавлен в базу данных");
        }
        catch (err) {
            if (err.response) {
                setResponseMessage(err.response.data.message);
            } else {
                setResponseMessage(`Error: ${err.message}`);
            }
        }
        finally {
            setOutput({nic: "", name: "", address: "", contact: ""});
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"}/>
            <div className="student-container">
                <h1>Добавить студента</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Введине ID студента" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Введите имя студента" />
                    <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Введите Почта студента" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Введите номер телефона студента" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    <button onClick={handleCheckOut} type={"button"}>Проверить данные</button>
                    <button type={"submit"}>Добавить студента</button>
                    <Link className={"back-link"} to='/dashboard'>Вернуться</Link>
                </form>
                <br/>
                <OutputContainer
                    nic={output.nic}
                    name={output.name}
                    address={output.address}
                    contact={output.contact}
                />
                <br/>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default SubmitStudent;