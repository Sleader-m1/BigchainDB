import {Link} from "react-router-dom";

function Home() {
    return (
        <div className={"centered-element"}>
            <div className={"student-container"}>
                <h1>Система хранения работ студентов</h1>
                <br/><br/>
                <img src={"./images/dashboard-logo.png"} width={"400px"} alt={"dashboard-logo"}/>
                <br/><br/>
                <Link className={"back-link"} to='/dashboard/submit'>Добавить студента</Link>
                <Link className={"back-link"} to='/dashboard/get'>Данные студента</Link>
                <Link className={"back-link"} width='200' to='/dashboard/update'>Обновить данные студента</Link>
                <Link className={"back-link"} to='/dashboard/delete'>Удалить студента</Link>
            </div>
        </div>
    );
}

export default Home;