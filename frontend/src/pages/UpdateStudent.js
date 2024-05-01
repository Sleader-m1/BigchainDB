import {useState} from "react";
import {Link} from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import {PatchCall, PostCall} from "../api/ApiCalls";


function UpdateStudent() {
    const [output, setOutput] = useState({nic: "", name: "", address: "", contact: ""});
    const [student, setStudent] = useState({nic: "", name: "", address: "", contact: ""});
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        console.log(selectedFiles);
    };

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
        if (!/^\d{9}[Vv]$/.test(student.nic)) {
            setErrMessage("ID студента не найден или не введен");
            document.getElementById("nic").focus();
            return;
        } else if (!/^[A-Za-z][A-Za-z ]+$/.test(student.name)) {
            setErrMessage("Имя студента не найдено или не введено");
            document.getElementById("name").focus();
            return;
        } else if (!/^[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/.test(student.address)) {
            setErrMessage("Почта студента не найден или не введен");
            document.getElementById("address").focus();
            return;
        } else if (!/^\d{3}-\d{7}$/.test(student.contact)) {
            setErrMessage("Телефон студента не найден или не введен");
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
            setOutput({nic: "", name: "", address: "", contact: ""});
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
                    <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Введите Почта" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Введите телефон" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br/>
                    <center>
                        <form id="upload-container" method="POST">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>

                            <div>
                                <input id="file-input" type="file" name="file" multiple onChange={handleFileChange}/>
                                <center>
                                    <label for="file-input">Выберите файл</label>
                                    <span>или перетащите его сюда</span>
                                </center>
                            </div>
                        </form>
                    </center>
                    <button onClick={handleCheckOut} type={"button"}>Проверить данные</button>
                    <button type={"submit"}>Обновить данные студента</button>
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

export default UpdateStudent;