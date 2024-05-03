import {useState} from "react";
import {Link} from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import {PatchCall, PostCall} from "../api/ApiCalls";


function UpdateStudent() {
    const [output, setOutput] = useState({nic: "", name: "", email: "", contact: ""});
    const [student, setStudent] = useState({nic: "", name: "", email: "", contact: ""});
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
        })
    }

    function handleCheckOut() {
        setResponseMessage("");
        setErrMessage("");
        if (!/^[a-zA-Z0-9]+$/.test(student.nic)) {
            setErrMessage("ID студента не найден или не введен");
            document.getElementById("nic").focus();
            return;
        } else if (!/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё ]+$/.test(student.name)) {
            setErrMessage("Имя студента не найдено или не введено");
            document.getElementById("name").focus();
            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/.test(student.email)) {
            setErrMessage("Почта студента не найден или не введен");
            document.getElementById("email").focus();
            return;
        } else if (!/^\+?\d{1,2}\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(student.contact)) {
            setErrMessage("Телефон студента не найден или не введен");
            document.getElementById("contact").focus();
            return;
        }
        setOutput({nic: student.nic, name: student.name, email: student.email, contact: student.contact});
        setStudent({nic: "", name: "", email: "", contact: ""});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!output.nic || !output.name || !output.email || !output.contact) {
            setErrMessage("Значение не проверены");
            return;
        }
        try {
            const response = await PatchCall(output.nic, output);
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
            setOutput({nic: "", name: "", email: "", contact: ""});
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"}/>
            <div className="student-container">
                <h1>Обновить данные студента</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Введите ID" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Введите имя" />
                    <input onChange={handleChange} value={student.email} id="email" name="email" placeholder="Введите Почта" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Введите телефон" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    
                    <button onClick={handleCheckOut} type={"button"}>Проверить данные</button>
                    <button type={"submit"}>Обновить данные студента</button>
                    <Link className={"back-link"} to='/dashboard'>Вернуться</Link>
                </form>
                
                <br/>
                <OutputContainer
                    nic={output.nic}
                    name={output.name}
                    email={output.email}
                    contact={output.contact}
                />
                <br/>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default UpdateStudent;