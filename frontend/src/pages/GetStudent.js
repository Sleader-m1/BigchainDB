import { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { GetCall } from "../api/ApiCalls";

function GetStudent() {
    const [output, setOutput] = useState({ nic: "", name: "", email: "", contact: "", priv_key: "", pub_key: "" });
    const [nic, setNic] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [file, setFile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    function handleChange(event) {
        setOutput({ nic: "", name: "", email: "", contact: "", priv_key: "", pub_key: "" });
        setTransactions([]);
        setResponseMessage("");
        setErrMessage("");
        setNic(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!/^[a-zA-Z0-9]+$/.test(nic)) {
            setErrMessage("ID студента не найден или не введен");
            return;
        }
        try {
            const response = await GetCall(nic);
            setResponseMessage("Данные студента успешно получены");
            setOutput({
                nic: response.data.nic,
                name: response.data.name,
                email: response.data.email,
                contact: response.data.contact,
                priv_key: response.data.priv_key,
                pub_key: response.data.pub_key,
            });
        } catch (err) {
            setErrMessage(err.response ? err.response.data.message : `Error: ${err.message}`);
        }
    }

    async function handleFileUpload(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("privateKey", output.priv_key);

        try {
            const response = await fetch('http://95.164.32.14:8080/app/api/students/upload_file', {
                method: 'POST',
                body: formData,
            });
            setResponseMessage("Файл успешно загружен!");
        } catch (error) {
            setErrMessage("Ошибка загрузки файла: " + error.message);
        }
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    function handleFileChange1(event){
        setFile(event.target.files[0]);
        const element = document.getElementById('filename');
        if (element) {
          element.textContent = event.target.files[0].name;
        }
    };

    async function fetchTransactions() {
        setLoadingTransactions(true);
        try {
            const response = await fetch(`http://95.164.32.14:8080/app/api/students/files?publicKey=${output.pub_key}`);
            const data = await response.json();
            setTransactions(data.transactions);
            setResponseMessage(data.message);
        } catch (error) {
            setErrMessage(`Error fetching transactions: ${error.message}`);
        }
        setLoadingTransactions(false);
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"100px"} alt={"student-logo"} />
            <div className="student-container">
                <h1>Получить данные студента</h1>
                <h5>{errMessage}&nbsp;</h5>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={nic} id="nic" name="nic" placeholder="Введите ID студента" />
                    <button type={"submit"}>Получить данные студента</button>
                    <Link className={"back-link"} to='/dashboard'>Назад</Link>
                </form>
                {output.priv_key && (
                    <>
                        <OutputContainer
                            nic={output.nic}
                            name={output.name}
                            email={output.email}
                            contact={output.contact}
                        />
                        <p>Загрузить файл в Bigchaindb</p>
                        <form onSubmit={handleFileUpload}>
                            <label class="input-file">
	                           	<span class="input-file-text" type="text" id="filename"></span>
	                           	<input type="file" name="file" onChange={handleFileChange1} />        
 	                           	<span class="input-file-btn">Выберите файл</span>
 	                        </label>
                            <br/>
                            <button type="submit">Загрузить файл</button>
                        </form>
                        <button onClick={fetchTransactions} disabled={loadingTransactions}>
                            Получить прошлые транзакции
                        </button>
                        <center>
                        {transactions.length > 0 && (
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>ID транзакции</th>
                                        <th>Имя файла</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{tx.id}</td>
                                            <td>{tx.metadata.name}</td>
                                            <td>
                                                <a href={`http://95.164.32.14:8080/app/api/students/transaction?transactionid=${tx.id}`} download>
                                                    Скачать
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        </center>
                    </>
                )}
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default GetStudent;
