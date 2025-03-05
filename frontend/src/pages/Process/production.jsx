import '../../App.jsx'

export default function Production(){
    return (
        <div className="content">
            <div className="form">
            Product <br/> Vat Number <br/> Start Weight <br/> End Weight <br/>
            </div>
            <div className="tableContent">
                <h2>Production Report</h2>
                <table>
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