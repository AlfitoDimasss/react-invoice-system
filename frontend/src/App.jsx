import InvoiceForm from "./components/InvoiceForm.jsx";
import InvoiceList from "./components/InvoiceList.jsx";
import {useState} from "react";

const App = () => {
    const [showForm, setShowForm] = useState(false)

    const handleToggleShowForm = () => {
        setShowForm(prevState => !prevState)
    }

    return (
        <div className='wrapper min-h-screen flex justify-center items-center flex-col'>
            <InvoiceList handleToggleShowForm={handleToggleShowForm} showForm={showForm}>
                {showForm && <InvoiceForm handleToggleShowForm={handleToggleShowForm}/>}
            </InvoiceList>
        </div>
    )
}

export default App