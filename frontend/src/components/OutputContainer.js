function OutputContainer(props) {
    return (
        <div>
            <h3>ID студента : {props.nic}</h3>
            <h3>Имя студента : {props.name}</h3>
            <h3>Почта студента : {props.address}</h3>
            <h3>Телефон студента : {props.contact}</h3>
        </div>
    );
}

export default OutputContainer;