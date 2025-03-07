import '../../App.css'

export default function Production(){
    return (
        <div className="content">
            <div className="form">
                <div className="formInput">
                    <label for="product"><h3>Product</h3></label>
                    <input></input>
                </div>
                <div className="formInput">
                    <label for="vat"><h3>Vat Number</h3></label>
                    <input></input>
                </div>
                <div className="formInput">
                    <label for="Sweight"><h3>Start Weight</h3></label>
                    <input></input> 
                </div>
                <div className="formInput">
                    <label for="Eweight"><h3>End Weight</h3></label>
                    <input></input>
                </div>
                <button>Add</button>
            </div>
            <div className="tableContent">
                <h2>Production Report</h2>
                <table className="process-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Starting Weight</th>
                            <th>Ending Weight</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Pork</td>
                            <td>10</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Beef</td>
                            <td>5</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Chicken</td>
                            <td>8</td>
                            <td>10</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}